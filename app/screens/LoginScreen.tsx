import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { TextStyle, View,  ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { AppStackScreenProps } from "../navigators"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function onLogin() {
    console.log("Tên đăng nhập:", username)
    console.log("Mật khẩu:", password)
  }

  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$screenContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={$headerContainer}>
    <View style={$logoBox}>
    <Text text="✓" 
    style={{ color: "white", fontSize: 30 }} 
    /> 
    </View>
  
  <Text text="Welcome back" preset="heading" style={$title} />
  <Text text="Sign in to your Todoit account" style={$subtitle} />
</View>
    <TextField 
        label="Email"
        value ={username}
        onChangeText={setUsername}
        placeholder="you@example.com"
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
      <Button text="Sign In" 
      onPress={onLogin} 
      style={$loginButton} 
      textStyle={$ButtonText}
      />
        <Text style={$footerText1}>
          Demo: demo@todoit.app / password123
        </Text>
      <Text style ={$footerText}>
        Don't have an account? 
        <Text text="Sign Up"
        style={$signUpText}
         onPress={() => navigation.navigate("SignUp")}
            />
      </Text>


    </Screen>
  )
})
  const $headerContainer: ViewStyle = {
    alignItems: "center",
    marginBottom: spacing.xl,
  }
  
  const $logoBox: ViewStyle = {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#0052D5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    
  } 



const $screenContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  flex: 1,
  borderRadius: 10,
}

const $title: TextStyle = {
  marginBottom: spacing.xs,
  textAlign: "center",
}

const $subtitle: TextStyle = {
  marginBottom: spacing.xxxs,
  textAlign: "center", 
  color: colors.palette.neutral600, 
}

const $fieldContainer: ViewStyle = {
  marginBottom: spacing.lg, 
  marginTop : 5,
  borderRadius: 8,
  
}

const $loginButton: ViewStyle = {
  marginTop: spacing.lg,
  backgroundColor: "#0052D5",
  borderRadius: 20,
  
}
const $footerText: TextStyle = {
  marginTop: spacing.lg,
  textAlign: "center", 
  color: colors.palette.neutral600,
}
const $footerText1: TextStyle = {
marginTop: spacing.xs, 
  textAlign: "center",
  color: colors.palette.neutral600,
  fontStyle: "italic", 
}
const $fieldContainer1: ViewStyle = {
  marginBottom: spacing.lg,  
  borderRadius: 10,
}
const $ButtonText: TextStyle = {
  color: "white",
}
const $signUpText: TextStyle = {
  color: "blue",
  fontWeight: "bold",
  height: 20,
}