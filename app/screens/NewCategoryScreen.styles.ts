import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }

export const $headerArea: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: colors.palette.neutral300,
}

export const $headerContainer: ViewStyle = {
  minHeight: 30,
  backgroundColor: "transparent",
  borderBottomWidth: 0,
  marginTop: 0,
}
export const $headerTitleContainer: ViewStyle = { alignItems: "center", justifyContent: "center" }
export const $headerTitle: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: colors.text,
  height: "100%",
}
export const $closeIcon: TextStyle = { fontSize: 24, color: colors.palette.neutral900, marginLeft: 16 }

export const $formContainer: ViewStyle = { padding: 20 }

export const $label: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: colors.palette.neutral500,
  marginBottom: 8,
}
export const $input: TextStyle = {
  backgroundColor: colors.palette.neutral200,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  color: colors.text,
  marginBottom: 24,
}

export const $switchRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 40,
}
export const $switchTextContainer: ViewStyle = { flex: 1, paddingRight: 16 }
export const $switchTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  color: colors.palette.neutral700,
  marginBottom: 4,
}
export const $switchSubText: TextStyle = { fontSize: 14, color: colors.palette.neutral500 }

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
export const $disabledButton: ViewStyle = { opacity: 0.7 }
