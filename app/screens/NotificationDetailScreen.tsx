import { FC } from "react"
import { View, Text, TouchableOpacity, Alert } from "react-native"
import { AppSectionHeader, Screen } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { notificationApi, Notification } from "app/services/api/notificationApi"
import {
  $card,
  $cardHeader,
  $content,
  $contentWrapper,
  $deleteBtn,
  $deleteBtnText,
  $iconCircle,
  $metaInfo,
  $readText,
  $screenContainer,
  $timeText,
  $title,
} from "./NotificationDetailScreen.styles"

export const NotificationDetailScreen: FC<any> = ({ route }) => {
  const navigation = useNavigation()
  const { notificationData } = route.params as { notificationData: Notification }

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Xóa thông báo này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          await notificationApi.deleteNotification(notificationData.id)
          navigation.goBack()
        },
      },
    ])
  }

  const formatTimeAgo = (timestamp: number) => {
    if (!timestamp) return ""
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000)
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader
        title="Notification"
        showRefresh={false}
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={$contentWrapper}>
        <View style={$card}>
          {/* Dòng Header của thẻ: Icon, Time, Trạng thái */}
          <View style={$cardHeader}>
            <View style={$iconCircle}>
              <Feather name="bell" size={24} color={colors.palette.secondary400} />
            </View>
            <View style={$metaInfo}>
              <Text style={$timeText}>{formatTimeAgo(notificationData.sentAt)}</Text>
              {/* Nếu vào màn này thì coi như đã đọc luôn */}
              <Text style={$readText}>Read</Text>
            </View>
          </View>

          {/* Nội dung chính */}
          <Text style={$title}>{notificationData.title}</Text>
          <Text style={$content}>{notificationData.content}</Text>
        </View>

        {/* Nút Xóa đỏ to */}
        <TouchableOpacity style={$deleteBtn} onPress={handleDelete}>
          <Feather name="trash-2" size={20} color={colors.palette.angry500} />
          <Text style={$deleteBtnText}>Delete Notification</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
