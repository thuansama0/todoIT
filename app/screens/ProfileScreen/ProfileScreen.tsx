import { FC } from "react"
import { View, TouchableOpacity, ActivityIndicator, Image } from "react-native"
import { AppSectionHeader, Screen, Text, TextField } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useIsFocused } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import type { TabParamList } from "app/navigators/TabNavigator"
import { useAvatarImagePicker } from "app/utils/useAvatarImagePicker"
import { useProfileEditForm } from "app/utils/useProfileEditForm"
import { useProfileLoadOnFocus } from "app/utils/useProfileLoadOnFocus"
import { useProfileSession } from "app/utils/useProfileSession"
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

type ProfileScreenProps = BottomTabScreenProps<TabParamList, "Profile">

function getInitials(name: string) {
  if (!name) return "U"
  const words = name.split(" ")
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  const isFocused = useIsFocused()
  const { profileStore } = useStores()

  useProfileLoadOnFocus(isFocused, profileStore)

  const {
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
  } = useProfileEditForm(profileStore)

  const { openImageSourcePicker } = useAvatarImagePicker(setEditImageUrl)

  const { handleSignOut, handleDeleteAccount } = useProfileSession()

  const handleChangePhoto = () => {
    if (!isEditing) return
    openImageSourcePicker()
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
            <TouchableOpacity style={$editProfileBtn} onPress={startEdit}>
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
              <TouchableOpacity style={[$actionBtn, $cancelBtn]} onPress={cancelEdit}>
                <Text preset="body" style={$cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[$actionBtn, $saveBtn]}
                onPress={saveProfile}
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
