import { useCallback, useEffect, useState } from "react"
import { Alert } from "react-native"
import type { AuthenticationStore } from "app/models/AuthenticationStore"
import type { ProfileStore } from "app/models/ProfileStore"
import { uploadProfileImage, type LocalImageFilePart } from "app/services/api/uploadApi"
import type { PickedAvatarImage } from "app/utils/useAvatarImagePicker"
import type { UpdateUserPayload } from "app/services/api/userApi"
import { translate } from "app/i18n"
import { isLocalPickedImageUri } from "app/utils/imageUri"
import { isMutationSuccess } from "app/utils/isMutationSuccess"
import { getPasswordValidationError } from "app/utils/passwordValidation"
import { logDev, logUploadError } from "app/utils/logDev"

function normalizeImageUri(uri?: string | null) {
  if (!uri) return ""
  const normalized = uri.trim()
  if (!normalized || normalized.toLowerCase() === "null") return ""
  return normalized
}

export function useProfileEditForm(
  profileStore: ProfileStore,
  authenticationStore: AuthenticationStore,
) {
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editImageUrl, setEditImageUrl] = useState("")
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")
  const [localPickedFile, setLocalPickedFile] = useState<LocalImageFilePart | null>(null)

  useEffect(() => {
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
      setEditImageUrl(normalizeImageUri(profileStore.profile.imageUrl))
      setLocalPickedFile(null)
    }
  }, [profileStore.profile])

  const setEditImageFromPicker = useCallback((picked: PickedAvatarImage) => {
    setEditImageUrl(picked.uri)
    setLocalPickedFile({
      uri: picked.uri,
      mimeType: picked.mimeType,
      fileName: picked.fileName,
    })
  }, [])

  const startEdit = useCallback(() => {
    setIsEditing(true)
    setEditPassword("")
  }, [])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
      setEditImageUrl(normalizeImageUri(profileStore.profile.imageUrl))
      setLocalPickedFile(null)
    }
  }, [profileStore.profile])

  const saveProfile = useCallback(async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert(translate("common.error"), translate("profileScreen.missingNameEmail"))
      return
    }

    const passwordError = getPasswordValidationError(editPassword)
    if (passwordError) {
      Alert.alert(translate("profileScreen.passwordInvalidTitle"), passwordError)
      return
    }

    const editedImage = normalizeImageUri(editImageUrl)
    const currentImage = normalizeImageUri(profileStore.profile?.imageUrl)

    setIsSaving(true)

    let resolvedImageUrl: string | undefined
    try {
      if (editedImage === "") {
        resolvedImageUrl = undefined
      } else if (isLocalPickedImageUri(editedImage)) {
        const filePart: LocalImageFilePart =
          localPickedFile?.uri === editedImage ? localPickedFile : { uri: editedImage }
        resolvedImageUrl = await uploadProfileImage(filePart, authenticationStore.authToken)
      } else {
        resolvedImageUrl = editedImage
      }
    } catch (e) {
      setIsSaving(false)
      const code = e instanceof Error ? e.message : ""
      if (code && code !== "AUTH_REQUIRED" && code !== "AUTH_INVALID" && code !== "UPLOAD_BAD_REQUEST") {
        logUploadError("UNEXPECTED", code)
      }
      let detail = translate("profileScreen.imageUploadFailed")
      if (code === "AUTH_REQUIRED" || code === "AUTH_INVALID") {
        detail = translate("profileScreen.imageUploadAuthError")
      } else if (code === "UPLOAD_BAD_REQUEST") {
        detail = translate("profileScreen.imageUploadBadRequest")
      } else if (__DEV__ && e instanceof Error) {
        detail = e.message
      }
      Alert.alert(translate("profileScreen.imageUploadTitle"), detail)
      return
    }

    const payload: UpdateUserPayload = {
      name: editName.trim(),
      email: editEmail.trim(),
    }
    if (editPassword.trim() !== "") {
      payload.password = editPassword
    }
    if (resolvedImageUrl !== undefined && resolvedImageUrl !== currentImage) {
      payload.imageUrl = resolvedImageUrl
    }

    const response = await profileStore.updateProfile(payload)
    setIsSaving(false)

    if (isMutationSuccess(response)) {
      if (__DEV__) {
        logDev("profile", "PUT /user OK", { hasImageUrl: !!payload.imageUrl })
      }
      Alert.alert(translate("common.success"), translate("profileScreen.updateSuccess"))
      setIsEditing(false)
      setEditPassword("")
    } else {
      Alert.alert(
        translate("common.error"),
        response.data?.message || translate("profileScreen.updateFailed"),
      )
    }
  }, [
    editName,
    editEmail,
    editPassword,
    editImageUrl,
    localPickedFile,
    profileStore,
    authenticationStore.authToken,
  ])

  return {
    isEditing,
    startEdit,
    cancelEdit,
    isSaving,
    editName,
    setEditName,
    editEmail,
    setEditEmail,
    editPassword,
    setEditPassword,
    editImageUrl,
    setEditImageUrl,
    setEditImageFromPicker,
    saveProfile,
  }
}
