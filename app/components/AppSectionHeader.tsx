import { FC } from "react"
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
  onRightPress?: () => void
  rightText?: string
}

export const AppSectionHeader: FC<AppSectionHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  showRefresh = true,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  rightText,
}) => {
  const shouldShowRefresh = showRefresh && !!onRefresh

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
        rightIcon={rightIcon ?? (shouldShowRefresh ? "refresh" : undefined)}
        rightText={!rightIcon && !shouldShowRefresh ? rightText : undefined}
        onRightPress={onRightPress ?? (shouldShowRefresh ? onRefresh : undefined)}
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

const $icon: TextStyle = {
  fontSize: 24,
  marginRight: 16,
  color: colors.palette.secondary400,
  height: "100%",
}

const $leftIcon: TextStyle = {
  fontSize: 24,
  marginLeft: 16,
  color: colors.palette.neutral900,
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