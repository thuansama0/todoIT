import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Import bộ điều hướng của Ignite để chuyển trang không cần props navigation
import { navigate, navigationRef } from '../navigators/navigationUtilities';

/**
 * Khi mở app từ trạng thái killed bằng cách bấm notification, listener response
 * thường không kích hoạt — cần đọc lượt tương tác cuối từ Expo.
 * Đợi navigationRef sẵn sàng (sau persist) rồi mới navigate, tránh no-op im lặng.
 */
function navigateToNotificationsWhenReady() {
  const maxWaitMs = 10000
  const started = Date.now()
  const id = setInterval(() => {
    if (navigationRef.isReady()) {
      clearInterval(id)
      navigationRef.navigate('Notifications')
    } else if (Date.now() - started > maxWaitMs) {
      clearInterval(id)
    }
  }, 50)
  return () => clearInterval(id)
}

function shouldHandleNotificationResponse(
  response: Notifications.NotificationResponse | null,
  maxAgeMs = 15000,
) {
  if (!response) return false
  if (response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return false

  const sentAt = Number(response.notification?.date ?? 0)
  if (!sentAt) return false

  return Date.now() - sentAt <= maxAgeMs
}
// Nếu chưa có Toast, bạn chạy: bun add react-native-toast-message
import Toast from 'react-native-toast-message'; 


//  Cấu hình tắt thông báo hệ thống dội xuống khi App đang mở (Active)

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Tắt hiển thị mặc định để mình dùng Toast
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const usePushNotifications = () => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const handledResponseIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    let stopWaitingNav: (() => void) | undefined

    // App mở từ killed: bấm notification → cần getLastNotificationResponseAsync
    ;(async () => {
      try {
        const last = await Notifications.getLastNotificationResponseAsync()
        if (!last || cancelled || !shouldHandleNotificationResponse(last)) return
        const id = last.notification.request.identifier || String(last.notification.date)
        if (handledResponseIds.current.has(id)) return
        handledResponseIds.current.add(id)
        stopWaitingNav = navigateToNotificationsWhenReady()
      } catch {
        // bỏ qua nếu API lỗi
      }
    })()

    // 1. Đăng ký & Gửi Token lên Server
    registerForPushNotificationsAsync()
      .then(token => {
        if (token) {
          console.log("🚀 Đã gửi Push Token lên Server:", token);
        } else {
          console.log("⚠️ Chạy xong nhưng Token bị rỗng (Chưa cấp quyền?)");
        }
      })
      .catch(error => {
        console.log("❌ LỖI LẤY TOKEN RỒI BÁC ƠI:", error);
      });

    // =========================================================================
    //  App đang ACTIVE -> Hiển thị Toast
    // =========================================================================
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      
      Toast.show({
        type: 'info',
        text1: title || 'Thông báo mới',
        text2: body || 'Bạn có một thông báo',
        position: 'top',
      });
    });

    // =========================================================================
    // App đang MINIMIZE / KILLED -> Bấm vào chuyển sang trang Thông báo
    // =========================================================================
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (!shouldHandleNotificationResponse(response)) return
      const id = response.notification.request.identifier || String(response.notification.date)
      if (handledResponseIds.current.has(id)) return
      handledResponseIds.current.add(id)
      console.log("👆 Người dùng vừa bấm vào thông báo!");
      // Chuyển hướng thẳng vào màn hình Danh Sách Thông Báo
      // Lưu ý: Chữ "Notifications" phải trùng với name trong AppNavigator
      navigate("Notifications"); 
    });

    return () => {
      cancelled = true
      stopWaitingNav?.()
      // Dọn dẹp bộ nhớ khi tắt App
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
};

// Hàm hỗ trợ xin quyền và lấy mã Token từ Apple/Google
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
    
    // Lấy ID dự án của bạn
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } else {
    console.log('⚠️ Phải dùng điện thoại thật để lấy Push Token (Máy ảo không hỗ trợ)');
  }

  return token;
}