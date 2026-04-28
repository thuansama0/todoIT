import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { Notification, notificationApi } from "app/services/api/notificationApi"

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
        const [listRes, countRes] = yield Promise.all([
          notificationApi.getNotifications(0, 50),
          notificationApi.getUnreadCount(),
        ])

        if (listRes.ok && listRes.data?.success) {
          store.items.replace((listRes.data.data?.items ?? []).map(normalizeNotification))
          store.isLoaded = true
        }
        if (countRes.ok && countRes.data?.success) {
          store.unreadCount = countRes.data.data ?? 0
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
      const target = store.items.find((n) => n.id === id)
      store.items.replace(store.items.filter((n) => n.id !== id))
      if (target && !target.isRead) store.unreadCount = Math.max(0, store.unreadCount - 1)

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
    }
  })

export interface NotificationStore extends Instance<typeof NotificationStoreModel> {}
export interface NotificationStoreSnapshot extends SnapshotOut<typeof NotificationStoreModel> {}
