import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenContainer: ViewStyle = { flex: 1, backgroundColor: colors.palette.neutral100 }
export const $headerContainer: ViewStyle = {
  minHeight: 40,
  backgroundColor: colors.palette.neutral100,
  borderBottomWidth: 0,
  marginTop: 10,
}
export const $headerTitleContainer: ViewStyle = { alignItems: "center", justifyContent: "center" }
export const $headerTitle: TextStyle = { fontSize: 18, fontWeight: "bold", color: colors.text }
export const $closeIcon: TextStyle = { fontSize: 24, color: colors.palette.neutral900, marginLeft: 16 }

export const $contentWrapper: ViewStyle = { padding: 20 }
export const $card: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 20,
  padding: 24,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  elevation: 2,
  marginBottom: 24,
}

export const $cardHeader: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 24,
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
export const $timeText: TextStyle = { fontSize: 14, color: colors.palette.neutral500, marginBottom: 4 }
export const $readText: TextStyle = { fontSize: 14, color: colors.palette.secondary400, fontWeight: "500" }

export const $title: TextStyle = {
  fontSize: 24,
  fontWeight: "bold",
  color: colors.palette.neutral700,
  marginBottom: 16,
  lineHeight: 32,
}
export const $content: TextStyle = { fontSize: 16, color: colors.palette.neutral600, lineHeight: 24 }

export const $deleteBtn: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.errorBackground,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
}
export const $deleteBtnText: TextStyle = {
  color: colors.palette.angry500,
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 8,
}
