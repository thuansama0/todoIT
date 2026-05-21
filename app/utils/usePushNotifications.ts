import { useEffect, useRef, type MutableRefObject } from "react"
import { AppState, Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Toast from "react-native-toast-message"
import Constants from "expo-constants"

import { getActiveRouteName, navigationRef } from "../navigators/navigationUtilities"
import { useStores } from "app/models"
import {
  formatLeadTime,
  getNearestReminderPayload,
  getReminderPayloadByNotificationId,
} from "./todoReminder"
import { normalizeNotificationData } from "./notificationPayload"
import { buildTodoReminderCanonicalKey, claimReminderDeliverySlot } from "./reminderDeliveryDedupe"
import {
  clearLastNotificationResponseIfSupported,
  getStableNotificationResponseKey,
  isNotificationResponseHandled,
  markNotificationResponseHandled,
} from "./notificationResponseDedupe"
import { loadString } from "app/utils/storage"
import { userApi } from "app/services/api/userApi"
import { colors } from "app/theme"

const APP_BOOT_AT = Date.now()
const COLD_START_NAV_WINDOW_MS = 8000
let notificationBootstrapDone = false
let lastClaimedResponseKeyInSession: string | null = null

function navigateToNotificationsTab() {
  if (!navigationRef.isReady()) return

  const rootState = navigationRef.getRootState()
  const activeRoute = getActiveRouteName(rootState)
  const hasMainTabs = rootState.routes.some((route) => route.name === "MainTabs")

  if (activeRoute === "Notifications") return

  if (hasMainTabs && activeRoute !== "Login" && activeRoute !== "SignUp") {
    navigationRef.navigate("MainTabs", { screen: "Notifications" })
    return
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: "MainTabs",
        state: {
          index: 2,
          routes: [
            { name: "Categories" },
            { name: "Todo" },
            { name: "Notifications" },
            { name: "Profile" },
          ],
        },
      },
    ],
  } as never)
}

function navigateToNotificationsWhenReady() {
  const maxWaitMs = 15000
  const started = Date.now()
  const id = setInterval(() => {
    if (navigationRef.isReady()) {
      clearInterval(id)
      navigateToNotificationsTab()
    } else if (Date.now() - started > maxWaitMs) {
      clearInterval(id)
    }
  }, 300)
  return () => clearInterval(id)
}

function extractDeliveredAtMs(notification: Notifications.Notification): number {
  const data = normalizeNotificationData(notification.request.content.data)
  const fireAt = Number(data.fireAtMs)
  if (Number.isFinite(fireAt) && fireAt > 0) return fireAt

  const d = notification.date
  if (typeof d === "number" && d > 0) {
    return d < 1_000_000_000_000 ? d * 1000 : d
  }
  return Date.now()
}

function shouldHandleNotificationResponse(response: Notifications.NotificationResponse | null) {
  if (!response) return false
  if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return false
  const identifier = response.notification?.request?.identifier
  const date = Number(response.notification?.date ?? 0)
  const content = response.notification?.request?.content
  const hasTitle = typeof content?.title === "string" && content.title.trim().length > 0
  const hasBody = typeof content?.body === "string" && content.body.trim().length > 0
  const data = normalizeNotificationData(content?.data)
  const hasData = Object.keys(data).length > 0
  const isInvalidPhantom =
    (!identifier || identifier === "0") && date <= 0 && !hasTitle && !hasBody && !hasData
  if (isInvalidPhantom) {
    return false
  }
  return true
}

async function claimNotificationResponse(
  response: Notifications.NotificationResponse,
  handledResponseIds: MutableRefObject<Set<string>>,
): Promise<string | null> {
  if (!shouldHandleNotificationResponse(response)) return null

  const key = getStableNotificationResponseKey(response)
  if (lastClaimedResponseKeyInSession === key) return null
  if (handledResponseIds.current.has(key)) return null
  if (await isNotificationResponseHandled(key)) {
    lastClaimedResponseKeyInSession = key
    handledResponseIds.current.add(key)
    return null
  }

  lastClaimedResponseKeyInSession = key
  handledResponseIds.current.add(key)
  await markNotificationResponseHandled(key)
  return key
}

