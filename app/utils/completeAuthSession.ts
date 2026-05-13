import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "app/navigators"
import { saveString } from "app/utils/storage"
import { syncExpoPushTokenWithServer } from "app/utils/usePushNotifications"

type AuthStoreLike = { setProp: (field: "authToken", newValue: string | undefined) => void }

export type CompleteAuthSessionStores = {
  authenticationStore: AuthStoreLike
  profileStore: { clearProfile: () => void }
  notificationStore: { resetForAuthChange: () => Promise<void> }
  todoStore: { resetForAuthChange: () => Promise<void>; loadIfNeeded: () => Promise<unknown> }
  categoryStore: { resetForAuthChange?: () => void; loadIfNeeded?: () => Promise<unknown> }
}

export async function completeAuthSession<S extends keyof AppStackParamList>(
  stores: CompleteAuthSessionStores,
  navigation: NativeStackNavigationProp<AppStackParamList, S>,
  accessToken: string | undefined,
) {
  // Xóa profile cũ trước — tránh isLoaded + email user trước khiến loadIfNeeded bỏ qua GET /me
  // và tránh gửi userId/notifications nhầm sang session mới.
  stores.profileStore.clearProfile()
  await stores.notificationStore.resetForAuthChange()
  await stores.todoStore.resetForAuthChange()
  stores.categoryStore.resetForAuthChange?.()

  if (accessToken) {
    // Gom ve mot setter chung de tranh phat sinh nhieu action setter trung lap.
    stores.authenticationStore.setProp("authToken", accessToken)
    await saveString("accessToken", accessToken)
    void syncExpoPushTokenWithServer(accessToken).catch(() => {})
    // Sau login store đã reset (rỗng) → fetch một lần chạy nền; không await để không kẹt màn Login.
    void stores.todoStore.loadIfNeeded()
    void stores.categoryStore.loadIfNeeded?.()
  }

  navigation.navigate("MainTabs")
}