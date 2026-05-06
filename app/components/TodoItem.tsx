import { FC } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';    
import { Ionicons, Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "app/theme";

export interface TodoItemProps {
  title: string;
  isCompleted: boolean;
  category: string;
  timeText: string;
  notes : string;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const TodoItem: FC<TodoItemProps> = ({ 
  title, 
  isCompleted, 
  category, 
  timeText, 
  notes, 
  onToggle, 
  onEdit,   
  onDelete  
}) => {
  return (
    <View style={[$container, isCompleted && $containerCompleted]}>
      <TouchableOpacity style={$checkboxContainer} onPress={onToggle}>
        {isCompleted ? (
          <Ionicons name="checkmark-circle" size={28} color={colors.palette.success500} />
        ) : (
          <View style={$circleUnchecked} />
        )}
      </TouchableOpacity>

      <View style={$contentContainer}>
        <Text style={[$title, isCompleted && $titleCompleted]}>
          {title}
        </Text>
        {notes && ( 
          <Text style={$notesText}>{notes}</Text> 
        )}
        <View style={$metaRow}>
          <View style={$timeContainer}> 
            <Feather name="clock" size={14} color={colors.palette.gray500} />
            <Text style={$timeText}>{timeText}</Text>
          </View>

          <View style={$badgeContainer}>
            <Text style={$badgeText}>{category}</Text>
          </View>
        </View>
      </View>

      <View style={$actionsContainer}>
        <TouchableOpacity style={$actionButton} onPress={onEdit}>
          <Feather name="edit-2" size={18} color={colors.palette.slate500} />
        </TouchableOpacity>

        <TouchableOpacity style={$actionButton} onPress={onDelete}>
          <Feather name="trash-2" size={18} color={colors.palette.angry500} />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  backgroundColor: colors.palette.neutral100,
  borderRadius: 16,
  padding: spacing.md,
  marginBottom: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.neutral200,
  elevation: 2, 
};

const $containerCompleted: ViewStyle = {
  backgroundColor: colors.palette.neutral150,
};

const $checkboxContainer: ViewStyle = {
  marginRight: spacing.sm,
  marginTop: spacing.xxxs,
};

const $circleUnchecked: ViewStyle = {
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 2,
  borderColor: colors.palette.neutral300,
};

const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
};

const $title: TextStyle = {
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  color: colors.palette.neutral700,
  marginBottom: spacing.xxs + spacing.xxxs,
};

const $titleCompleted: TextStyle = {
  textDecorationLine: 'line-through',
  color: colors.palette.neutral400,
};

const $metaRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $timeContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: spacing.sm,
};

const $timeText: TextStyle = {
  fontSize: 12,
  color: colors.palette.gray500,
  marginLeft: spacing.xxs,
  fontFamily: typography.primary.medium,
};

const $badgeContainer: ViewStyle = { 
  backgroundColor: colors.palette.secondary100,
  paddingHorizontal: spacing.xs + spacing.xxs,
  paddingVertical: spacing.xxs,
  borderRadius: 12,
};

const $badgeText: TextStyle = { 
  fontSize: 12,
  color: colors.palette.info500,
  fontFamily: typography.primary.semiBold,
};

const $actionsContainer: ViewStyle = { 
  justifyContent: 'space-between', 
  paddingLeft: spacing.xxs,  
};

const $actionButton: ViewStyle = { 
  padding: spacing.xs + spacing.xxxs,
};
const $notesText: TextStyle = {
  fontSize: 14,
  color: colors.palette.neutral600,
  marginTop: 0,
  marginBottom: spacing.xs,
};