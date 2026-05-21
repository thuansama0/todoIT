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
import { MIN_PASSWORD_LENGTH } from "app/constants/auth"
import { translate } from "app/i18n"
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
  $profileTextFieldContainer,
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
  const { profileStore, authenticationStore } = useStores()

  useProfileLoadOnFocus(isFocused, profileStore) // gọi api để lấy thông tin người dùng

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
    setEditImageFromPicker,
    saveProfile,
  } = useProfileEditForm(profileStore, authenticationStore)

  const { openImageSourcePicker } = useAvatarImagePicker(setEditImageFromPicker)

  const { handleSignOut, handleDeleteAccount } = useProfileSession()

  const handleChangePhoto = () => {
    if (!isEditing) return
    openImageSourcePicker()
  }

  if (profileStore.isLoading) {
    return (
      <View style={$loadingContainer}>
        <ActivityIndicator size="large" color={colors.palette.primary700} />
      </View>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader title={translate("profileScreen.title")} showRefresh={false} />

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
            <Text preset="caption" style={$tapToChangeText} tx="profileScreen.tapPhotoToChange" />
          )}
        </View>

        {!isEditing ? (
          <>
            <TouchableOpacity style={$editProfileBtn} onPress={startEdit}>
              <Feather name="edit-2" size={16} color={colors.palette.primary700} />
              <Text preset="body" style={$editProfileText} tx="profileScreen.editProfile" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={$formSection}>
            <TextField
              labelTx="profileScreen.nameLabel"
              containerStyle={$profileTextFieldContainer}
              LabelTextProps={{ preset: "formLabel", style: $label }}
              value={editName}
              onChangeText={setEditName}
              placeholderTx="profileScreen.namePlaceholder"
            />

            <TextField
              labelTx="profileScreen.emailLabel"
              containerStyle={$profileTextFieldContainer}
              LabelTextProps={{ preset: "formLabel", style: $label }}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholderTx="profileScreen.emailPlaceholder"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextField
              labelTx="profileScreen.newPassword"
              placeholderTx="profileScreen.newPasswordPlaceholder"
              placeholderTxOptions={{ min: MIN_PASSWORD_LENGTH }}
              containerStyle={$profileTextFieldContainer}
              LabelTextProps={{ preset: "formLabel", style: $label }}
              value={editPassword}
              onChangeText={setEditPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <View style={$actionRow}>
              <TouchableOpacity style={[$actionBtn, $cancelBtn]} onPress={cancelEdit}>
                <Text preset="body" style={$cancelText} tx="profileScreen.cancel" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[$actionBtn, $saveBtn]}
                onPress={saveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.palette.neutral100} />
                ) : (
                  <Text preset="body" style={$saveText} tx="profileScreen.save" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={$accountSection}>
          <Text preset="caption" style={$sectionTitle} tx="profileScreen.accountSection" />

          <TouchableOpacity style={[$accountBtn, $signOutBtn]} onPress={handleSignOut}>
            <Text preset="body" style={$signOutText} tx="profileScreen.signOut" />
          </TouchableOpacity>

          <TouchableOpacity style={[$accountBtn, $deleteBtn]} onPress={handleDeleteAccount}>
            <Text preset="body" style={$deleteText} tx="profileScreen.deleteAccount" />
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
})
