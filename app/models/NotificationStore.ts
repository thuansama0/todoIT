import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Notification, notificationApi } from "app/services/api/notificationApi"
import { DEFAULT_LIST_PAGE_SIZE } from "app/constants/pagination"
import {
  appendLocalNotificationLog,
  clearLocalNotifications,
  loadLocalNotificationLog,
  markAllLocalNotificationsAsRead,
  markLocalNotificationAsRead,
  notificationContentKey,
  persistServerNotification,
  purgeNotificationFromLocalLog,
} from "app/utils/localNotificationLog"
import { isDeleteMutationSuccess, isMutationSuccess } from "app/utils/isMutationSuccess"

const NotificationModel = types.model("Notification", {
  id: types.identifier,
  title: types.string,
  content: types.string,
  isRead: types.boolean,
  sentAt: types.number,
})

function normalizeNotification(input: Partial<Notification> & { id: string }) {
  return {
    id: input.id,
    title: input.title ?? "",
    content: input.content ?? "",
    isRead: input.isRead ?? false,
    sentAt: input.sentAt ?? Date.now(),
  }
}

function unreadCountFromItems(items: readonly { isRead: boolean }[]) {
  return items.reduce((n, item) => n + (item.isRead ? 0 : 1), 0)
}

/** Gộp bản ghi trùng nội dung (local-* vs server id) — merge theo id một mình không đủ. */
function dedupeMergedNotifications(
  items: ReturnType<typeof normalizeNotification>[],
): ReturnType<typeof normalizeNotification>[] {
  const sorted = [...items].sort((a, b) => b.sentAt - a.sentAt)
  const byKey = new Map<string, ReturnType<typeof normalizeNotification>>()
  const order: string[] = []

  for (const item of sorted) {
    const minuteBucket = Math.floor(item.sentAt / 60_000)
    const key = `${item.title}\u0000${item.content}\u0000${minuteBucket}`
    const prev = byKey.get(key)
    if (!prev) {
      byKey.set(key, item)
      order.push(key)
      continue
    }
    const preferServer =
      prev.id.startsWith("local-") && !item.id.startsWith("local-")
        ? item
        : item.id.startsWith("local-") && !prev.id.startsWith("local-")
        ? prev
        : prev.sentAt >= item.sentAt
        ? prev
        : item
    byKey.set(key, {
      ...preferServer,
      id: preferServer.id,
      title: preferServer.title,
      content: preferServer.content,
      sentAt: preferServer.sentAt,
      isRead: prev.isRead && item.isRead,
    })
  }

  return order
    .map((k) => byKey.get(k))
    .filter((item): item is ReturnType<typeof normalizeNotification> => item !== undefined)
}

