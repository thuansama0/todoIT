import { FC, useState } from "react"
import { View } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { observer } from "mobx-react-lite"
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
  $signInText2,
  $subtitle,
  $title,
} from "./SignUpScreen.styles"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
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

        <Text text="Create account" preset="heading" style={$title} />
        <Text text="Start organizing your life with Todoit" style={$subtitle} />
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
        text="Create Account"
        onPress={() => console.log("Sign Up pressed")}
        style={$signInButton}
        textStyle={$signInText}
      />
      <Text style={$footerText}>
        Already have an account?
        <Text
          text=" Sign In"
          style={$signInText2}
          onPress={() => navigation.navigate("Login")}
        />
      </Text>
    </Screen>
  )
})
