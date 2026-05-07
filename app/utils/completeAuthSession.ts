import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { AppStackParamList } from "app/navigators"
import { saveString } from "app/utils/storage"
import { syncExpoPushTokenWithServer } from "app/utils/usePushNotifications"

type AuthStoreLike = { setAuthToken: (value?: string) => void }

export async function completeAuthSession<S extends keyof AppStackParamList>(
  authenticationStore: AuthStoreLike,
  navigation: NativeStackNavigationProp<AppStackParamList, S>,
  accessToken: string | undefined,
) {
  if (accessToken) {
    authenticationStore.setAuthToken(accessToken)
    await saveString("accessToken", accessToken)
    void syncExpoPushTokenWithServer(accessToken).catch(() => {})
  }
  navigation.navigate("MainTabs")
}