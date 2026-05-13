import { FC, useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
} from "react-native"
import { AppSectionHeader, EmptyState, ListView, Screen, Text } from "app/components"
import { NotificationItem } from "app/components/NotificationItem"
import { AppStackParamList } from "app/navigators"
import type { TabParamList } from "app/navigators/TabNavigator"
import { useStores } from "app/models"
import { colors } from "app/theme"
import { formatTimeAgo } from "app/utils/formatDate"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Feather } from "@expo/vector-icons"
import { observer } from "mobx-react-lite"
import {
  $btnRed,
  $markAllReadBtn,
  $emptyContainer,
  $emptySub,
  $emptyTitle,
  $list,
  $listContent,
  $loadingSpinner,
  $screenContainer,
  $screenFill,
  $topActions,
  $topBtn,
  $markAllReadText,
  $topBtnRedText,
  $topBtnText,
} from "./NotificationsScreen.styles"

type NotificationListItem = {
  id: string
  title: string
  content: string
  isRead: boolean
  sentAt: number
}

type NotificationsScreenProps = BottomTabScreenProps<TabParamList, "Notifications">

export const NotificationsScreen: FC<NotificationsScreenProps> = observer(
  function NotificationsScreen() {
    type AppStackNavigation = NativeStackNavigationProp<AppStackParamList>
    const navigation = useNavigation<AppStackNavigation>()
    const isFocused = useIsFocused()
    const { notificationStore } = useStores()
    const [, setTimeTick] = useState(0)

    useEffect(() => {
      if (!isFocused) return
      const id = setInterval(() => setTimeTick((n) => n + 1), 15000)
      return () => clearInterval(id)
    }, [isFocused])

    useEffect(() => {
      if (isFocused) {
        notificationStore.fetchNotifications()
      }
    }, [isFocused, notificationStore])

    async function handleMarkAllRead() {
      await notificationStore.markAllRead()
    }

    function handleDeleteAll() {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa sạch thông báo?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await notificationStore.deleteAllNotifications()
          },
        },
      ])
    }

    async function handleMarkRead(id: string) {
      await notificationStore.markRead(id)
    }

    async function handleDelete(id: string) {
      await notificationStore.deleteNotification(id)
    }

    function renderEmpty() {
      if (notificationStore.isLoading) return null

      // Dùng EmptyState của Ignite để thống nhất UI empty và tránh nhân đôi layout giữa các màn.
      return (
        <EmptyState
          heading="No notifications"
          content="You're all caught up"
          button=""
          style={$emptyContainer}
          headingStyle={$emptyTitle}
          contentStyle={$emptySub}
        />
      )
    }

    function renderTopActions() {
      if (notificationStore.items.length === 0) return null

      const hasUnread = notificationStore.unreadCount > 0

      return (
        <View style={$topActions}>
          {hasUnread && (
            <TouchableOpacity style={[$topBtn, $markAllReadBtn]} onPress={handleMarkAllRead}>
              <Feather name="check-circle" size={16} color={colors.palette.primary700} />
              <Text preset="caption" style={[$topBtnText, $markAllReadText]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[$topBtn, $btnRed]} onPress={handleDeleteAll}>
            <Feather name="trash-2" size={16} color={colors.palette.angry500} />
            <Text preset="caption" style={[$topBtnText, $topBtnRedText]}>
              Delete all
            </Text>
          </TouchableOpacity>
        </View>
      )
    }

    function renderNotificationList() {
      const notificationItems: NotificationListItem[] = notificationStore.items.map((item) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        isRead: item.isRead,
        sentAt: item.sentAt,
      }))

      if (notificationStore.isLoading) {
        return (
          <ActivityIndicator size="large" color={colors.palette.primary700} style={$loadingSpinner} />
        )
      }

      return (
        <View style={$list}>
          <ListView<NotificationListItem>
            contentContainerStyle={notificationStore.items.length > 0 ? $listContent : undefined}
            data={notificationItems}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmpty}
            estimatedItemSize={56}
            renderItem={({ item }) => (
              <NotificationItem
                title={item.title}
                content={item.content}
                isRead={item.isRead}
                timeAgo={formatTimeAgo(item.sentAt)}
                onPress={() => {
                  if (!item.isRead) handleMarkRead(item.id)
                  navigation.navigate("NotificationDetail", { notificationData: item })
                }}
                onMarkRead={() => handleMarkRead(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        </View>
      )
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        style={$screenContainer}
        contentContainerStyle={$screenFill}
      >
        <AppSectionHeader
          title="Notifications"
          subtitle={
            notificationStore.unreadCount > 0 ? `${notificationStore.unreadCount} unread` : undefined
          }
          onRefresh={() => notificationStore.fetchNotifications()}
        />

        {renderTopActions()}
        {renderNotificationList()}
      </Screen>
    )
  },
)
