import { FC } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';    
import { Feather } from "@expo/vector-icons";

export interface NotificationItemProps {
  title: string;
  content: string;
  isRead: boolean;
  timeAgo: string;
  onPress: () => void;
  onMarkRead?: () => void;
  onDelete?: () => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({ 
  title, content, isRead, timeAgo, onPress, onMarkRead, onDelete 
}) => {
  return (
    <TouchableOpacity style={[$container, !isRead && $containerUnread]} onPress={onPress} activeOpacity={0.8}>
      <View style={$leftIcon}>
        {!isRead ? (
          <View style={$unreadDot} />
        ) : (
          <Feather name="bell" size={20} color="#9e9e9e" />
        )}
      </View>

      <View style={$contentContainer}>
        <Text style={[$title, !isRead && $titleUnread]} numberOfLines={1}>{title}</Text>
        <Text style={$content} numberOfLines={2}>{content}</Text>
        <Text style={$timeText}>{timeAgo}</Text>
      </View>

      <View style={$actionsContainer}>
        {!isRead && (
          <TouchableOpacity style={$actionBtn} onPress={onMarkRead}>
            <Feather name="check-circle" size={20} color="#4CAF50" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={$actionBtn} onPress={onDelete}>
          <Feather name="trash-2" size={20} color="#e53935" />
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
};

const $container: ViewStyle = { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f0f0f0' };
const $containerUnread: ViewStyle = { backgroundColor: '#f8f9ff', borderColor: '#e8eaf6' };
const $leftIcon: ViewStyle = { width: 24, alignItems: 'center', marginTop: 2, marginRight: 12 };
const $unreadDot: ViewStyle = { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b5998', marginTop: 6 };
const $contentContainer: ViewStyle = { flex: 1, justifyContent: 'center' };
const $title: TextStyle = { fontSize: 16, fontWeight: '600', color: '#424242', marginBottom: 4 };
const $titleUnread: TextStyle = { color: '#263238', fontWeight: 'bold' };
const $content: TextStyle = { fontSize: 14, color: '#757575', marginBottom: 8, lineHeight: 20 };
const $timeText: TextStyle = { fontSize: 12, color: '#9e9e9e' };
const $actionsContainer: ViewStyle = { justifyContent: 'space-between', paddingLeft: 8, alignItems: 'center' };
const $actionBtn: ViewStyle = { padding: 8 };