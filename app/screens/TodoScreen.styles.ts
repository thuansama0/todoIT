import { ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $screenInner: ViewStyle = { flex: 1 }
export const $list: ViewStyle = { flex: 1, paddingTop: 16 }
export const $todoItemContainer: ViewStyle = { paddingHorizontal: 16, marginBottom: 0, paddingTop: 0 }
export const $flatListContent: ViewStyle = { paddingBottom: 100 }
export const $loading: ViewStyle = { flex: 1, justifyContent: "center", alignItems: "center" }
export const $fab: ViewStyle = {
  position: "absolute",
  bottom: 40,
  right: 24,
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: colors.palette.secondary400,
  alignItems: "center",
  justifyContent: "center",
  elevation: 8,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  zIndex: 10,
}
