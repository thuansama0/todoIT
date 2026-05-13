import { FC } from "react"
import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "app/theme"
import { ListItem, Text } from "app/components"
import { observer } from "mobx-react-lite"

export interface CategoryItemProps {
  name: string
  isPublic: boolean
  isOwner: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export const CategoryItem: FC<CategoryItemProps> = observer(function CategoryItem(props) {
  const { name, isPublic, isOwner, onEdit, onDelete } = props
  return (
    <ListItem
      height={56}
      containerStyle={$container}
      text={name}
      textStyle={$nameText}
      LeftComponent={
        <View style={$leftContent}>
          <Feather name={isPublic ? "globe" : "lock"} size={16} color={colors.palette.neutral600} />
        </View>
      }
      RightComponent={
        isOwner ? (
          <View style={$actionsContainer}>
            <TouchableOpacity style={$actionBtn} onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="edit-2" size={16} color={colors.palette.slate500} />
            </TouchableOpacity>
            <TouchableOpacity style={$actionBtn} onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="trash-2" size={16} color={colors.palette.angry500} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={$sharedText}>shared</Text>
        )
      }
    />
  )
})

const $container: ViewStyle = {
  marginBottom: spacing.sm,
  borderRadius: 12,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  paddingHorizontal: spacing.sm,
}

const $leftContent: ViewStyle = {
  width: 28,
  alignItems: "center",
  justifyContent: "center",
}

const $nameText: TextStyle = {
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  color: colors.palette.neutral700,
  paddingVertical: 0,
}

const $actionsContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xxs,
}
const $actionBtn: ViewStyle = { padding: spacing.xxxs }
const $sharedText: TextStyle = {
  fontSize: 14,
  color: colors.palette.neutral400,
  fontStyle: "italic",
}
