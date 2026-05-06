import { FC } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';    
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "app/theme";

export interface CategoryItemProps {
  name: string;
  isPublic: boolean;
  isOwner: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const CategoryItem: FC<CategoryItemProps> = ({ name, isPublic, isOwner, onEdit, onDelete }) => {
  return (
    <View style={$container}>
      <View style={$leftContent}>
        <Feather 
          name={isPublic ? "globe" : "lock"} 
          size={18} 
          color={colors.palette.neutral600}
          style={$iconLeft}
        />
        <Text style={$nameText}>{name}</Text>
      </View>

      {isOwner ? (
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
      )}

    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.md + spacing.xxs,
  marginBottom: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  elevation: 1,
};
const $leftContent: ViewStyle = { flexDirection: 'row', alignItems: 'center', flex: 1 };
const $iconLeft: TextStyle = { marginRight: spacing.sm };
const $nameText: TextStyle = { fontSize: 16, fontFamily: typography.primary.semiBold, color: colors.palette.neutral700 };
const $actionsContainer: ViewStyle = { flexDirection: 'row', alignItems: 'center' };
const $actionBtn: ViewStyle = { marginLeft: spacing.md, padding: spacing.xxs };
const $sharedText: TextStyle = { fontSize: 14, color: colors.palette.neutral400, fontStyle: 'italic' };