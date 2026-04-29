import * as Notifications from "expo-notifications"
import { load, save } from "app/utils/storage"

const TODO_REMINDER_STORAGE_KEY = "todo-reminder-notification-map"
const TODO_REMINDER_MINUTES_STORAGE_KEY = "todo-reminder-minutes-map"
const TODO_REMINDER_PAYLOAD_STORAGE_KEY = "todo-reminder-payload-map"

type ReminderMap = Record<string, string>
type ReminderMinutesMap = Record<string, number>
type ReminderPayloadMap = Record<string, { displayTitle: string; displayBody: string; fireAtMs: number }>

async function loadReminderMap(): Promise<ReminderMap> {
  const raw = await load(TODO_REMINDER_STORAGE_KEY)
  if (!raw || typeof raw !== "object") return {}
  return raw as ReminderMap
}

async function saveReminderMap(map: ReminderMap) {
  await save(TODO_REMINDER_STORAGE_KEY, map)
}

export async function loadTodoReminderMinutesMap(): Promise<ReminderMinutesMap> {
  const raw = await load(TODO_REMINDER_MINUTES_STORAGE_KEY)
  if (!raw || typeof raw !== "object") return {}
  return raw as ReminderMinutesMap
}

async function saveTodoReminderMinutesMap(map: ReminderMinutesMap) {
  await save(TODO_REMINDER_MINUTES_STORAGE_KEY, map)
}

async function loadReminderPayloadMap(): Promise<ReminderPayloadMap> {
  const raw = await load(TODO_REMINDER_PAYLOAD_STORAGE_KEY)
  if (!raw || typeof raw !== "object") return {}
  return raw as ReminderPayloadMap
}

async function saveReminderPayloadMap(map: ReminderPayloadMap) {
  await save(TODO_REMINDER_PAYLOAD_STORAGE_KEY, map)
}

export async function getReminderPayloadByNotificationId(notificationId: string) {
  if (!notificationId) return undefined
  const map = await loadReminderPayloadMap()
  return map[notificationId]
}

export async function getNearestReminderPayload(nowMs = Date.now(), maxDeltaMs = 10 * 60_000) {
  const map = await loadReminderPayloadMap()
  const values = Object.values(map)
  if (values.length === 0) return undefined

  let nearest: ReminderPayloadMap[string] | undefined
  let nearestDelta = Number.POSITIVE_INFINITY
  for (const item of values) {
    const delta = Math.abs((item.fireAtMs ?? 0) - nowMs)
    if (delta < nearestDelta) {
      nearest = item
      nearestDelta = delta
    }
  }

  if (!nearest || nearestDelta > maxDeltaMs) return undefined
  return nearest
}

export async function cancelTodoReminder(todoId: string) {
  const map = await loadReminderMap()
  const existingId = map[todoId]
  if (existingId) {
    await Notifications.cancelScheduledNotificationAsync(existingId).catch(() => {})
    delete map[todoId]
    await saveReminderMap(map)
    const payloadMap = await loadReminderPayloadMap()
    delete payloadMap[existingId]
    await saveReminderPayloadMap(payloadMap)
  }
  const reminderMinutesMap = await loadTodoReminderMinutesMap()
  delete reminderMinutesMap[todoId]
  await saveTodoReminderMinutesMap(reminderMinutesMap)
}

export function formatLeadTime(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    return `Còn ${hours} giờ nữa`
  }
  return `Còn ${minutes} phút nữa`
}

export async function scheduleTodoReminder(params: {
  todoId: string
  title: string
  dueDate: number
  reminderMinutes: number
}) {
  const { todoId, title, dueDate, reminderMinutes } = params

  await cancelTodoReminder(todoId)
  if (!reminderMinutes || reminderMinutes <= 0) return
  if (!dueDate || dueDate <= 0) return

  const triggerAt = dueDate - reminderMinutes * 60_000
  if (triggerAt <= Date.now()) {
    return
  }

  const displayTitle = `Nhắc việc: ${title}`
  const displayBody = `${formatLeadTime(reminderMinutes)} đến lịch của bạn`

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: displayTitle,
      body: displayBody,
      sound: true,
      // Android dễ làm rơi object payload, nên ép về string để lúc mở app vẫn đọc được tên todo.
      data: {
        kind: "todo-reminder",
        todoTitle: String(title),
        displayTitle: String(displayTitle),
        displayBody: String(displayBody),
        reminderMinutes: String(reminderMinutes),
        fireAtMs: String(triggerAt),
      },
    },
    trigger: new Date(triggerAt),
  })

  const map = await loadReminderMap()
  map[todoId] = notificationId
  await saveReminderMap(map)

  const payloadMap = await loadReminderPayloadMap()
  payloadMap[notificationId] = {
    displayTitle,
    displayBody,
    fireAtMs: triggerAt,
  }
  await saveReminderPayloadMap(payloadMap)

  const reminderMinutesMap = await loadTodoReminderMinutesMap()
  reminderMinutesMap[todoId] = reminderMinutes
  await saveTodoReminderMinutesMap(reminderMinutesMap)
}
