import { useCallback } from "react"
import { Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { translate } from "app/i18n"

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
      Alert.alert(
        translate("avatarPicker.libraryPermissionTitle"),
        translate("avatarPicker.libraryPermissionMessage"),
      )
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
      Alert.alert(
        translate("avatarPicker.cameraPermissionTitle"),
        translate("avatarPicker.cameraPermissionMessage"),
      )
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
    Alert.alert(
      translate("avatarPicker.changeAvatarTitle"),
      translate("avatarPicker.changeAvatarMessage"),
      [
        { text: translate("avatarPicker.library"), onPress: pickImageFromLibrary },
        { text: translate("avatarPicker.takePhoto"), onPress: takePhoto },
        { text: translate("common.cancel"), style: "cancel" },
      ],
    )
  }, [pickImageFromLibrary, takePhoto])

  return { openImageSourcePicker }
}
