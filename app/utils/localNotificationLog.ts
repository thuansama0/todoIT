import { load, save } from "app/utils/storage"
import { Notification } from "app/services/api/notificationApi"

const LOCAL_NOTIFICATION_LOG_KEY = "local-notification-log"
const MAX_LOCAL_ITEMS = 100

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

export async function deleteLocalNotification(id: string) {
  const current = await loadLocalNotificationLog()
  const merged = current.filter((item) => item.id !== id)
  await save(LOCAL_NOTIFICATION_LOG_KEY, merged)
}

export async function clearLocalNotifications() {
  await save(LOCAL_NOTIFICATION_LOG_KEY, [])
}
