import { FC, ReactElement } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Header } from "./Header"
import { IconTypes } from "./Icon"
import { colors } from "app/theme"
import { Text } from "./Text"

interface AppSectionHeaderProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  showRefresh?: boolean
  leftIcon?: IconTypes
  onLeftPress?: () => void
  rightIcon?: IconTypes
  /** Overrides reload / right icon tint when provided */
  rightIconColor?: string
  onRightPress?: () => void
  rightText?: string
  /** Custom right action (e.g. vector icon). Overrides rightIcon / rightText / refresh when set. */
  RightActionComponent?: ReactElement
}

export const AppSectionHeader: FC<AppSectionHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  showRefresh = true,
  leftIcon,
  onLeftPress,
  rightIcon,
  rightIconColor,
  onRightPress,
  rightText,
  RightActionComponent,
}) => {
  const shouldShowRefresh = showRefresh && !!onRefresh
  const resolvedRightIcon =
    RightActionComponent != null
      ? undefined
      : rightIcon ?? (shouldShowRefresh ? "refresh" : undefined)
  const resolvedRightIconColor =
    rightIconColor ?? (resolvedRightIcon === "refresh" ? colors.reloadIcon : undefined)
  const resolvedRightText =
    RightActionComponent != null
      ? undefined
      : !rightIcon && !shouldShowRefresh
      ? rightText
      : undefined
  const resolvedOnRightPress =
    RightActionComponent != null
      ? undefined
      : onRightPress ?? (shouldShowRefresh ? onRefresh : undefined)

  return (
    <View style={$headerArea}>
      <Header
        safeAreaEdges={[]}
        title={title}
        titleContainerStyle={$titleContainer}
        titleStyle={$title}
        style={$header}
        leftIcon={leftIcon}
        onLeftPress={onLeftPress}
        rightIcon={resolvedRightIcon}
        rightIconColor={resolvedRightIconColor}
        rightText={resolvedRightText}
        onRightPress={resolvedOnRightPress}
        RightActionComponent={RightActionComponent}
      />
      {!!subtitle && <Text style={$subtitle}>{subtitle}</Text>}
    </View>
  )
}
const $header: ViewStyle = {
  minHeight: 30,
  backgroundColor: "transparent",
  borderBottomWidth: 0,
  marginTop: 0,
}

const $titleContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $title: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: colors.text,
  height: "100%",
}

const $subtitle: TextStyle = {
  textAlign: "center",
  color: colors.palette.neutral500,
  fontSize: 14,
}

const $headerArea: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: colors.palette.neutral300,
}
