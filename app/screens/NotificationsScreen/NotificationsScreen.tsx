import { FC, useEffect, useState } from "react"
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { AppSectionHeader, Screen, Text, ListView } from "app/components"
import { NotificationItem } from "app/components/NotificationItem"
import { colors } from "app/theme"
import { Feather, Feather as Icon } from "@expo/vector-icons"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"
import {
  $btnGreen,
  $btnRed,
  $emptyContainer,
  $emptyIconWrapper,
  $emptySub,
  $emptyTitle,
  $list,
  $listContent,
  $loadingSpinner,
  $screenContainer,
  $screenFill,
  $topActions,
  $topBtn,
  $topBtnGreenText,
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

export const NotificationsScreen: FC<any> = observer(function NotificationsScreen() {
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

  const handleMarkAllRead = async () => {
    await notificationStore.markAllRead()
  }

  const handleDeleteAll = () => {
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

  const handleMarkRead = async (id: string) => {
    await notificationStore.markRead(id)
  }

  const handleDelete = async (id: string) => {
    await notificationStore.deleteNotification(id)
  }

  const formatTimeAgo = (timestamp: number) => {
    if (!timestamp) return ""
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000)
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const renderEmpty = () => {
    if (notificationStore.isLoading) return null
    return (
      <View style={$emptyContainer}>
        <View style={$emptyIconWrapper}>
          <Icon name="bell-off" size={32} color={colors.palette.secondary400} />
        </View>
        <Text preset="title" style={$emptyTitle}>
          No notifications
        </Text>
        <Text preset="body" style={$emptySub}>
          You're all caught up
        </Text>
      </View>
    )
  }

  const notificationItems: NotificationListItem[] = notificationStore.items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    isRead: item.isRead,
    sentAt: item.sentAt,
  }))

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenContainer}
      contentContainerStyle={$screenFill}
    >
      <AppSectionHeader
        title="Notifications"
        subtitle={notificationStore.unreadCount > 0 ? `${notificationStore.unreadCount} unread` : undefined}
        onRefresh={() => notificationStore.fetchNotifications()}
      />

      {notificationStore.items.length > 0 && (
        <View style={$topActions}>
          <TouchableOpacity style={[$topBtn, $btnGreen]} onPress={handleMarkAllRead}>
            <Feather name="check-circle" size={16} color={colors.palette.secondary400} />
            <Text preset="caption" style={[$topBtnText, $topBtnGreenText]}>
              Mark all read
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[$topBtn, $btnRed]} onPress={handleDeleteAll}>
            <Feather name="trash-2" size={16} color={colors.palette.angry500} />
            <Text preset="caption" style={[$topBtnText, $topBtnRedText]}>
              Delete all
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {notificationStore.isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
      ) : (
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
      )}
    </Screen>
  )
})
