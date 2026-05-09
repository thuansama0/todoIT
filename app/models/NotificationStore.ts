import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Notification, notificationApi } from "app/services/api/notificationApi"
import {
  appendLocalNotificationLog,
  clearLocalNotifications,
  deleteLocalNotification,
  loadLocalNotificationLog,
  markLocalNotificationAsRead,
  replaceLocalIdWithServerNotification,
} from "app/utils/localNotificationLog"

const NotificationModel = types.model("Notification", {
  id: types.identifier,
  title: types.string,
  content: types.string,
  isRead: types.boolean,
  sentAt: types.number,
})

function toPlainNotification(item: any) {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    isRead: item.isRead,
    sentAt: item.sentAt,
  }
} 

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
    const fetchNotifications = flow(function* fetchNotifications() {
      store.isLoading = true
      try {
        const listRes = yield notificationApi.getNotifications(0, 50)

        const localItems = yield loadLocalNotificationLog()
        if (listRes.ok && listRes.data?.success) {
          const serverItems = (listRes.data.data?.items ?? []).map(normalizeNotification)
          const mergedById = new Map<string, any>()
          ;[...localItems.map(normalizeNotification), ...serverItems].forEach((item) => {
            mergedById.set(item.id, item)
          })
          const mergedItems = Array.from(mergedById.values()).sort((a, b) => b.sentAt - a.sentAt)
          store.items.replace(mergedItems)
          store.isLoaded = true
        } else if (localItems.length > 0) {
          store.items.replace(localItems.map(normalizeNotification))
          store.isLoaded = true
        }
        // Một nguồn sự thật: đếm từ danh sách đã merge — tránh server unread + local unread
        // đếm trùng cùng một thông báo (hiện "3 chưa đọc" cho 1 thông báo).
        store.unreadCount = unreadCountFromItems(store.items.slice())
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

      store.items[idx] = { ...store.items[idx], isRead: true }
      store.unreadCount = Math.max(0, store.unreadCount - 1)

      if (id.startsWith("local-")) {
        yield markLocalNotificationAsRead(id)
        return { ok: true, data: { success: true } }
      }

      const response = yield notificationApi.markAsRead(id)
      if (!response.ok || !response.data?.success) {
        store.items[idx] = { ...store.items[idx], isRead: false }
        store.unreadCount += 1
      }
      return response
    })

    const markAllRead = flow(function* markAllRead() {
      const backupItems = store.items.map(toPlainNotification)
      const backupUnread = store.unreadCount
      store.items.replace(store.items.map((n) => ({ ...n, isRead: true })))
      store.unreadCount = 0

      const response = yield notificationApi.markAllAsRead()
      if (!response.ok || !response.data?.success) {
        store.items.replace(backupItems)
        store.unreadCount = backupUnread
      }
      return response
    })

    const deleteNotification = flow(function* deleteNotification(id: string) {
      const backupItems = store.items.map(toPlainNotification)
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
        store.items.replace(backupItems)
        store.unreadCount = backupUnread
      }
      return response
    })

    const deleteAllNotifications = flow(function* deleteAllNotifications() {
      const backupItems = store.items.map(toPlainNotification)
      const backupUnread = store.unreadCount
      store.items.clear()
      store.unreadCount = 0

      const response = yield notificationApi.deleteAllNotifications()
      if (!response.ok || !response.data?.success) {
        store.items.replace(backupItems)
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
        yield replaceLocalIdWithServerNotification(local.id, normalized)
      }
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
