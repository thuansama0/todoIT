import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"

export const $screenContainer: ViewStyle = {
  padding: spacing.lg,
  flex: 1,
}
export const $headerContainer: ViewStyle = {
  alignItems: "center",
  marginBottom: spacing.xl,
}
export const $logoBox: ViewStyle = {
  width: 65,
  height: 65,
  borderRadius: 8,
  backgroundColor: colors.palette.primary500,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.lg,
}
export const $title: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: colors.text,
}
export const $subtitle: TextStyle = {
  fontSize: 16,
  color: colors.text,
}
export const $name: ViewStyle = {
  marginBottom: spacing.lg,
  borderRadius: 20,
}
export const $email: ViewStyle = {
  marginBottom: spacing.lg,
  borderRadius: 20,
}
export const $password: ViewStyle = {
  marginBottom: spacing.lg,
  borderRadius: 20,
}
export const $nameText: TextStyle = {
  color: colors.text,
}
export const $emailText: TextStyle = {
  color: colors.text,
}
export const $passwordText: TextStyle = {
  color: colors.text,
}
export const $signInButton: ViewStyle = {
  backgroundColor: colors.palette.primary500,
  borderRadius: 20,
  marginTop: spacing.lg,
}
export const $signInText: TextStyle = {
  color: colors.palette.neutral100,
  fontWeight: "bold",
}
export const $footerText: TextStyle = {
  marginTop: spacing.md,
  textAlign: "center",
  color: colors.palette.neutral600,
}
export const $signInText1: TextStyle = {
  color: colors.palette.primary500,
}
export const $signInText2: TextStyle = {
  color: colors.palette.primary500,
  fontWeight: "bold",
  height: 20,
}
export const $logoCheck: TextStyle = { color: colors.palette.neutral100, fontSize: 30 }
