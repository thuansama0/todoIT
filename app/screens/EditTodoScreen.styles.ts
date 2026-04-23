import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenFill: ViewStyle = { flex: 1 }
export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral200 }
export const $headerContainer: ViewStyle = {
  minHeight: 30,
  backgroundColor: colors.palette.neutral100,
  borderBottomWidth: 1,
  borderColor: colors.palette.neutral300,
}
export const $headerTitleContainer: ViewStyle = { alignItems: "center", justifyContent: "center" }
export const $headerTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.text,
  height: "100%",
}
export const $closeIcon: TextStyle = { fontSize: 24, color: colors.palette.neutral900, marginLeft: 16 }
export const $formContainer: ViewStyle = { flex: 1 }
export const $formContent: ViewStyle = { padding: 16, paddingBottom: 40 }
export const $label: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: colors.palette.neutral700,
  marginBottom: 8,
  marginTop: 16,
}
export const $input: TextStyle = {
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 16,
  color: colors.text,
}
export const $notesInput: ViewStyle = { height: 120, minHeight: 120 }
export const $dueDateRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 24,
  marginBottom: 8,
}
export const $dueDateLabel: TextStyle = { fontSize: 14, fontWeight: "600", color: colors.palette.neutral700 }
export const $dropdownButton: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 8,
  padding: 16,
}
export const $dropdownText: TextStyle = { fontSize: 16, color: colors.text, textTransform: "capitalize" }
export const $dropdownTextPlaceholder: TextStyle = { color: colors.palette.neutral400 }
export const $imagePickerWrapper: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral400,
  borderStyle: "dashed",
  borderRadius: 8,
  padding: 24,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}
export const $imagePickerText: TextStyle = { marginLeft: 10, fontSize: 14, color: colors.palette.neutral600 }
export const $footerContainer: ViewStyle = {
  padding: 16,
  paddingBottom: 24,
  backgroundColor: colors.palette.neutral200,
  borderTopWidth: 1,
  borderColor: colors.palette.neutral300,
}
export const $submitButton: ViewStyle = {
  backgroundColor: colors.palette.secondary400,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 56,
}
export const $submitButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "bold",
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
  padding: 16,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral200,
}
export const $dropdownItemActive: ViewStyle = { backgroundColor: colors.palette.secondary100 }
export const $dropdownItemText: TextStyle = { fontSize: 16, color: colors.text }
export const $dueDateWrap: ViewStyle = { marginBottom: 16 }
export const $labelNoTop: TextStyle = { marginTop: 0 }
export const $labelSmallTop: TextStyle = { marginTop: 8 }
export const $labelLargeTop: TextStyle = { marginTop: 24 }
export const $disabledButton: ViewStyle = { opacity: 0.7 }
