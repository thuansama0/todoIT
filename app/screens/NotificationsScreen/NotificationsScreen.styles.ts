import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

export const $screenFill: ViewStyle = { flex: 1 }
export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral200 }
export const $topActions: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  paddingBottom: spacing.xs,
}
export const $topBtn: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.sm,
  borderRadius: 20,
  marginRight: spacing.sm,
}
/** Mark all read — nền primary nhạt, chữ/icon primary700 */
export const $markAllReadBtn: ViewStyle = { backgroundColor: colors.palette.primary900 }
export const $btnRed: ViewStyle = { backgroundColor: colors.errorBackground }
export const $topBtnText: TextStyle = { marginLeft: spacing.xxs + spacing.xxxs }
export const $markAllReadText: TextStyle = { color: colors.palette.primary700, fontFamily: typography.primary.bold }
export const $topBtnRedText: TextStyle = { color: colors.palette.angry500 }
export const $list: ViewStyle = { flex: 1 }
export const $listContent: ViewStyle = { padding: spacing.md, paddingBottom: spacing.xl + spacing.xs }
export const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: spacing.xxxl + spacing.lg,
}
export const $emptyTitle: TextStyle = {
  marginBottom: spacing.xs,
}
export const $emptySub: TextStyle = { color: colors.palette.neutral400 }
export const $loadingSpinner: ViewStyle = { marginTop: spacing.xxl + spacing.xs }
