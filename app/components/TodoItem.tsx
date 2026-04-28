import { FC } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';    
import { Ionicons, Feather } from "@expo/vector-icons";

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
          <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
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
            <Feather name="clock" size={14} color="#9e9e9e" />
            <Text style={$timeText}>{timeText}</Text>
          </View>

          <View style={$badgeContainer}>
            <Text style={$badgeText}>{category}</Text>
          </View>
        </View>
      </View>

      <View style={$actionsContainer}>
        <TouchableOpacity style={$actionButton} onPress={onEdit}>
          <Feather name="edit-2" size={18} color="#78909c" />
        </TouchableOpacity>

        <TouchableOpacity style={$actionButton} onPress={onDelete}>
          <Feather name="trash-2" size={18} color="#e53935" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

const $container: ViewStyle = {
  flexDirection: 'row',
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#f0f0f0',
  elevation: 2, 
};

const $containerCompleted: ViewStyle = {
  backgroundColor: '#fafafa',
};

const $checkboxContainer: ViewStyle = {
  marginRight: 12,
  marginTop: 2,
};

const $circleUnchecked: ViewStyle = {
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 2,
  borderColor: '#cfd8dc',
};

const $contentContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
};

const $title: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#263238',
  marginBottom: 6,
};

const $titleCompleted: TextStyle = {
  textDecorationLine: 'line-through',
  color: '#90a4ae',
};

const $metaRow: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
};

const $timeContainer: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 12,
};

const $timeText: TextStyle = {
  fontSize: 12,
  color: '#9e9e9e',
  marginLeft: 4,
  fontWeight: '500',
};

const $badgeContainer: ViewStyle = { 
  backgroundColor: '#e8eaf6',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
};

const $badgeText: TextStyle = { 
  fontSize: 12,
  color: '#3f51b5',
  fontWeight: '600',
};

const $actionsContainer: ViewStyle = { 
  justifyContent: 'space-between', 
  paddingLeft: 4,  
};

const $actionButton: ViewStyle = { 
  padding: 9,
};
const $notesText: TextStyle = {
  fontSize: 14,
  color: '#546e7a',
  marginTop: 0,
  marginBottom: 8,
};