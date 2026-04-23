import { ImageStyle, TextStyle, ViewStyle } from "react-native"
import { isRTL } from "../i18n"
import { colors, spacing } from "../theme"

export const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

export const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

export const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}

export const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
}

export const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

export const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
}

export const $loginButton: ViewStyle = {
  marginTop: spacing.lg,
}
