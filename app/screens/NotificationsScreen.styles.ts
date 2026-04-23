import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenFill: ViewStyle = { flex: 1 }
export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral200 }
export const $topActions: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: 8,
}
export const $topBtn: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  marginRight: 12,
}
export const $btnGreen: ViewStyle = { backgroundColor: colors.palette.accent100 }
export const $btnRed: ViewStyle = { backgroundColor: colors.errorBackground }
export const $topBtnText: TextStyle = { fontSize: 14, fontWeight: "600", marginLeft: 6 }
export const $topBtnGreenText: TextStyle = { color: colors.palette.secondary400 }
export const $topBtnRedText: TextStyle = { color: colors.palette.angry500 }
export const $list: ViewStyle = { flex: 1 }
export const $emptyListContent: ViewStyle = { flex: 1 }
export const $listContent: ViewStyle = { padding: 16, paddingBottom: 40, flexGrow: 1 }
export const $emptyContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: 100,
}
export const $emptyIconWrapper: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.palette.secondary100,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 24,
}
export const $emptyTitle: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: colors.palette.neutral700,
  marginBottom: 8,
}
export const $emptySub: TextStyle = { fontSize: 16, color: colors.palette.neutral400 }
export const $loadingSpinner: ViewStyle = { marginTop: 50 }
