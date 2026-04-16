import { FC } from "react"
import { TextStyle, View,  ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { AppStackScreenProps } from "../navigators"
import { observer } from "mobx-react-lite"
import { useState } from "react"

interface NotificationsScreenProps extends AppStackScreenProps<"Notifications"> {}

export const NotificationsScreen: FC<NotificationsScreenProps> = observer(function NotificationsScreen() {
    return (
        <Screen
          preset="scroll"
          contentContainerStyle={$screenContainer}
          safeAreaEdges={["top", "bottom"]}
        >
          <Text text="Notifications Screen" preset="heading" />
        </Screen>
    )
})
 const $screenContainer: ViewStyle = {
   backgroundColor: colors.background,
   paddingVertical: spacing.xxl,
   paddingHorizontal: spacing.lg,
   flex: 1,
 }

 