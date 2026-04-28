import { FC, useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { AppSectionHeader, Screen } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import {
  $accountBtn,
  $accountSection,
  $actionBtn,
  $actionRow,
  $avatarCircle,
  $avatarSection,
  $avatarText,
  $cameraBadge,
  $cancelBtn,
  $cancelText,
  $contentWrapper,
  $deleteBtn,
  $deleteText,
  $editProfileBtn,
  $editProfileText,
  $emailText,
  $formSection,
  $input,
  $label,
  $loadingContainer,
  $nameText,
  $saveBtn,
  $saveText,
  $screenContainer,
  $sectionTitle,
  $signOutBtn,
  $signOutText,
  $tapToChangeText,
} from "./ProfileScreen.styles"

export const ProfileScreen: FC<any> = observer(function ProfileScreen() {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const { profileStore } = useStores()
  const [isSaving, setIsSaving] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")

  useEffect(() => {
    if (isFocused) {
      profileStore.fetchProfile()
    }
  }, [isFocused, profileStore])

  useEffect(() => {
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
    }
  }, [profileStore.profile])

  const handleStartEdit = () => {
    setIsEditing(true)
    // Mật khẩu chỉ được gửi khi người dùng nhập lại.
    setEditPassword("")
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
    }
  }

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Lỗi", "Tên và Email không được để trống!")
      return
    }

    setIsSaving(true)
    const payload: any = {
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
  }

  const handleDeleteAccount = () => {
    Alert.alert(
      "CẢNH BÁO",
      "Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản này không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa vĩnh viễn",
          style: "destructive",
          onPress: async () => {
            await profileStore.deleteAccount()
            ;(navigation.reset as any)({ index: 0, routes: [{ name: "Login" }] })
          },
        },
      ],
    )
  }

  const handleSignOut = () => {
    Alert.alert("Đăng xuất", "Bạn muốn đăng xuất khỏi ứng dụng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: () => {
          // Xóa lịch sử điều hướng để không quay lại màn hình đã đăng nhập.
          ;(navigation.reset as any)({ index: 0, routes: [{ name: "Login" }] })
        },
      },
    ])
  }

  const getInitials = (name: string) => {
    if (!name) return "U"
    const words = name.split(" ")
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  if (profileStore.isLoading) {
    return (
      <View style={$loadingContainer}>
        <ActivityIndicator size="large" color={colors.palette.secondary400} />
      </View>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader title="Profile" showRefresh={false} />

      <View style={$contentWrapper}>
        <View style={$avatarSection}>
          <View style={$avatarCircle}>
            <Text style={$avatarText}>{getInitials(profileStore.profile?.name || "")}</Text>
            {isEditing && (
              <View style={$cameraBadge}>
                <Feather name="camera" size={14} color={colors.palette.neutral500} />
              </View>
            )}
          </View>

          {!isEditing ? (
            <>
              <Text style={$nameText}>{profileStore.profile?.name}</Text>
              <Text style={$emailText}>{profileStore.profile?.email}</Text>
            </>
          ) : (
            <Text style={$tapToChangeText}>Tap photo to change</Text>
          )}
        </View>

        {!isEditing ? (
          <>
            <TouchableOpacity style={$editProfileBtn} onPress={handleStartEdit}>
              <Feather name="edit-2" size={16} color={colors.palette.secondary400} />
              <Text style={$editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={$formSection}>
            <Text style={$label}>Name *</Text>
            <TextInput
              style={$input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
            />

            <Text style={$label}>Email *</Text>
            <TextInput
              style={$input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={$label}>New password (optional)</Text>
            <TextInput
              style={$input}
              value={editPassword}
              onChangeText={setEditPassword}
              placeholder="Leave blank to keep current"
              secureTextEntry
            />

            <View style={$actionRow}>
              <TouchableOpacity style={[$actionBtn, $cancelBtn]} onPress={handleCancelEdit}>
                <Text style={$cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[$actionBtn, $saveBtn]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.palette.neutral100} />
                ) : (
                  <Text style={$saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={$accountSection}>
          <Text style={$sectionTitle}>ACCOUNT</Text>

          <TouchableOpacity style={[$accountBtn, $signOutBtn]} onPress={handleSignOut}>
            <Text style={$signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[$accountBtn, $deleteBtn]} onPress={handleDeleteAccount}>
            <Text style={$deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})
