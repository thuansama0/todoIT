import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Alert, View } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { authApi } from "app/services/api/authApi"
import { useStores } from "app/models"
import { translate } from "app/i18n"
import { completeAuthSession } from "app/utils/completeAuthSession"
import { logApisauceResponse } from "app/utils/logDev"
import {
  $ButtonText,
  $disabledButton,
  $fieldContainer,
  $fieldContainer1,
  $footerText,
  $footerText1,
  $headerContainer,
  $loginButton,
  $logoBox,
  $logoCheck,
  $screenContainer,
  $subtitle,
  $title,
} from "./LoginScreen.styles"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { authenticationStore, profileStore, notificationStore, todoStore, categoryStore } =
    useStores()

  async function onLogin() {
    if (!email || !password) {
      Alert.alert(translate("common.missingInfo"), translate("loginScreen.missingCredentials"))
      return
    }
    setIsLoading(true)
    const response = await authApi.signIn(email, password)

    setIsLoading(false)
    if (response.ok && response.data) {
      if (response.data.success) {
        const accessToken = response.data.data?.accessToken
        await completeAuthSession(
          {
            authenticationStore,
            profileStore,
            notificationStore,
            todoStore,
            categoryStore,
          },
          navigation,
          accessToken,
        )
      } else {
        Alert.alert(
          translate("common.notice"),
          response.data.message || translate("loginScreen.loginFailedDefault"),
        )
      }
    } else {
      if (response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR") {
        Alert.alert(translate("common.networkError"), translate("common.checkInternet"))
      } else {
        Alert.alert(
          translate("loginScreen.loginFailed"),
          response.data?.message || translate("loginScreen.invalidCredentials"),
        )
      }
      if (__DEV__) {
        logApisauceResponse("auth", response)
      }
    }
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$screenContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$headerContainer}>
        <View style={$logoBox}>
          <Text text="✓" style={$logoCheck} />
        </View>
        <Text tx="loginScreen.title" preset="authTitle" style={$title} />
        <Text tx="loginScreen.subtitle" preset="body" style={$subtitle} />
      </View>

      <TextField
        labelTx="loginScreen.emailLabel"
        value={email}
        onChangeText={setEmail}
        placeholderTx="loginScreen.emailPlaceholder"
        autoCapitalize="none"
        keyboardType="email-address"
        style={$fieldContainer}
      />

      <TextField
        labelTx="loginScreen.passwordLabel"
        value={password}
        onChangeText={setPassword}
        placeholderTx="loginScreen.passwordPlaceholder"
        secureTextEntry
        style={$fieldContainer1}
      />

      <Button
        text={isLoading ? translate("loginScreen.signingIn") : translate("loginScreen.signIn")}
        onPress={onLogin}
        disabled={isLoading}
        style={[$loginButton, isLoading && $disabledButton]}
        textStyle={$ButtonText}
      />

      <Text style={$footerText1} preset="caption" tx="loginScreen.demoHint" />

      <Text style={$footerText} preset="caption">
        {translate("loginScreen.noAccount")}
        <Text
          tx="loginScreen.signUpLink"
          preset="link"
          onPress={() => navigation.navigate("SignUp")}
        />
      </Text>
    </Screen>
  )
})
