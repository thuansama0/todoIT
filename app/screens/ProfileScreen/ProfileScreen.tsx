import { FC, useEffect, useState } from "react"
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { AppSectionHeader, Screen, Text, TextField } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"
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
  $formSection,
  $emailText,
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
  $avatarImage,
} from "./ProfileScreen.styles"

export const ProfileScreen: FC<any> = observer(function ProfileScreen() {
  type AppStackNavigation = NativeStackNavigationProp<AppStackParamList>
  const navigation = useNavigation<AppStackNavigation>()
  const isFocused = useIsFocused()
  const { profileStore } = useStores()
  const [isSaving, setIsSaving] = useState(false)

  const [isEditing, setIsEditing] = useState(false)

  const [editImageUrl, setEditImageUrl] = useState("")
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPassword, setEditPassword] = useState("")

  const normalizeImageUri = (uri?: string | null) => {
    if (!uri) return ""
    const normalized = uri.trim()
    if (!normalized || normalized.toLowerCase() === "null") return ""
    return normalized
  }

  useEffect(() => {
    if (isFocused) {
      profileStore.fetchProfile()
    }
  }, [isFocused, profileStore])

  useEffect(() => {
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
      setEditImageUrl(normalizeImageUri(profileStore.profile.imageUrl))
    }
  }, [profileStore.profile])

  const handleStartEdit = () => {
    setIsEditing(true)
    // Không giữ password cũ trong form để tránh gửi nhầm dữ liệu nhạy cảm.
    setEditPassword("")
  }
  // hủy edit
  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profileStore.profile) {
      setEditName(profileStore.profile.name)
      setEditEmail(profileStore.profile.email)
      setEditImageUrl(normalizeImageUri(profileStore.profile.imageUrl))
    }
  }
  // chọn ảnh từ thư viện
  async function pickImageFromLibrary() {
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
      setEditImageUrl(result.assets[0].uri)
    }
  }
  // chụp ảnh
  async function takePhoto() {
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
      setEditImageUrl(result.assets[0].uri)
    }
  }
  // đổi ảnh đại diện
  function handleChangePhoto() {
    if (!isEditing) return

    Alert.alert("Đổi ảnh đại diện", "Chọn nguồn ảnh", [
      { text: "Thư viện", onPress: pickImageFromLibrary },
      { text: "Chụp ảnh", onPress: takePhoto },
      { text: "Hủy", style: "cancel" },
    ])
  }
  // lưu profile
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
            navigation.reset({ index: 0, routes: [{ name: "Login" }] })
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
          // Reset stack để người dùng không back lại màn hình cần đăng nhập.
          navigation.reset({ index: 0, routes: [{ name: "Login" }] })
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
          <TouchableOpacity disabled={!isEditing} onPress={handleChangePhoto}>
            <View style={$avatarCircle}>
              {editImageUrl ? (
                <Image source={{ uri: editImageUrl }} style={$avatarImage} />
              ) : (
                <Text preset="title" size="xxl" style={$avatarText}>
                  {getInitials(profileStore.profile?.name || "")}
                </Text>
              )}

              {isEditing && (
                <View style={$cameraBadge}>
                  <Feather name="camera" size={14} color={colors.palette.neutral500} />
                </View>
              )}
            </View>
          </TouchableOpacity>
          {!isEditing ? (
            <>
              <Text preset="titleSm" style={$nameText}>
                {profileStore.profile?.name}
              </Text>
              <Text preset="body" style={$emailText}>
                {profileStore.profile?.email}
              </Text>
            </>
          ) : (
            <Text preset="caption" style={$tapToChangeText}>
              Tap photo to change
            </Text>
          )}
        </View>

        {!isEditing ? (
          <>
            <TouchableOpacity style={$editProfileBtn} onPress={handleStartEdit}>
              <Feather name="edit-2" size={16} color={colors.palette.secondary400} />
              <Text preset="body" style={$editProfileText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={$formSection}>
            <TextField
              label="Name *"
              LabelTextProps={{ preset: "formLabel", style: $label }}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
            />

            <TextField
              label="Email *"
              LabelTextProps={{ preset: "formLabel", style: $label }}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextField
              label="New password (optional)"
              LabelTextProps={{ preset: "formLabel", style: $label }}
              value={editPassword}
              onChangeText={setEditPassword}
              placeholder="Leave blank to keep current"
              secureTextEntry
            />

            <View style={$actionRow}>
              <TouchableOpacity style={[$actionBtn, $cancelBtn]} onPress={handleCancelEdit}>
                <Text preset="body" style={$cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[$actionBtn, $saveBtn]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.palette.neutral100} />
                ) : (
                  <Text preset="body" style={$saveText}>
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={$accountSection}>
          <Text preset="caption" style={$sectionTitle}>
            ACCOUNT
          </Text>

          <TouchableOpacity style={[$accountBtn, $signOutBtn]} onPress={handleSignOut}>
            <Text preset="body" style={$signOutText}>
              Sign Out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[$accountBtn, $deleteBtn]} onPress={handleDeleteAccount}>
            <Text preset="body" style={$deleteText}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})
