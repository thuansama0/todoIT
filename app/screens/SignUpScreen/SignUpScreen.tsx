import { FC, useState } from "react"
import { Alert, View } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import { authApi } from "app/services/api/authApi"
import { useStores } from "app/models"
import { translate } from "app/i18n"
import { MIN_PASSWORD_LENGTH } from "app/constants/auth"
import { completeAuthSession } from "app/utils/completeAuthSession"
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
  const { authenticationStore, profileStore, notificationStore, todoStore, categoryStore } =
    useStores()

  async function onSignUp() {
    if (!username || !email || !password) {
      Alert.alert(translate("common.missingInfo"), translate("signUpScreen.missingFields"))
      return
    }

    setIsLoading(true)
    const response = await authApi.signUp(email, password, username)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
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
        translate("signUpScreen.signUpFailed"),
        response.data?.message || translate("signUpScreen.signUpFailedDefault"),
      )
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

        <Text tx="signUpScreen.title" preset="authTitle" style={$title} />
        <Text tx="signUpScreen.subtitle" preset="body" style={$subtitle} />
      </View>
      <TextField
        labelTx="signUpScreen.nameLabel"
        value={username}
        onChangeText={setUsername}
        placeholderTx="signUpScreen.namePlaceholder"
        style={$name}
      />
      <TextField
        labelTx="signUpScreen.emailLabel"
        value={email}
        onChangeText={setEmail}
        placeholderTx="signUpScreen.emailPlaceholder"
        style={$email}
      />
      <TextField
        labelTx="signUpScreen.passwordLabel"
        value={password}
        onChangeText={setPassword}
        placeholderTx="signUpScreen.passwordPlaceholder"
        placeholderTxOptions={{ min: MIN_PASSWORD_LENGTH }}
        secureTextEntry
        style={$password}
      />
      <Button
        text={
          isLoading ? translate("signUpScreen.signingUp") : translate("signUpScreen.signUp")
        }
        onPress={onSignUp}
        disabled={isLoading}
        style={$signInButton}
        textStyle={$signInText}
      />
      <Text style={$footerText}>
        {translate("signUpScreen.hasAccount")}
        <Text tx="signUpScreen.signInLink" preset="link" onPress={() => navigation.navigate("Login")} />
      </Text>
    </Screen>
  )
})