export const NotificationStoreModel = types
  .model("NotificationStore")
  .props({
    items: types.optional(types.array(NotificationModel), []),
    unreadCount: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    isLoaded: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions((store) => {
    const syncUnreadCount = () => {
      store.unreadCount = unreadCountFromItems(store.items.slice())
    }

    const fetchNotifications = flow(function* fetchNotifications() {
      store.isLoading = true
      try {
        const listRes = yield notificationApi.getNotifications(0, DEFAULT_LIST_PAGE_SIZE)

        const localItems = yield loadLocalNotificationLog()
        if (listRes.ok && listRes.data?.success) {
          const serverItems = (listRes.data.data?.items ?? []).map(normalizeNotification)
          const mergedById = new Map<string, any>()
          ;[...localItems.map(normalizeNotification), ...serverItems].forEach((item) => {
            mergedById.set(item.id, item)
          })
          const mergedItems = dedupeMergedNotifications(Array.from(mergedById.values())).sort(
            (a, b) => b.sentAt - a.sentAt,
          )
          store.items.replace(mergedItems)
          store.isLoaded = true
        } else if (localItems.length > 0) {
          const fromLocal = dedupeMergedNotifications(localItems.map(normalizeNotification)).sort(
            (a, b) => b.sentAt - a.sentAt,
          )
          store.items.replace(fromLocal)
          store.isLoaded = true
        }
        syncUnreadCount()
        return { listRes }
      } finally {
        store.isLoading = false
      }
    })

    const loadIfNeeded = flow(function* loadIfNeeded() {
      if (store.isLoaded || store.isLoading) return
      yield fetchNotifications()
    })

    const markRead = flow(function* markRead(id: string) {
      const idx = store.items.findIndex((n) => n.id === id)
      if (idx < 0) return { ok: true, data: { success: true } }
      if (store.items[idx].isRead) return { ok: true, data: { success: true } }

      if (id.startsWith("local-")) {
        yield markLocalNotificationAsRead(id)
        store.items[idx] = { ...store.items[idx], isRead: true }
        syncUnreadCount()
        return { ok: true, data: { success: true } }
      }

      const response = yield notificationApi.markAsRead(id)
      if (isMutationSuccess(response)) {
        store.items[idx] = { ...store.items[idx], isRead: true }
        syncUnreadCount()
      }
      return response
    })

    const markAllRead = flow(function* markAllRead() {
      const response = yield notificationApi.markAllAsRead()
      if (!isMutationSuccess(response)) {
        return response
      }

      yield markAllLocalNotificationsAsRead()
      store.items.replace(store.items.map((n) => ({ ...n, isRead: true })))
      syncUnreadCount()
      return response
    })

    const removeNotificationFromStore = (
      id: string,
      target?: { title: string; content: string; sentAt: number },
    ) => {
      const contentKey = target
        ? notificationContentKey(target.title, target.content, target.sentAt)
        : null
      store.items.replace(
        store.items.filter((n) => {
          if (n.id === id) return false
          if (contentKey && notificationContentKey(n.title, n.content, n.sentAt) === contentKey) {
            return false
          }
          return true
        }),
      )
      syncUnreadCount()
    }

    const deleteNotification = flow(function* deleteNotification(id: string) {
      const target = store.items.find((n) => n.id === id)

      if (id.startsWith("local-")) {
        yield purgeNotificationFromLocalLog({
          id,
          title: target?.title,
          content: target?.content,
          sentAt: target?.sentAt,
        })
        removeNotificationFromStore(id, target)
        return { ok: true, data: { success: true } }
      }

      const response = yield notificationApi.deleteNotification(id)
      if (isDeleteMutationSuccess(response)) {
        yield purgeNotificationFromLocalLog({
          id,
          title: target?.title,
          content: target?.content,
          sentAt: target?.sentAt,
        })
        removeNotificationFromStore(id, target)
      }
      return response
    })

    const deleteAllNotifications = flow(function* deleteAllNotifications() {
      const response = yield notificationApi.deleteAllNotifications()
      if (!isDeleteMutationSuccess(response)) {
        return response
      }

      store.items.clear()
      syncUnreadCount()
      yield clearLocalNotifications()
      return response
    })

    const addLocalNotification = flow(function* addLocalNotification(
      title: string,
      content: string,
      sentAtMs?: number,
    ) {
      const local = yield appendLocalNotificationLog({
        title,
        content,
        sentAt: sentAtMs ?? Date.now(),
      })
      const normalized = normalizeNotification(local)
      store.items.unshift(normalized)
      syncUnreadCount()
      return local
    })

    const addIncomingNotification = flow(function* addIncomingNotification(
      title: string,
      content: string,
      userId?: string,
      sentAtMs?: number,
    ) {
      const duplicate = store.items.some((item) => item.title === title && item.content === content)
      if (duplicate) {
        return { ok: true, data: { success: true, message: "duplicate skipped" } }
      }

      if (!userId) {
        return yield addLocalNotification(title, content, sentAtMs)
      }

      const response = yield notificationApi.createNotification({ userId, title, content })
      if (!isMutationSuccess(response) || !response.data?.data) {
        return response
      }

      const serverRaw = response.data.data
      const normalized = normalizeNotification({
        ...serverRaw,
        title: title || serverRaw.title,
        content: content || serverRaw.content,
        sentAt: sentAtMs ?? serverRaw.sentAt ?? Date.now(),
      })

      if (!store.items.some((item) => item.id === normalized.id)) {
        store.items.unshift(normalized)
      }
      yield persistServerNotification(normalized)
      syncUnreadCount()
      return response
    })

    const resetForAuthChange = flow(function* resetForAuthChange() {
      store.items.clear()
      store.unreadCount = 0
      store.isLoaded = false
      store.isLoading = false
      yield clearLocalNotifications()
    })

    return {
      fetchNotifications,
      loadIfNeeded,
      markRead,
      markAllRead,
      deleteNotification,
      deleteAllNotifications,
      addLocalNotification,
      addIncomingNotification,
      resetForAuthChange,
    }
  })

export interface NotificationStore extends Instance<typeof NotificationStoreModel> {}
export interface NotificationStoreSnapshot extends SnapshotOut<typeof NotificationStoreModel> {}
