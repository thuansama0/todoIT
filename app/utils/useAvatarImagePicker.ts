import { useCallback } from "react"
import { Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"

export function useAvatarImagePicker(onUriPicked: (uri: string) => void) {
  const pickImageFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert("Cần quyền truy cập", "Vui lòng cho phép app truy cập thư viện ảnh.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      onUriPicked(result.assets[0].uri)
    }
  }, [onUriPicked])

  const takePhoto = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync()

    if (!permission.granted) {
      Alert.alert("Cần quyền camera", "Vui lòng cho phép app sử dụng camera.")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      onUriPicked(result.assets[0].uri)
    }
  }, [onUriPicked])

  const openImageSourcePicker = useCallback(() => {
    Alert.alert("Đổi ảnh đại diện", "Chọn nguồn ảnh", [
      { text: "Thư viện", onPress: pickImageFromLibrary },
      { text: "Chụp ảnh", onPress: takePhoto },
      { text: "Hủy", style: "cancel" },
    ])
  }, [pickImageFromLibrary, takePhoto])

  return { openImageSourcePicker }
}
