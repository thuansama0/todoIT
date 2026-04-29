import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Notification, notificationApi } from "app/services/api/notificationApi"
import {
  appendLocalNotificationLog,
  clearLocalNotifications,
  deleteLocalNotification,
  loadLocalNotificationLog,
  markLocalNotificationAsRead,
} from "app/utils/localNotificationLog"

const NotificationModel = types.model("Notification", {
  id: types.identifier,
  title: types.string,
  content: types.string,
  isRead: types.boolean,
  sentAt: types.number,
})

function normalizeNotification(input: Notification): any {
  return {
    id: input.id,
    title: input.title ?? "",
    content: input.content ?? "",
    isRead: input.isRead ?? false,
    sentAt: input.sentAt ?? Date.now(),
  }
}

export const NotificationStoreModel = types
  .model("NotificationStore")
  .props({
    items: types.optional(types.array(NotificationModel), []),
    unreadCount: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    isLoaded: types.optional(types.boolean, false),
  })
  .actions((store) => {
    const fetchNotifications = flow(function* fetchNotifications() {
      store.isLoading = true
      try {
        const currentItems = store.items.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          isRead: item.isRead,
          sentAt: item.sentAt,
        }))
        const [listRes, countRes] = yield Promise.all([
          notificationApi.getNotifications(0, 50),
          notificationApi.getUnreadCount(),
        ])

        const localItems = yield loadLocalNotificationLog()
        if (listRes.ok && listRes.data?.success) {
          const serverItems = (listRes.data.data?.items ?? []).map(normalizeNotification)
          const mergedById = new Map<string, any>()
          ;[...currentItems, ...localItems.map(normalizeNotification), ...serverItems].forEach((item) => {
            mergedById.set(item.id, item)
          })
          const mergedItems = Array.from(mergedById.values()).sort((a, b) => b.sentAt - a.sentAt)
          store.items.replace(mergedItems)
          store.isLoaded = true
        } else if (localItems.length > 0) {
          store.items.replace(localItems.map(normalizeNotification))
          store.isLoaded = true
        }
        if (countRes.ok && countRes.data?.success) {
          const localUnread = localItems.filter((item: Notification) => !item.isRead).length
          store.unreadCount = (countRes.data.data ?? 0) + localUnread
        } else {
          store.unreadCount = localItems.filter((item: Notification) => !item.isRead).length
        }
        return { listRes, countRes }
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

      store.items[idx] = { ...store.items[idx], isRead: true } as any
      store.unreadCount = Math.max(0, store.unreadCount - 1)

      if (id.startsWith("local-")) {
        yield markLocalNotificationAsRead(id)
        return { ok: true, data: { success: true } }
      }

      const response = yield notificationApi.markAsRead(id)
      if (!response.ok || !response.data?.success) {
        store.items[idx] = { ...store.items[idx], isRead: false } as any
        store.unreadCount += 1
      }
      return response
    })

    const markAllRead = flow(function* markAllRead() {
      const backupItems = store.items.slice()
      const backupUnread = store.unreadCount
      store.items.replace(store.items.map((n) => ({ ...n, isRead: true } as any)))
      store.unreadCount = 0

      const response = yield notificationApi.markAllAsRead()
      if (!response.ok || !response.data?.success) {
        store.items.replace(backupItems as any)
        store.unreadCount = backupUnread
      }
      return response
    })

    const deleteNotification = flow(function* deleteNotification(id: string) {
      const backupItems = store.items.slice()
      const backupUnread = store.unreadCount
      const targetIsUnread = store.items.some((n) => n.id === id && !n.isRead)
      store.items.replace(store.items.filter((n) => n.id !== id))
      if (targetIsUnread) store.unreadCount = Math.max(0, store.unreadCount - 1)

      if (id.startsWith("local-")) {
        yield deleteLocalNotification(id)
        return { ok: true, data: { success: true } }
      }

      const response = yield notificationApi.deleteNotification(id)
      if (!response.ok || !response.data?.success) {
        store.items.replace(backupItems as any)
        store.unreadCount = backupUnread
      }
      return response
    })

    const deleteAllNotifications = flow(function* deleteAllNotifications() {
      const backupItems = store.items.slice()
      const backupUnread = store.unreadCount
      store.items.clear()
      store.unreadCount = 0

      const response = yield notificationApi.deleteAllNotifications()
      if (!response.ok || !response.data?.success) {
        store.items.replace(backupItems as any)
        store.unreadCount = backupUnread
      } else {
        yield clearLocalNotifications()
      }
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
      store.unreadCount += 1
      return local
    })

    const addIncomingNotification = flow(function* addIncomingNotification(
      title: string,
      content: string,
      userId?: string,
      sentAtMs?: number,
    ) {
      const fingerprintTime = sentAtMs ?? Date.now()
      const duplicate = store.items.some(
        (item) =>
          item.title === title &&
          item.content === content &&
          Math.abs((item.sentAt ?? 0) - fingerprintTime) <= 60_000,
      )
      if (duplicate) {
        return { ok: true, data: { success: true, message: "duplicate skipped" } }
      }

      const local = yield addLocalNotification(title, content, sentAtMs)
      if (!userId) return local

      const response = yield notificationApi.createNotification({ userId, title, content })
      if (response.ok && response.data?.success && response.data.data) {
        const serverRaw = response.data.data
        const normalized = normalizeNotification({
          ...serverRaw,
          // Ưu tiên nội dung local vì BE đôi khi trả placeholder sau cold start.
          title: title || serverRaw.title,
          content: content || serverRaw.content,
          sentAt: sentAtMs ?? serverRaw.sentAt ?? Date.now(),
        })
        const localIdx = store.items.findIndex((item) => item.id === local.id)
        const serverExisted = store.items.some((item) => item.id === normalized.id)
        if (localIdx >= 0) {
          if (serverExisted) {
            const removedWasUnread = !store.items[localIdx].isRead
            store.items.splice(localIdx, 1)
            if (removedWasUnread) {
              store.unreadCount = Math.max(0, store.unreadCount - 1)
            }
          } else {
            store.items[localIdx] = normalized
          }
        }
        yield deleteLocalNotification(local.id)
      }
      return response
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
    }
  })

export interface NotificationStore extends Instance<typeof NotificationStoreModel> {}
export interface NotificationStoreSnapshot extends SnapshotOut<typeof NotificationStoreModel> {}
