import { ViewStyle } from "react-native"
import { colors } from "app/theme"

export * from "../NewCategoryScreen/NewCategoryScreen.styles"

export const $deleteContainer: ViewStyle = { alignItems: "center", marginTop: 80, paddingBottom: 40 }
export const $deleteOuterCircle: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.errorBackground,
  alignItems: "center",
  justifyContent: "center",
}
export const $deleteInnerCircle: ViewStyle = {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: colors.palette.angry100,
  alignItems: "center",
  justifyContent: "center",
}
