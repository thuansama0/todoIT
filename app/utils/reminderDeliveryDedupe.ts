import { load, save } from "app/utils/storage"

const STORAGE_KEY = "reminder-delivery-dedupe-v1"
const TTL_MS = 72 * 60 * 60 * 1000
const MAX_KEYS = 200

/**
 * Trên Android, cùng một nhắc việc có thể đi qua nhiều đường (received listener + sweep scheduled,
 * hoặc payload khác nhẹ). Gọi trước khi addIncomingNotification.
 *
 * @returns true nếu được phép ghi (slot mới), false nếu đã xử lý rồi (trùng).
 */
export async function claimReminderDeliverySlot(
  expoNotificationRequestId: string | undefined,
  canonicalKey: string,
): Promise<boolean> {
  const now = Date.now()
  const raw = (await load(STORAGE_KEY)) as Record<string, number> | null
  const map: Record<string, number> = raw && typeof raw === "object" ? { ...raw } : {}

  for (const k of Object.keys(map)) {
    if (now - map[k] > TTL_MS) delete map[k]
  }

  const keysToCheck: string[] = [`k:${canonicalKey}`]
  const id = expoNotificationRequestId?.trim()
  if (id && id !== "0") {
    keysToCheck.push(`id:${id}`)
  }

  for (const key of keysToCheck) {
    const t = map[key]
    if (t !== undefined && now - t < TTL_MS) {
      return false
    }
  }

  const ts = now
  for (const key of keysToCheck) {
    map[key] = ts
  }

  const entries = Object.entries(map).sort((a, b) => a[1] - b[1])
  while (entries.length > MAX_KEYS) {
    const drop = entries.shift()
    if (drop) delete map[drop[0]]
  }

  await save(STORAGE_KEY, map)
  return true
}

/** Khóa ổn định từ payload scheduleTodoReminder — giống nhau trên mọi đường gọi. */
export function buildTodoReminderCanonicalKey(data: Record<string, string>): string | null {
  if (data.kind !== "todo-reminder") return null
  const fireAt = Number(data.fireAtMs)
  if (!Number.isFinite(fireAt) || fireAt <= 0) return null
  const todoTitle = (data.todoTitle ?? "").trim()
  return `todo-reminder|${fireAt}|${todoTitle}`
}
