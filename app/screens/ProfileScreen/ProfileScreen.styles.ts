import { TextStyle, ViewStyle, ImageStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }
export const $loadingContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

export const $contentWrapper: ViewStyle = { padding: spacing.lg }
export const $avatarSection: ViewStyle = { alignItems: "center", marginBottom: spacing.lg }
export const $avatarCircle: ViewStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.secondary400,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: spacing.md,
  position: "relative",
}
export const $avatarText: TextStyle = {
  color: colors.palette.neutral100,
}
export const $cameraBadge: ViewStyle = {
  position: "absolute",
  bottom: 0,
  right: 0,
  backgroundColor: colors.palette.neutral100,
  width: 32,
  height: 32,
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  elevation: 2,
}
export const $nameText: TextStyle = { marginBottom: spacing.xxs }
export const $emailText: TextStyle = { color: colors.palette.neutral500 }
export const $tapToChangeText: TextStyle = {
  color: colors.palette.neutral500,
  marginTop: spacing.xs,
}

export const $editProfileBtn: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.palette.secondary100,
  paddingVertical: spacing.md,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: spacing.xl,
}
export const $editProfileText: TextStyle = {
  color: colors.palette.secondary400,
  marginLeft: spacing.xs,
}

export const $formSection: ViewStyle = { marginBottom: spacing.xl }
export const $label: TextStyle = {
  marginBottom: spacing.xs,
}
export const $input: TextStyle = {
  backgroundColor: colors.palette.neutral200,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
  marginBottom: spacing.md,
}
export const $actionRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: spacing.xs,
}
export const $actionBtn: ViewStyle = {
  flex: 1,
  paddingVertical: spacing.md,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}
export const $cancelBtn: ViewStyle = {
  backgroundColor: colors.palette.secondary100,
  marginRight: spacing.xs,
}
export const $saveBtn: ViewStyle = { backgroundColor: colors.palette.secondary400, marginLeft: spacing.xs }
export const $cancelText: TextStyle = {
  color: colors.palette.secondary400,
}
export const $saveText: TextStyle = {
  color: colors.palette.neutral100,
}

export const $accountSection: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 20,
  padding: spacing.md + spacing.xxs,
  backgroundColor: colors.palette.neutral100,
}
export const $sectionTitle: TextStyle = {
  color: colors.palette.neutral500,
  letterSpacing: 1,
  marginBottom: spacing.md,
}
export const $accountBtn: ViewStyle = {
  paddingVertical: spacing.md,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: spacing.sm,
}
export const $signOutBtn: ViewStyle = { backgroundColor: colors.palette.secondary100 }
export const $deleteBtn: ViewStyle = { backgroundColor: colors.errorBackground, marginBottom: 0 }
export const $signOutText: TextStyle = {
  color: colors.palette.secondary400,
}
export const $deleteText: TextStyle = {
  color: colors.palette.angry500,
}
export const $avatarImage: ImageStyle = {
  width: "100%",
  height: "100%",
  borderRadius: 50,
}
