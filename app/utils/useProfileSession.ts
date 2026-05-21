import { useCallback } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"
import { useStores } from "app/models"
import { translate } from "app/i18n"
import { remove } from "app/utils/storage"

export function useProfileSession() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { profileStore, authenticationStore, notificationStore, todoStore, categoryStore } =
    useStores()

  const finishSession = useCallback(async () => {
    await remove("accessToken")
    await remove("root-v1")
    authenticationStore.logout()

    await notificationStore.resetForAuthChange?.()
    await todoStore.resetForAuthChange?.()
    categoryStore.resetForAuthChange?.()
    profileStore.clearProfile()
    navigation.reset({ index: 0, routes: [{ name: "Login" }] })
  }, [authenticationStore, categoryStore, navigation, notificationStore, profileStore, todoStore])

  const handleSignOut = useCallback(() => {
    Alert.alert(translate("profileScreen.signOutTitle"), translate("profileScreen.signOutMessage"), [
      { text: translate("common.cancel"), style: "cancel" },
      {
        text: translate("profileScreen.signOut"),
        style: "destructive",
        onPress: async () => {
          await finishSession()
        },
      },
    ])
  }, [finishSession])

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      translate("profileScreen.deleteAccountTitle"),
      translate("profileScreen.deleteAccountMessage"),
      [
        { text: translate("common.cancel"), style: "cancel" },
        {
          text: translate("profileScreen.deleteAccountConfirm"),
          style: "destructive",
          onPress: async () => {
            const response = await profileStore.deleteAccount()

            if (response?.ok && response?.data?.success !== false) {
              await finishSession()
            } else {
              Alert.alert(
                translate("common.error"),
                response?.data?.message || translate("profileScreen.deleteAccountFailed"),
              )
            }
          },
        },
      ],
    )
  }, [finishSession, profileStore])

  return { handleSignOut, handleDeleteAccount, finishSession }
}
