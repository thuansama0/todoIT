import { FC } from "react"
import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { Feather } from "@expo/vector-icons"
import { colors, spacing, typography } from "app/theme"
import { ListItem, Text } from "app/components"
import { observer } from "mobx-react-lite"

export interface CategoryItemProps {
  name: string;
  isPublic: boolean;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CategoryItem: FC<CategoryItemProps> = observer(function CategoryItem(props) {
  const { name, isPublic, isOwner, onEdit, onDelete } = props;
  return (
    <ListItem
      height={72}
      containerStyle={$container}
      text={name}
      textStyle={$nameText}
      LeftComponent={
        <View style={$leftContent}>
          <Feather
            name={isPublic ? "globe" : "lock"}
            size={18}
            color={colors.palette.neutral600}
          />
        </View>
      }
      RightComponent={
        isOwner ? (
          <View style={$actionsContainer}>
            <TouchableOpacity style={$actionBtn} onPress={onEdit}>
              <Feather name="edit-2" size={18} color={colors.palette.slate500} />
            </TouchableOpacity>
            <TouchableOpacity style={$actionBtn} onPress={onDelete}>
              <Feather name="trash-2" size={18} color={colors.palette.angry500} />
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
  borderRadius: 16,
  backgroundColor: colors.palette.neutral100,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  paddingHorizontal: spacing.md,
}

const $leftContent: ViewStyle = {
  justifyContent: "center",
  marginRight: spacing.xs,
}

const $nameText: TextStyle = {
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  color: colors.palette.neutral700,
}

const $actionsContainer: ViewStyle = { flexDirection: "row", alignItems: "center" }
const $actionBtn: ViewStyle = { marginLeft: spacing.md, padding: spacing.xxs }
const $sharedText: TextStyle = { fontSize: 14, color: colors.palette.neutral400, fontStyle: "italic" }