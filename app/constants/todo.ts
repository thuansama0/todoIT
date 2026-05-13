/** Các mốc nhắc (phút) trước deadline — đồng bộ UI chip và backend. */
export const TODO_REMINDER_MINUTE_OPTIONS = [0, 5, 15, 30, 60] as const

/** Prefix id tạm cho optimistic create trước khi server trả id thật. */
export const TEMP_TODO_ID_PREFIX = "temp-" as const
