import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

export const $headerContainer: ViewStyle = { alignItems: "center", marginBottom: spacing.xl }
export const $logoBox: ViewStyle = {
  width: 65,
  height: 65,
  borderRadius: 8,
  backgroundColor: colors.palette.secondary400,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.lg,
}
export const $screenContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  flex: 1,
  borderRadius: 10,
}
export const $title: TextStyle = { marginBottom: spacing.xs, textAlign: "center" }
export const $subtitle: TextStyle = {
  marginBottom: spacing.xxxs,
  textAlign: "center",
  color: colors.palette.neutral600,
}
export const $fieldContainer: ViewStyle = { marginBottom: spacing.lg, marginTop: 5, borderRadius: 8 }
export const $loginButton: ViewStyle = {
  marginTop: spacing.lg,
  backgroundColor: colors.palette.secondary400,
  borderRadius: 20,
}
export const $footerText: TextStyle = {
  marginTop: spacing.lg,
  textAlign: "center",
  color: colors.palette.neutral600,
}
export const $footerText1: TextStyle = {
  marginTop: spacing.xs,
  textAlign: "center",
  color: colors.palette.neutral600,
  fontStyle: "italic",
}
export const $fieldContainer1: ViewStyle = { marginBottom: spacing.lg, borderRadius: 10 }
export const $ButtonText: TextStyle = { color: colors.palette.neutral100 }
export const $logoCheck: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 30,
  fontFamily: typography.primary.bold,
}
export const $disabledButton: ViewStyle = { opacity: 0.7 }
