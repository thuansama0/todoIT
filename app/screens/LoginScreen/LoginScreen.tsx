import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { Alert, View } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { authApi } from "app/services/api/authApi"
import { useStores } from "app/models"
import { completeAuthSession } from "app/utils/completeAuthSession"
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
  const { authenticationStore } = useStores()
  async function onLogin() {
    if (!email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ email và mật khẩu.")
      return
    }
    setIsLoading(true)
    const response = await authApi.signIn(email, password)

    setIsLoading(false)
    if (response.ok && response.data) {
      if (response.data.success) {
        const accessToken = response.data.data?.accessToken
        await completeAuthSession(authenticationStore, navigation, accessToken)
      } else {
        Alert.alert("Thông báo", response.data.message || "Đăng nhập thất bại.")
      }
    } else {
      if (response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR") {
        Alert.alert("Lỗi kết nối", "Vui lòng kiểm tra lại mạng internet.")
      } else {
        Alert.alert(
          "Đăng nhập thất bại",
          response.data?.message || "Email hoặc mật khẩu không chính xác.",
        )
      }
      console.tron?.log?.("Chi tiết lỗi Sign-in:", response.problem, response.data)
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
        <Text text="Welcome back" preset="authTitle" style={$title} />
        <Text text="Sign in to your Todoit account" preset="body" style={$subtitle} />
      </View>

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={$fieldContainer}
      />

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        style={$fieldContainer1}
      />

      <Button
        text={isLoading ? "Đang đăng nhập..." : "Sign In"}
        onPress={onLogin}
        disabled={isLoading}
        style={[$loginButton, isLoading && $disabledButton]}
        textStyle={$ButtonText}
      />

      <Text style={$footerText1} preset="caption">
        "Demo: demo@todoit.app / password123"
      </Text>

      <Text style={$footerText} preset="caption">
        Don't have an account?
        <Text text=" Sign Up" preset="link" onPress={() => navigation.navigate("SignUp")} />
      </Text>
    </Screen>
  )
})
