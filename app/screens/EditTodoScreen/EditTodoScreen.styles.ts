import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

export const $screenFill: ViewStyle = { flex: 1 }
export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral200 }
export const $formContainer: ViewStyle = { flex: 1 }
export const $formContent: ViewStyle = { padding: spacing.md, paddingBottom: spacing.xl + spacing.xs }
export const $label: TextStyle = {
  marginBottom: spacing.xs,
  marginTop: spacing.md,
}
export const $input: TextStyle = {
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 16,
  fontFamily: typography.primary.normal,
  color: colors.text,
}
export const $notesInput: ViewStyle = { height: 120, minHeight: 120 }
export const $dueDateRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.xs,
}
export const $dropdownButton: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 8,
  padding: spacing.md,
}
export const $dropdownText: TextStyle = { textTransform: "capitalize" }
export const $dropdownTextPlaceholder: TextStyle = { color: colors.palette.neutral400 }
export const $imagePickerWrapper: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  borderStyle: "dashed",
  borderRadius: 8,
  padding: spacing.lg,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}
export const $imagePickerText: TextStyle = { marginLeft: spacing.xs }
export const $footerContainer: ViewStyle = {
  padding: spacing.md,
  paddingBottom: spacing.lg,
  backgroundColor: colors.palette.neutral200,
  borderTopWidth: 1,
  borderColor: colors.palette.neutral300,
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
export const $dropdownButtonOpen: ViewStyle = { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
export const $dropdownList: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderTopWidth: 0,
  borderBottomLeftRadius: 8,
  borderBottomRightRadius: 8,
  overflow: "hidden",
}
export const $dropdownItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral200,
}
export const $dropdownItemActive: ViewStyle = { backgroundColor: colors.palette.secondary100 }
export const $dueDateWrap: ViewStyle = { marginBottom: spacing.md }
export const $reminderRow: ViewStyle = { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs }
export const $reminderChip: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: 16,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  marginRight: spacing.xs,
  marginBottom: spacing.xs,
}
export const $reminderChipActive: ViewStyle = {
  backgroundColor: colors.palette.secondary400,
  borderColor: colors.palette.secondary400,
}
export const $reminderChipTextActive: TextStyle = { color: colors.palette.neutral100 }
export const $labelNoTop: TextStyle = { marginTop: 0 }
export const $labelSmallTop: TextStyle = { marginTop: spacing.xs }
export const $labelLargeTop: TextStyle = { marginTop: spacing.lg }
export const $disabledButton: ViewStyle = { opacity: 0.7 }
