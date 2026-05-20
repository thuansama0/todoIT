import * as Notifications from "expo-notifications"
import type { NotificationResponse } from "expo-notifications"
import { load, save } from "app/utils/storage"
import { normalizeNotificationData } from "./notificationPayload"

const HANDLED_NOTIFICATION_RESPONSES_KEY = "handled-notification-responses-v2"
const MAX_HANDLED_RESPONSES = 50

export function getStableNotificationResponseKey(response: NotificationResponse): string {
  const notification = response.notification
  const request = notification.request
  const content = request.content
  const data = normalizeNotificationData(content.data)

  const id = request.identifier?.trim()
  if (id && id !== "0") return `id:${id}`

  const fireAt = data.fireAtMs ?? ""
  const kind = data.kind ?? ""
  const title = (content.title ?? data.displayTitle ?? data.title ?? "").trim()
  const body = (content.body ?? data.displayBody ?? data.content ?? "").trim()

  if (kind || fireAt) return `payload:${kind}|${fireAt}|${title}|${body}`

  const date = Number(notification.date ?? 0)
  if (date > 0) {
    const normalizedDate = date < 1_000_000_000_000 ? date * 1000 : date
    return `date:${normalizedDate}|${title}|${body}`
  }

  return `fallback:${title}|${body}|${response.actionIdentifier}`
}

async function loadHandledResponseKeys(): Promise<string[]> {
  const raw = await load(HANDLED_NOTIFICATION_RESPONSES_KEY)
  return Array.isArray(raw) ? raw.filter((item) => typeof item === "string") : []
}

export async function isNotificationResponseHandled(key: string): Promise<boolean> {
  const handled = await loadHandledResponseKeys()
  return handled.includes(key)
}

export async function markNotificationResponseHandled(key: string): Promise<void> {
  const handled = await loadHandledResponseKeys()
  if (handled.includes(key)) return
  const next = [...handled, key].slice(-MAX_HANDLED_RESPONSES)
  await save(HANDLED_NOTIFICATION_RESPONSES_KEY, next)
}

export async function clearLastNotificationResponseIfSupported(): Promise<void> {
  const clear = (Notifications as { clearLastNotificationResponseAsync?: () => Promise<void> })
    .clearLastNotificationResponseAsync
  if (typeof clear !== "function") return
  await clear().catch(() => undefined)
}
