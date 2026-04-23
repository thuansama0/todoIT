import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }
export const $loadingContainer: ViewStyle = { flex: 1, justifyContent: "center", alignItems: "center" }

export const $contentWrapper: ViewStyle = { padding: 24 }
export const $avatarSection: ViewStyle = { alignItems: "center", marginBottom: 24 }
export const $avatarCircle: ViewStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.secondary400,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
  position: "relative",
}
export const $avatarText: TextStyle = { fontSize: 36, fontWeight: "bold", color: colors.palette.neutral100 }
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
export const $nameText: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: colors.palette.neutral700,
  marginBottom: 4,
}
export const $emailText: TextStyle = { fontSize: 16, color: colors.palette.neutral500 }
export const $tapToChangeText: TextStyle = { fontSize: 14, color: colors.palette.neutral500, marginTop: 8 }

export const $editProfileBtn: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.palette.secondary100,
  paddingVertical: 16,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 32,
}
export const $editProfileText: TextStyle = {
  color: colors.palette.secondary400,
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
}

export const $formSection: ViewStyle = { marginBottom: 32 }
export const $label: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: colors.palette.neutral600,
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
  marginBottom: 16,
}
export const $actionRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 8,
}
export const $actionBtn: ViewStyle = {
  flex: 1,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}
export const $cancelBtn: ViewStyle = { backgroundColor: colors.palette.secondary100, marginRight: 8 }
export const $saveBtn: ViewStyle = { backgroundColor: colors.palette.secondary400, marginLeft: 8 }
export const $cancelText: TextStyle = {
  color: colors.palette.secondary400,
  fontSize: 16,
  fontWeight: "bold",
}
export const $saveText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 16,
  fontWeight: "bold",
}

export const $accountSection: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  borderRadius: 20,
  padding: 20,
  backgroundColor: colors.palette.neutral100,
}
export const $sectionTitle: TextStyle = {
  fontSize: 12,
  fontWeight: "bold",
  color: colors.palette.neutral500,
  letterSpacing: 1,
  marginBottom: 16,
}
export const $accountBtn: ViewStyle = {
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12,
}
export const $signOutBtn: ViewStyle = { backgroundColor: colors.palette.secondary100 }
export const $deleteBtn: ViewStyle = { backgroundColor: colors.errorBackground, marginBottom: 0 }
export const $signOutText: TextStyle = {
  color: colors.palette.secondary400,
  fontSize: 16,
  fontWeight: "bold",
}
export const $deleteText: TextStyle = { color: colors.palette.angry500, fontSize: 16, fontWeight: "bold" }
