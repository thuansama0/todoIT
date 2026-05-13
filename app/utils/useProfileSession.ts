import { useCallback } from "react"
import { Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"
import { useStores } from "app/models"
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
    Alert.alert("Đăng xuất", "Bạn muốn đăng xuất khỏi ứng dụng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await finishSession()
        },
      },
    ])
  }, [finishSession])

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      "CẢNH BÁO",
      "Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa vĩnh viễn",
          style: "destructive",
          onPress: async () => {
            const response = await profileStore.deleteAccount()

            if (response?.ok && response?.data?.success !== false) {
              await finishSession()
            } else {
              Alert.alert("Lỗi", response?.data?.message || "Không thể xóa tài khoản lúc này.")
            }
          },
        },
      ],
    )
  }, [finishSession, profileStore])

  return { handleSignOut, handleDeleteAccount, finishSession }
}
