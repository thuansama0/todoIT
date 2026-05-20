import { useCallback } from "react"
import { Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"

export type PickedAvatarImage = {
  uri: string
  mimeType?: string | null
  fileName?: string | null
}

export function useAvatarImagePicker(onPicked: (image: PickedAvatarImage) => void) {
  const handleResult = useCallback(
    (result: ImagePicker.ImagePickerResult) => {
      if (result.canceled || !result.assets[0]) return
      const asset = result.assets[0]
      onPicked({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      })
    },
    [onPicked],
  )

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

    handleResult(result)
  }, [handleResult])

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

    handleResult(result)
  }, [handleResult])

  const openImageSourcePicker = useCallback(() => {
    Alert.alert("Đổi ảnh đại diện", "Chọn nguồn ảnh", [
      { text: "Thư viện", onPress: pickImageFromLibrary },
      { text: "Chụp ảnh", onPress: takePhoto },
      { text: "Hủy", style: "cancel" },
    ])
  }, [pickImageFromLibrary, takePhoto])

  return { openImageSourcePicker }
}
