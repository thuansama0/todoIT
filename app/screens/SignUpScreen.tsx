import { FC, useState } from "react"
import { TextStyle, View,  ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { AppStackScreenProps } from "../navigators"
import { observer } from "mobx-react-lite"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen({ navigation }) {
  const [username, setUsername] =useState("")
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
        <Text text="✓" 
        style={{ color: "white", fontSize: 30 }} 
        /> 
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
            textStyle={$nameText}
               
          />
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            style={$email}
            textStyle={$emailText}
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min 6 characters"
            secureTextEntry 
            style={$password}
            textStyle={$passwordText}
          />
            <Button
                text="Create Account"
                onPress={() => console.log("Sign Up pressed")}
                style={$signInButton}
                textStyle={$signInText}
            />
              <Text style ={$footerText}>
                Already have an account?
                      <Text text=" Sign In"
                      style={$signInText2}
                        textStyle={$signInText1}
                       onPress={() => navigation.navigate("Login")}
                          />
                    </Text>
              
            
        </Screen>
    )
})
const $screenContainer: ViewStyle = {
  padding: spacing.lg,
  flex: 1,
}
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
const $title: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: colors.text,
}
const $subtitle: TextStyle = {
  fontSize: 16,
  color: colors.text, 
}
const $name: ViewStyle = {
  marginBottom: spacing.lg,
  borderRadius: 20,
}   
const $email: ViewStyle = {
  marginBottom: spacing.lg, 
 borderRadius: 20,
}
const $password: ViewStyle = {
  marginBottom: spacing.lg,
  borderRadius: 20,
}
const $nameText: TextStyle = {
  color: colors.text,
}
const $emailText: TextStyle = {
  color: colors.text,       
}
const $passwordText: TextStyle = {
  color: colors.text, 
}
const $signInButton: ViewStyle = {
  backgroundColor: "#0052D5",
  borderRadius: 20,
   marginTop: spacing.lg,
}
const $signInText: TextStyle = {
  color: "white",
  fontWeight: "bold",
}
const $footerText: TextStyle = {
  marginTop: spacing.md,
  textAlign: "center", 
  color: colors.palette.neutral600,
}
const $signInText1: TextStyle = {
    color: "blue",
}
const $signInText2: TextStyle = { 
    color : "blue", 
    fontWeight: "bold",
    height: 20,
}