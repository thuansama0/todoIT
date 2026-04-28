// Android có thể stringify notification data, nên gom về string map trước khi đọc.
export function normalizeNotificationData(raw: unknown): Record<string, string> {
  if (raw == null) return {}

  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw) as unknown
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return normalizeNotificationData(parsed)
      }
    } catch {
      return {}
    }
    return {}
  }

  if (typeof raw !== "object" || Array.isArray(raw)) return {}

  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v === undefined || v === null) continue
    out[k] = typeof v === "string" ? v : String(v)
  }
  return out
}
