import { TextStyle, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }

export const $contentWrapper: ViewStyle = { padding: spacing.md + spacing.xxs }
export const $card: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: spacing.lg,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  elevation: 2,
  marginBottom: spacing.lg,
}

export const $cardHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: spacing.lg,
}
export const $iconCircle: ViewStyle = {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: colors.palette.secondary100,
  justifyContent: "center",
  alignItems: "center",
}
export const $metaInfo: ViewStyle = { alignItems: "flex-end" }
export const $timeText: TextStyle = { marginBottom: spacing.xxs }
export const $readText: TextStyle = { color: colors.palette.secondary400 }

export const $title: TextStyle = {
  marginBottom: spacing.md,
}
export const $deleteBtn: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.errorBackground,
  paddingVertical: spacing.md,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}
export const $deleteBtnText: TextStyle = {
  color: colors.palette.angry500,
  marginLeft: spacing.xs,
}
