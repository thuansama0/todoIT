import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

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
  marginBottom: spacing.xs,
  textAlign: "center",
}
export const $subtitle: TextStyle = {
  marginBottom: spacing.xxxs,
  textAlign: "center",
  color: colors.palette.neutral600,
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
export const $signInButton: ViewStyle = {
  backgroundColor: colors.palette.primary500,
  borderRadius: 20,
  marginTop: spacing.lg,
}
export const $signInText: TextStyle = {
  color: colors.palette.neutral100,
  fontFamily: typography.primary.bold,
}
export const $footerText: TextStyle = {
  marginTop: spacing.md,
  textAlign: "center",
  color: colors.palette.neutral600,
}
export const $logoCheck: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 30,
  fontFamily: typography.primary.bold,
}
