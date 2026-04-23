import { FC, ReactElement } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Feather } from "@expo/vector-icons"
import { Header } from "./Header"
import { Text } from "./Text"
import { colors } from "app/theme"

interface AppSectionHeaderProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  showRefresh?: boolean
  leftIcon?: "x" | "arrow-left"
  onLeftPress?: () => void
  rightActionComponent?: ReactElement
}

export const AppSectionHeader: FC<AppSectionHeaderProps> = ({
  title,
  subtitle,
  onRefresh,
  showRefresh = true,
  leftIcon,
  onLeftPress,
  rightActionComponent,
}) => {
  const shouldShowRefresh = showRefresh && !!onRefresh
  const hasCustomRightAction = !!rightActionComponent

  const resolvedRightAction = hasCustomRightAction
    ? rightActionComponent
    : shouldShowRefresh
      ? (
          <Feather
            style={$icon}
            name="refresh-cw"
            color={colors.palette.secondary400}
            onPress={onRefresh}
          />
        )
      : undefined

  const resolvedLeftAction = leftIcon ? (
    <Feather
      style={$leftIcon}
      name={leftIcon}
      color={colors.palette.neutral900}
      onPress={onLeftPress}
    />
  ) : undefined

  return (
    <View style={$headerArea}>
      <Header
        safeAreaEdges={[]}
        title={title}
        titleContainerStyle={$titleContainer}
        titleStyle={$title}
        style={$header}
        LeftActionComponent={resolvedLeftAction}
        RightActionComponent={resolvedRightAction}
      />
      {!!subtitle && <Text style={$subtitle}>{subtitle}</Text>}
    </View>
  )
}

const $headerArea: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingBottom: 12,
  borderBottomWidth: 1,
  borderColor: colors.palette.neutral300,
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
