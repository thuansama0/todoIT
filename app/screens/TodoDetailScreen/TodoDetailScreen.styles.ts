import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }
export const $content: ViewStyle = { paddingHorizontal: spacing.md + spacing.xxs, paddingBottom: spacing.xl + spacing.xs }
export const $loadingSpinner: ViewStyle = { marginTop: spacing.xxl + spacing.xs }

export const $rightEditIcon: TextStyle = { marginRight: spacing.md }

export const $titleRow: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: spacing.lg,
  marginBottom: spacing.md,
}
export const $circleUnchecked: ViewStyle = {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 2,
  borderColor: colors.palette.neutral300,
}
export const $titleText: TextStyle = {
  marginLeft: spacing.md,
  flex: 1,
}
export const $titleTextDone: TextStyle = {
  textDecorationLine: "line-through",
  color: colors.palette.neutral500,
}

export const $notesText: TextStyle = {
  marginBottom: spacing.lg,
}

export const $infoBox: ViewStyle = {
  backgroundColor: colors.palette.neutral200,
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.xl,
}
export const $infoRow: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingVertical: spacing.xs,
}
export const $infoIconText: ViewStyle = { flexDirection: "row", alignItems: "center" }
export const $infoLabel: TextStyle = {
  marginLeft: spacing.sm,
}
export const $infoValue: TextStyle = {
}
export const $categoryValue: TextStyle = { color: colors.palette.secondary400 }
export const $statusDone: TextStyle = { color: colors.palette.secondary400 }
export const $statusPending: TextStyle = { color: colors.palette.accent500 }
export const $divider: ViewStyle = {
  height: 1,
  backgroundColor: colors.palette.neutral300,
  marginVertical: spacing.xxs,
}

export const $actionsContainer: ViewStyle = { marginTop: spacing.xs }
export const $actionBtn: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.md,
  borderRadius: 12,
}
export const $actionBtnText: TextStyle = {
  marginLeft: spacing.xs,
}
export const $actionDoneBg: ViewStyle = { backgroundColor: colors.palette.accent100 }
export const $actionDoneText: TextStyle = { color: colors.palette.secondary400 }
export const $actionDelete: ViewStyle = {
  backgroundColor: colors.errorBackground,
  marginTop: spacing.sm,
}
export const $actionDeleteText: TextStyle = { color: colors.palette.angry500 }
