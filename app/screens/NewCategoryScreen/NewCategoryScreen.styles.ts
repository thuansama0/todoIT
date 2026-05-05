import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }

export const $formContainer: ViewStyle = { padding: spacing.md + spacing.xxs }

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
  marginBottom: 24,
}

export const $switchRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: spacing.xl + spacing.xs,
}
export const $switchTextContainer: ViewStyle = { flex: 1, paddingRight: spacing.md }
export const $switchTitle: TextStyle = {
  marginBottom: spacing.xxs,
}
export const $submitButton: ViewStyle = {
  backgroundColor: colors.palette.secondary400,
  paddingVertical: spacing.md,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 56,
}
export const $submitButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontFamily: typography.primary.bold,
}
export const $disabledButton: ViewStyle = { opacity: 0.7 }
