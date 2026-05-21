import { load, save } from "app/utils/storage"
import { Notification } from "app/services/api/notificationApi"

const LOCAL_NOTIFICATION_LOG_KEY = "local-notification-log"
const MAX_LOCAL_ITEMS = 100

/** Khớp logic dedupe trong NotificationStore. */
export function notificationContentKey(title: string, content: string, sentAt: number) {
  const minuteBucket = Math.floor(sentAt / 60_000)
  return `${title}\u0000${content}\u0000${minuteBucket}`
}

export async function loadLocalNotificationLog(): Promise<Notification[]> {
  const raw = await load(LOCAL_NOTIFICATION_LOG_KEY)
  if (!Array.isArray(raw)) return []
  return raw as Notification[]
}

export async function appendLocalNotificationLog(input: {
  title: string
  content: string
  sentAt?: number
}) {
  const current = await loadLocalNotificationLog()
  const nextItem: Notification = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title,
    content: input.content,
    isRead: false,
    sentAt: input.sentAt ?? Date.now(),
  }
  const merged = [nextItem, ...current].slice(0, MAX_LOCAL_ITEMS)
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
  return nextItem
}

export async function markLocalNotificationAsRead(id: string) {
  const current = await loadLocalNotificationLog()
  const merged = current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

export async function markAllLocalNotificationsAsRead() {
  const current = await loadLocalNotificationLog()
  const merged = current.map((item) => ({ ...item, isRead: true }))
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

/** Ghi bản ghi server vào log sau POST thành công (không qua bước local tạm). */
export async function persistServerNotification(serverItem: Notification) {
  const current = await loadLocalNotificationLog()
  const merged = [serverItem, ...current.filter((item) => item.id !== serverItem.id)].slice(
    0,
    MAX_LOCAL_ITEMS,
  )
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

export async function deleteLocalNotification(id: string) {
  const current = await loadLocalNotificationLog()
  const merged = current.filter((item) => item.id !== id)
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

/** Xóa theo id và/hoặc mọi bản ghi local trùng nội dung (local-* vs server id). */
export async function purgeNotificationFromLocalLog(options: {
  id?: string
  title?: string
  content?: string
  sentAt?: number
}) {
  const current = await loadLocalNotificationLog()
  const contentKey =
    options.title !== undefined && options.content !== undefined && options.sentAt !== undefined
      ? notificationContentKey(options.title, options.content, options.sentAt)
      : null
  const merged = current.filter((item) => {
    if (options.id && item.id === options.id) return false
    if (
      contentKey &&
      notificationContentKey(item.title, item.content, item.sentAt) === contentKey
    ) {
      return false
    }
    return true
  })
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

/** Sau khi POST /notification thành công: đổi `local-*` thành bản ghi server trong log — tránh mất dòng nếu GET /all chưa kịp trả về. */
export async function replaceLocalIdWithServerNotification(
  localId: string,
  serverItem: Notification,
) {
  const current = await loadLocalNotificationLog()
  const withoutOld = current.filter((item) => item.id !== localId && item.id !== serverItem.id)
  const merged = [serverItem, ...withoutOld].slice(0, MAX_LOCAL_ITEMS)
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

export async function clearLocalNotifications() {
  await save(LOCAL_NOTIFICATION_LOG_KEY, [])
}
