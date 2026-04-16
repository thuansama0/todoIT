import { FC } from "react"
import { TextStyle, View,  ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { AppStackScreenProps } from "../navigators"
import { observer } from "mobx-react-lite"
import { useState } from "react"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
    return (
        <Screen
          preset="scroll"
          contentContainerStyle={$screenContainer}
          safeAreaEdges={["top", "bottom"]}
        >
          <Text text="Profile Screen" preset="heading" />
        </Screen>
    )
})
 const $screenContainer: ViewStyle = {
   backgroundColor: colors.background,
   paddingVertical: spacing.xxl,
   paddingHorizontal: spacing.lg,
   flex: 1,
 }

 