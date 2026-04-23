import { FC, useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { AppSectionHeader, Screen } from "app/components"
import { NotificationItem } from "app/components/NotificationItem"
import { colors } from "app/theme"
import { Feather, Feather as Icon } from "@expo/vector-icons"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import {
  $btnGreen,
  $btnRed,
  $emptyContainer,
  $emptyIconWrapper,
  $emptyListContent,
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

import { notificationApi, Notification } from "app/services/api/notificationApi"

export const NotificationsScreen: FC<any> = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isFocused) {
      // Re-fetch khi quay lại tab để đồng bộ số unread sau khi xem chi tiết.
      fetchData()
    }
  }, [isFocused])

  async function fetchData() {
    setIsLoading(true)
    const [listRes, countRes] = await Promise.all([
      notificationApi.getNotifications(0, 50),
      notificationApi.getUnreadCount(),
    ])

    if (listRes.ok && listRes.data?.success) {
      const itemsArray = listRes.data.data?.items || []
      setNotifications(itemsArray)
    }
    if (countRes.ok && countRes.data?.success) {
      setUnreadCount(countRes.data.data || 0)
    }
    setIsLoading(false)
  }

  const handleMarkAllRead = async () => {
    // Ưu tiên cảm giác "đã xử lý xong" ngay lập tức trước khi chờ server.
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
    await notificationApi.markAllAsRead()
  }

  const handleDeleteAll = () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa sạch thông báo?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setNotifications([])
          setUnreadCount(0)
          await notificationApi.deleteAllNotifications()
        },
      },
    ])
  }

  const handleMarkRead = async (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
    await notificationApi.markAsRead(id)
  }

  const handleDelete = async (id: string) => {
    const target = notifications.find((n) => n.id === id)
    setNotifications(notifications.filter((n) => n.id !== id))
    // Chỉ giảm unread nếu item vừa xóa trước đó chưa đọc.
    if (target && !target.isRead) setUnreadCount((prev) => Math.max(0, prev - 1))
    await notificationApi.deleteNotification(id)
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
    if (isLoading) return null
    return (
      <View style={$emptyContainer}>
        <View style={$emptyIconWrapper}>
          <Icon name="bell-off" size={32} color={colors.palette.secondary400} />
        </View>
        <Text style={$emptyTitle}>No notifications</Text>
        <Text style={$emptySub}>You're all caught up</Text>
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
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : undefined}
        onRefresh={fetchData}
      />

      {notifications.length > 0 && (
        <View style={$topActions}>
          <TouchableOpacity style={[$topBtn, $btnGreen]} onPress={handleMarkAllRead}>
            <Feather name="check-circle" size={16} color={colors.palette.secondary400} />
            <Text style={[$topBtnText, $topBtnGreenText]}>Mark all read</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[$topBtn, $btnRed]} onPress={handleDeleteAll}>
            <Feather name="trash-2" size={16} color={colors.palette.angry500} />
            <Text style={[$topBtnText, $topBtnRedText]}>Delete all</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
      ) : (
        <FlatList
          style={$list}
          contentContainerStyle={notifications.length === 0 ? $emptyListContent : $listContent}
          data={notifications}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <NotificationItem
              title={item.title}
              content={item.content}
              isRead={item.isRead}
              timeAgo={formatTimeAgo(item.sentAt)}
              onPress={() => {
                if (!item.isRead) handleMarkRead(item.id)
                ;(navigation.navigate as any)("NotificationDetail", { notificationData: item })
              }}
              onMarkRead={() => handleMarkRead(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}
    </Screen>
  )
}
