import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }
export const $content: ViewStyle = { paddingHorizontal: 20, paddingBottom: 40 }
export const $loadingSpinner: ViewStyle = { marginTop: 50 }

export const $headerContainer: ViewStyle = { minHeight: 40, marginTop: 10 }
export const $headerTitleContainer: ViewStyle = { alignItems: "center", justifyContent: "center" }
export const $headerTitle: TextStyle = { fontSize: 18, fontWeight: "bold", color: colors.text }
export const $iconLeft: TextStyle = { fontSize: 24, color: colors.palette.neutral900 }
export const $iconRight: TextStyle = { fontSize: 22, color: colors.palette.secondary400 }
export const $rightEditIcon: TextStyle = { marginRight: 16 }

export const $titleRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 24,
  marginBottom: 16,
}
export const $circleUnchecked: ViewStyle = {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 2,
  borderColor: colors.palette.neutral300,
}
export const $titleText: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: colors.palette.neutral900,
  marginLeft: 16,
  flex: 1,
}
export const $titleTextDone: TextStyle = {
  textDecorationLine: "line-through",
  color: colors.palette.neutral500,
}

export const $notesText: TextStyle = {
  fontSize: 16,
  color: colors.palette.neutral600,
  lineHeight: 24,
  marginBottom: 24,
}

export const $infoBox: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  borderRadius: 16,
  padding: 16,
  marginBottom: 32,
}
export const $infoRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: 8,
}
export const $infoIconText: ViewStyle = { flexDirection: "row", alignItems: "center" }
export const $infoLabel: TextStyle = {
  fontSize: 15,
  color: colors.palette.neutral500,
  marginLeft: 12,
}
export const $infoValue: TextStyle = {
  fontSize: 15,
  fontWeight: "600",
  color: colors.palette.neutral700,
}
export const $categoryValue: TextStyle = { color: colors.palette.secondary400 }
export const $statusDone: TextStyle = { color: colors.palette.secondary400 }
export const $statusPending: TextStyle = { color: colors.palette.accent500 }
export const $divider: ViewStyle = {
  height: 1,
  backgroundColor: colors.palette.neutral300,
  marginVertical: 4,
}

export const $actionsContainer: ViewStyle = { marginTop: 10 }
export const $actionBtn: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 16,
  borderRadius: 12,
}
export const $actionBtnText: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
}
export const $actionDoneBg: ViewStyle = { backgroundColor: colors.palette.accent100 }
export const $actionDoneText: TextStyle = { color: colors.palette.secondary400 }
export const $actionDelete: ViewStyle = {
  backgroundColor: colors.errorBackground,
  marginTop: 12,
}
export const $actionDeleteText: TextStyle = { color: colors.palette.angry500 }
