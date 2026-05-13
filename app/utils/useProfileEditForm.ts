import { useCallback, useEffect, useState } from "react"
import { Alert } from "react-native"
import type { ProfileStore } from "app/models/ProfileStore"
import type { UpdateUserPayload } from "app/services/api/userApi"

function normalizeImageUri(uri?: string | null) {
  if (!uri) return ""
  const normalized = uri.trim()
  if (!normalized || normalized.toLowerCase() === "null") return ""
  return normalized
}

export function useProfileEditForm(profileStore: ProfileStore) {
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editImageUrl, setEditImageUrl] = useState("")
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")

  useEffect(() => {
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
      setEditImageUrl(normalizeImageUri(profileStore.profile.imageUrl))
    }
  }, [profileStore.profile])

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
    }
  }, [profileStore.profile])

  const saveProfile = useCallback(async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Lỗi", "Tên và Email không được để trống!")
      return
    }

    setIsSaving(true)
    const payload: UpdateUserPayload = {
      name: editName,
      email: editEmail,
    }
    if (editPassword.trim() !== "") {
      payload.password = editPassword
    }

    const response = await profileStore.updateProfile(payload)
    setIsSaving(false)

    if (response.ok && response.data?.success) {
      Alert.alert("Thành công", "Đã cập nhật thông tin cá nhân!")
      setIsEditing(false)
    } else {
      Alert.alert("Lỗi", response.data?.message || "Không thể cập nhật.")
    }
  }, [editName, editEmail, editPassword, profileStore])

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
    saveProfile,
  }
}
