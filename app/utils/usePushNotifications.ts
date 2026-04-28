import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';

import { navigate, navigationRef } from '../navigators/navigationUtilities';
import { useStores } from "app/models";
import { formatLeadTime, getNearestReminderPayload, getReminderPayloadByNotificationId } from "./todoReminder";
import { normalizeNotificationData } from "./notificationPayload";
import { load, save } from "app/utils/storage";
import { userApi } from "app/services/api/userApi";

function navigateToNotificationsTab() {
  if (!navigationRef.isReady()) return
  navigationRef.navigate("MainTabs", { screen: "Notifications" })
}

function navigateToNotificationsWhenReady() {
  const maxWaitMs = 10000
  const started = Date.now()
  const id = setInterval(() => {
    if (navigationRef.isReady()) {
      clearInterval(id)
      navigateToNotificationsTab()
    } else if (Date.now() - started > maxWaitMs) {
      clearInterval(id)
    }
  }, 50)
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const LAST_HANDLED_RESPONSE_KEY = "last-handled-notification-response"

export const usePushNotifications = () => {
  const { notificationStore, profileStore } = useStores()
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const handledResponseIds = useRef<Set<string>>(new Set())

  const resolveNotificationText = async (notification: Notifications.Notification) => {
    const content = notification.request.content
    const data = normalizeNotificationData(content.data)

    if (data.kind === "todo-reminder") {
      const displayTitle = data.displayTitle?.trim() ?? ""
      const todoTitleRaw = data.todoTitle?.trim() ?? ""
      let fromDataTitle =
        displayTitle || (todoTitleRaw ? `Nhắc việc: ${todoTitleRaw}` : "")
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

    const fallbackFromStorage = await getReminderPayloadByNotificationId(notification.request.identifier)
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

  const pushIncomingReminder = async (notification: Notifications.Notification) => {
    const { title, body, fireAtMs } = await resolveNotificationText(notification)
    if (!title.trim() && !body.trim() && fireAtMs <= 0) {
      return
    }
    const finalTitle = title.trim() ? title : "Nhắc việc: Todo"
    const finalBody = body.trim() ? body : "Còn ít phút nữa đến lịch của bạn"
    const deliveredAtMs = fireAtMs > 0 ? fireAtMs : extractDeliveredAtMs(notification)
    const dedupeKey = `${finalTitle}|${finalBody}|${deliveredAtMs}`
    const lastHandled = (await load(LAST_HANDLED_RESPONSE_KEY)) as { key?: string; at?: number } | null
    if (
      lastHandled?.key === dedupeKey &&
      typeof lastHandled?.at === "number" &&
      Date.now() - lastHandled.at < 120_000
    ) {
      return
    }
    await save(LAST_HANDLED_RESPONSE_KEY, { key: dedupeKey, at: Date.now() })
    let userId = profileStore.profile?.id
    if (!userId) {
      const profileRes = await profileStore.fetchProfile()
      if (profileRes?.ok && profileStore.profile?.id) {
        userId = profileStore.profile.id
      }
    }
    await notificationStore.addIncomingNotification(finalTitle, finalBody, userId, deliveredAtMs)
  }

  useEffect(() => {
    let cancelled = false
    let stopWaitingNav: (() => void) | undefined
    ;(async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync().catch(() => [])
      if (Platform.OS === "android") {
        const channel = await Notifications.getNotificationChannelAsync("default").catch(() => null)
        if (!channel) {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          })
        }
      }
      if (Array.isArray(scheduled)) {
        for (const item of scheduled as any[]) {
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

          await notificationStore.addIncomingNotification(title, body, undefined, fireAt)
          await Notifications.cancelScheduledNotificationAsync(item.identifier).catch(() => {})
        }
      }
    })()

    // Android có thể bỏ qua listener khi app mở lại từ killed state.
    ;(async () => {
      try {
        const last = await Notifications.getLastNotificationResponseAsync()
        if (!last || cancelled || !shouldHandleNotificationResponse(last)) return
        const id = last.notification.request.identifier || String(last.notification.date)
        if (handledResponseIds.current.has(id)) return
        handledResponseIds.current.add(id)
        await pushIncomingReminder(last.notification)
        stopWaitingNav = navigateToNotificationsWhenReady()
      } catch {}
    })()

    syncDevicePushTokenWithServer().catch(() => {})

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      void pushIncomingReminder(notification)
      void (async () => {
        const { title, body } = await resolveNotificationText(notification)
        Toast.show({
          type: 'info',
          text1: title.trim() ? title : 'Thông báo mới',
          text2: body.trim() ? body : 'Còn ít phút nữa đến lịch của bạn',
          position: 'top',
        })
      })()
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (!shouldHandleNotificationResponse(response)) return
      const id = response.notification.request.identifier || String(response.notification.date)
      if (handledResponseIds.current.has(id)) return
      handledResponseIds.current.add(id)
      void pushIncomingReminder(response.notification)
      navigate("MainTabs", { screen: "Notifications" })
    });

    return () => {
      cancelled = true
      stopWaitingNav?.()
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
};

export async function syncDevicePushTokenWithServer() {
  const token = await registerForPushNotificationsAsync()
  if (!token) return

  const response = await userApi.updatePushToken(token)
  if (!response.ok || !response.data?.success) {
    console.log("Không thể cập nhật FCM token:", response.problem, response.data)
    return
  }

  console.log("Đã cập nhật FCM token lên server.")
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('❌ Người dùng từ chối cấp quyền thông báo!');
      return;
    }

    // Backend gửi qua FCM nên không dùng ExpoPushToken ở đây.
    const devicePushToken = await Notifications.getDevicePushTokenAsync()
    token = String(devicePushToken.data)
  } else {
    console.log('⚠️ Phải dùng điện thoại thật để lấy Push Token (Máy ảo không hỗ trợ)');
  }

  return token;
}