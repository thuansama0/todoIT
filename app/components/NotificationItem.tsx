import { FC } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';    
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "app/theme";

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
          <Feather name="bell" size={20} color={colors.palette.gray500} />
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
            <Feather name="check-circle" size={20} color={colors.palette.success500} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={$actionBtn} onPress={onDelete}>
          <Feather name="trash-2" size={20} color={colors.palette.angry500} />
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
};

const $container: ViewStyle = { flexDirection: 'row', backgroundColor: colors.palette.neutral100, borderRadius: 16, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.palette.neutral200 };
const $containerUnread: ViewStyle = { backgroundColor: colors.palette.surfaceSoft, borderColor: colors.palette.secondary100 };
const $leftIcon: ViewStyle = { width: spacing.lg, alignItems: 'center', marginTop: spacing.xxxs, marginRight: spacing.sm };
const $unreadDot: ViewStyle = { width: spacing.xs + spacing.xxs, height: spacing.xs + spacing.xxs, borderRadius: spacing.xs / 2 + spacing.xxs / 2, backgroundColor: colors.palette.info500, marginTop: spacing.xxs + spacing.xxxs };
const $contentContainer: ViewStyle = { flex: 1, justifyContent: 'center' };
const $title: TextStyle = { fontSize: 16, fontFamily: typography.primary.semiBold, color: colors.palette.neutral700, marginBottom: spacing.xxs };
const $titleUnread: TextStyle = { color: colors.palette.neutral700, fontFamily: typography.primary.bold };
const $content: TextStyle = { fontSize: 14, color: colors.palette.neutral600, marginBottom: spacing.xs, lineHeight: 20 };
const $timeText: TextStyle = { fontSize: 12, color: colors.palette.gray500 };
const $actionsContainer: ViewStyle = { justifyContent: 'space-between', paddingLeft: spacing.xs, alignItems: 'center' };
const $actionBtn: ViewStyle = { padding: spacing.xs };