import { FC, useState } from "react"
import { Alert, View } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { authApi } from "app/services/api/authApi"
import { saveString } from "app/utils/storage"
import { useStores } from "app/models"
import { syncExpoPushTokenWithServer } from "app/utils/usePushNotifications"
import {
  $email,
  $footerText,
  $headerContainer,
  $logoBox,
  $logoCheck,
  $name,
  $password,
  $screenContainer,
  $signInButton,
  $signInText,
  $subtitle,
  $title,
} from "./SignUpScreen.styles"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { authenticationStore } = useStores()

  async function onSignUp() {
    if (!username || !email || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ tên, email và mật khẩu.")
      return
    }

    setIsLoading(true)
    const response = await authApi.signUp(email, password, username)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      const accessToken = response.data.data?.accessToken
      if (accessToken) {
        authenticationStore.setAuthToken(accessToken)
        await saveString("accessToken", accessToken)
        void syncExpoPushTokenWithServer(accessToken).catch(() => {}) 
      }
      navigation.navigate("MainTabs")
    } else {
      Alert.alert("Đăng ký thất bại", response.data?.message || "Không thể tạo tài khoản.")
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

        <Text text="Create account" preset="authTitle" style={$title} />
        <Text text="Start organizing your life with Todoit" preset="body" style={$subtitle} />
      </View>
      <TextField
        label="Name"
        value={username}
        onChangeText={setUsername}
        placeholder="Your full name"
        style={$name}
      />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        style={$email}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Min 6 characters"
        secureTextEntry
        style={$password}
      />
      <Button
        text={isLoading ? "Đang tạo tài khoản..." : "Create Account"}
        onPress={onSignUp}
        disabled={isLoading}
        style={$signInButton}
        textStyle={$signInText}
      />
      <Text style={$footerText}>
        Already have an account?
        <Text text=" Sign In" preset="link" onPress={() => navigation.navigate("Login")} />
      </Text>
    </Screen>
  )
})
