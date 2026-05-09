import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "app/navigators"
import { saveString } from "app/utils/storage"
import { syncExpoPushTokenWithServer } from "app/utils/usePushNotifications"

type AuthStoreLike = { setProp: (field: "authToken", newValue: string | undefined) => void }

export type CompleteAuthSessionStores = {
  authenticationStore: AuthStoreLike
  notificationStore: { resetForAuthChange: () => Promise<void> }
  todoStore: { resetForAuthChange: () => Promise<void> }
  categoryStore: { resetForAuthChange?: () => void }
}

export async function completeAuthSession<S extends keyof AppStackParamList>(
  stores: CompleteAuthSessionStores,
  navigation: NativeStackNavigationProp<AppStackParamList, S>,
  accessToken: string | undefined,
) {
  await stores.notificationStore.resetForAuthChange()
  await stores.todoStore.resetForAuthChange()
  stores.categoryStore.resetForAuthChange?.()

  if (accessToken) {
    // Gom ve mot setter chung de tranh phat sinh nhieu action setter trung lap.
    stores.authenticationStore.setProp("authToken", accessToken)
    await saveString("accessToken", accessToken)
    void syncExpoPushTokenWithServer(accessToken).catch(() => {})
  }

  navigation.navigate("MainTabs")
}