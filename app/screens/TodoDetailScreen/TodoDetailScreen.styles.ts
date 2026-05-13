import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }
export const $content: ViewStyle = {
  paddingHorizontal: spacing.md + spacing.xxs,
  paddingBottom: spacing.xl + spacing.xs,
}
export const $loadingSpinner: ViewStyle = { marginTop: spacing.xxl + spacing.xs }

/** Header right: Feather edit control, align with Header icon hit area */
export const $headerEditAction: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.md,
}

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
export const $infoValue: TextStyle = {}
export const $categoryValue: TextStyle = {
  color: colors.palette.primary700,
  fontFamily: typography.primary.bold,
}
export const $statusDone: TextStyle = {
  color: colors.palette.primary700,
  fontFamily: typography.primary.bold,
}
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
/** Mark Done — nền xanh nhạt (mẫu Pale Cactus) */
export const $actionMarkDoneBg: ViewStyle = { backgroundColor: colors.palette.primary900 }
export const $actionMarkDoneText: TextStyle = {
  color: colors.palette.primary700,
  fontFamily: typography.primary.bold,
}
/** Mark Undone / Mark Pending — nền vàng nhạt, chữ cam */
export const $actionMarkUndoneBg: ViewStyle = { backgroundColor: colors.palette.accent100 }
export const $actionMarkUndoneText: TextStyle = { color: colors.palette.accent500 }
export const $actionDelete: ViewStyle = {
  backgroundColor: colors.errorBackground,
  marginTop: spacing.sm,
}
export const $actionDeleteText: TextStyle = { color: colors.palette.angry500 }
