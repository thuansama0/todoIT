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
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
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

export const NotificationsScreen: FC<any> = observer(function NotificationsScreen() {
  const navigation = useNavigation()
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
        subtitle={notificationStore.unreadCount > 0 ? `${notificationStore.unreadCount} unread` : undefined}
        onRefresh={() => notificationStore.fetchNotifications()}
      />

      {notificationStore.items.length > 0 && (
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

      {notificationStore.isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
      ) : (
        <FlatList
          style={$list}
          contentContainerStyle={notificationStore.items.length === 0 ? $emptyListContent : $listContent}
          data={notificationStore.items}
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
})