async function handleNotificationResponse(
  response: Notifications.NotificationResponse,
  handledResponseIds: MutableRefObject<Set<string>>,
  pushIncomingReminder: (notification: Notifications.Notification) => Promise<boolean>,
  source: "cold-start" | "listener",
  appWasBackgroundRef: MutableRefObject<boolean>,
): Promise<{ handled: boolean; shouldNavigate: boolean }> {
  const key = await claimNotificationResponse(response, handledResponseIds)
  if (!key) return { handled: false, shouldNavigate: false }

  await clearLastNotificationResponseIfSupported()

  // Tap từ background: received listener sẽ ghi — không ghi ở đây (tránh double).
  // Cold start sau khi kill: received thường không fire lại → ghi một lần ở đây.
  if (source === "cold-start") {
    await pushIncomingReminder(response.notification)
    return { handled: true, shouldNavigate: false }
  }

  const openedFromNotificationTap =
    appWasBackgroundRef.current || Date.now() - APP_BOOT_AT <= COLD_START_NAV_WINDOW_MS

  if (openedFromNotificationTap) {
    appWasBackgroundRef.current = false
    return { handled: true, shouldNavigate: true }
  }

  return { handled: true, shouldNavigate: false }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const usePushNotifications = () => {
  const { authenticationStore, notificationStore, profileStore } = useStores()
  const notificationListener = useRef<Notifications.Subscription>()
  const responseListener = useRef<Notifications.Subscription>()
  const handledResponseIds = useRef<Set<string>>(new Set())
  const appWasBackgroundRef = useRef(false)

  const resolveNotificationText = async (notification: Notifications.Notification) => {
    const content = notification.request.content
    const data = normalizeNotificationData(content.data)

    if (data.kind === "todo-reminder") {
      const displayTitle = data.displayTitle?.trim() ?? ""
      const todoTitleRaw = data.todoTitle?.trim() ?? ""
      let fromDataTitle = displayTitle || (todoTitleRaw ? `Nhắc việc: ${todoTitleRaw}` : "")
      let fromDataBody = data.displayBody?.trim() ?? ""
      const rm = Number(data.reminderMinutes)
      if (!fromDataBody && Number.isFinite(rm) && rm > 0) {
        fromDataBody = `${formatLeadTime(rm)} đến lịch của bạn`
      }
      if (!fromDataTitle && todoTitleRaw) {
        fromDataTitle = `Nhắc việc: ${todoTitleRaw}`
      }
      if (fromDataTitle || fromDataBody) {
        return { title: fromDataTitle, body: fromDataBody, fireAtMs: Number(data.fireAtMs) || 0 }
      }
    }

    const resolvedTitle =
      (typeof content.title === "string" && content.title.trim()) ||
      data.displayTitle?.trim() ||
      data.title?.trim() ||
      data.notificationTitle?.trim() ||
      ""
    const resolvedBody =
      (typeof content.body === "string" && content.body.trim()) ||
      data.displayBody?.trim() ||
      data.content?.trim() ||
      data.notificationContent?.trim() ||
      ""
    if (resolvedTitle || resolvedBody) {
      return { title: resolvedTitle, body: resolvedBody, fireAtMs: Number(data.fireAtMs) || 0 }
    }

    const fallbackFromStorage = await getReminderPayloadByNotificationId(
      notification.request.identifier,
    )
    if (fallbackFromStorage) {
      return {
        title: fallbackFromStorage.displayTitle,
        body: fallbackFromStorage.displayBody,
        fireAtMs: fallbackFromStorage.fireAtMs,
      }
    }

    const nearestFallback = await getNearestReminderPayload(Date.now())
    if (nearestFallback) {
      return {
        title: nearestFallback.displayTitle,
        body: nearestFallback.displayBody,
        fireAtMs: nearestFallback.fireAtMs,
      }
    }
    return { title: "", body: "", fireAtMs: 0 }
  }

  function isDuplicateNotificationResult(result: unknown): boolean {
    if (!result || typeof result !== "object") return false
    const data = (result as { data?: { message?: string } }).data
    return data?.message === "duplicate skipped"
  }

  const pushIncomingReminder = async (
    notification: Notifications.Notification,
  ): Promise<boolean> => {
    const rawData = normalizeNotificationData(notification.request.content.data)
    const { title, body, fireAtMs } = await resolveNotificationText(notification)
    if (!title.trim() && !body.trim() && fireAtMs <= 0) {
      return false
    }
    const finalTitle = title.trim() ? title : "Nhắc việc: Todo"
    const finalBody = body.trim() ? body : "Còn ít phút nữa đến lịch của bạn"
    const deliveredAtMs = fireAtMs > 0 ? fireAtMs : extractDeliveredAtMs(notification)
    const canonicalKey =
      buildTodoReminderCanonicalKey(rawData) ??
      (notification.request.identifier && notification.request.identifier !== "0"
        ? `nid|${notification.request.identifier}`
        : `txt|${finalTitle}|${finalBody}|${deliveredAtMs}`)
    const claimed = await claimReminderDeliverySlot(notification.request.identifier, canonicalKey)
    if (!claimed) {
      return false
    }
    let userId = profileStore.profile?.id
    if (!userId) {
      const profileRes = await profileStore.fetchProfile()
      if (profileRes?.ok && profileStore.profile?.id) {
        userId = profileStore.profile.id
      }
    }
    const result = await notificationStore.addIncomingNotification(
      finalTitle,
      finalBody,
      userId,
      deliveredAtMs,
    )
    return !isDuplicateNotificationResult(result)
  }

  const navigateIfNeeded = (shouldNavigate: boolean) => {
    if (!shouldNavigate) return
    if (navigationRef.isReady()) {
      navigateToNotificationsTab()
      return
    }
    return navigateToNotificationsWhenReady()
  }

  useEffect(() => {
    if (notificationBootstrapDone) return
    notificationBootstrapDone = true

    let cancelled = false
    let stopWaitingNav: (() => void) | undefined

    const appStateSub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        appWasBackgroundRef.current = true
      }
    })

    ;(async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => [])
      if (Platform.OS === "android") {
        const channel = await Notifications.getNotificationChannelAsync("default").catch(() => null)
        if (!channel) {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: colors.palette.secondary400,
          })
        }
      }
      if (Array.isArray(scheduled)) {
        for (const item of scheduled) {
          const data = normalizeNotificationData(item?.content?.data)
          const fireAt = Number(data.fireAtMs)
          if (!Number.isFinite(fireAt) || fireAt <= 0 || fireAt > Date.now()) continue

          const title =
            data.displayTitle?.trim() ||
            (typeof item?.content?.title === "string" ? item.content.title.trim() : "") ||
            "Nhắc việc: Todo"
          const body =
            data.displayBody?.trim() ||
            (typeof item?.content?.body === "string" ? item.content.body.trim() : "") ||
            "Còn ít phút nữa đến lịch của bạn"

          const sweepKey = buildTodoReminderCanonicalKey(data) ?? `sweep|${title}|${body}|${fireAt}`
          const sweepClaimed = await claimReminderDeliverySlot(item.identifier, sweepKey)
          if (!sweepClaimed) {
            await Notifications.cancelScheduledNotificationAsync(item.identifier).catch(
              () => undefined,
            )
            continue
          }

          await notificationStore.addIncomingNotification(title, body, undefined, fireAt)
          await Notifications.cancelScheduledNotificationAsync(item.identifier).catch(
            () => undefined,
          )
        }
      }
    })().catch(() => undefined)
    ;(async () => {
      try {
        const last = await Notifications.getLastNotificationResponseAsync()
        if (!last || cancelled) return
        const result = await handleNotificationResponse(
          last,
          handledResponseIds,
          pushIncomingReminder,
          "cold-start",
          appWasBackgroundRef,
        )
        stopWaitingNav = navigateIfNeeded(result.shouldNavigate)
      } catch {
        return undefined
      }
    })().catch(() => undefined)

    ensureNotificationPermissionsAsync().catch(() => undefined)

    if (authenticationStore.authToken) {
      syncExpoPushTokenWithServer(authenticationStore.authToken).catch(() => undefined)
    }

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      ;(async () => {
        const didRecord = await pushIncomingReminder(notification)
        if (!didRecord) return
        const { title, body } = await resolveNotificationText(notification)
        Toast.show({
          type: "info",
          text1: title.trim() ? title : "Thông báo mới",
          text2: body.trim() ? body : "Còn ít phút nữa đến lịch của bạn",
          position: "top",
        })
      })().catch(() => undefined)
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      handleNotificationResponse(
        response,
        handledResponseIds,
        pushIncomingReminder,
        "listener",
        appWasBackgroundRef,
      )
        .then((result) => {
          const waitNav = navigateIfNeeded(result.shouldNavigate)
          if (waitNav) stopWaitingNav = waitNav
        })
        .catch(() => undefined)
    })

    return () => {
      cancelled = true
      stopWaitingNav?.()
      appStateSub.remove()
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current)
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
}

export async function syncExpoPushTokenWithServer(accessToken?: string) {
  const token = await registerForPushNotificationsAsync()
  if (!token) return undefined

  const tokenForRequest = accessToken ?? (await loadString("accessToken")) ?? undefined
  if (!tokenForRequest) return undefined

  const response = await userApi.updatePushToken(token, tokenForRequest)
  if (!response.ok || !response.data?.success) return undefined

  return token
}

async function registerForPushNotificationsAsync() {
  const finalStatus = await ensureNotificationPermissionsAsync()
  if (finalStatus !== "granted") {
    return undefined
  }

  if (!Device.isDevice) {
    return undefined
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data

  return token
}

async function ensureNotificationPermissionsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.palette.secondary400,
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    return undefined
  }

  return finalStatus
}
