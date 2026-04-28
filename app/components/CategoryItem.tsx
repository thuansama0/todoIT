import { FC } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';    
import { Feather } from "@expo/vector-icons";

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
          color="#757575" 
          style={$iconLeft}
        />
        <Text style={$nameText}>{name}</Text>
      </View>

      {isOwner ? (
        <View style={$actionsContainer}>
          <TouchableOpacity style={$actionBtn} onPress={onEdit}>
            <Feather name="edit-2" size={18} color="#78909c" />
          </TouchableOpacity>
          <TouchableOpacity style={$actionBtn} onPress={onDelete}>
            <Feather name="trash-2" size={18} color="#e53935" />
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
  backgroundColor: '#ffffff',
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 20,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: '#f0f0f0',
  elevation: 1,
};
const $leftContent: ViewStyle = { flexDirection: 'row', alignItems: 'center', flex: 1 };
const $iconLeft: TextStyle = { marginRight: 12 };
const $nameText: TextStyle = { fontSize: 16, fontWeight: '600', color: '#263238' };
const $actionsContainer: ViewStyle = { flexDirection: 'row', alignItems: 'center' };
const $actionBtn: ViewStyle = { marginLeft: 16, padding: 4 };
const $sharedText: TextStyle = { fontSize: 14, color: '#bdbdbd', fontStyle: 'italic' };