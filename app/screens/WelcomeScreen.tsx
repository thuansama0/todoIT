import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, View } from "react-native"
import { Text, Button } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import {
  $bottomContainer,
  $container,
  $loginButton,
  $topContainer,
  $welcomeFace,
  $welcomeHeading,
  $welcomeLogo,
} from "./WelcomeScreen.styles"

const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props,
) {
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const { navigation } = _props

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.readyForLaunch"
          preset="heading"
        />
        <Text tx="welcomeScreen.exciting" preset="subheading" />
        <Image style={$welcomeFace} source={welcomeFace} resizeMode="contain" />
      </View>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <Text tx="welcomeScreen.postscript" size="md" />

        {/* Nút bấm chuyển sang trang Login */}
        <Button
          testID="next-screen-button"
          preset="reversed"
          text="Go to Login"
          onPress={() => navigation.navigate("Login")}
          style={$loginButton}
        />
      </View>
    </View>
  )
})
