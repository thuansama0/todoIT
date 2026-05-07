import { FC } from "react"
import { View, TouchableOpacity, Alert } from "react-native"
import { AppSectionHeader, Screen, Text } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { notificationApi, Notification } from "app/services/api/notificationApi"
import { formatTimeAgo } from "app/utils/formatDate"
import {
  $card,
  $cardHeader,
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

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader
        title="Notification"
        showRefresh={false}
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={$contentWrapper}>
        <View style={$card}>
          <View style={$cardHeader}>
            <View style={$iconCircle}>
              <Feather name="bell" size={24} color={colors.palette.secondary400} />
            </View>
            <View style={$metaInfo}>
              <Text preset="caption" style={$timeText}>
                {formatTimeAgo(notificationData.sentAt)}
              </Text>
              <Text preset="caption" style={$readText}>
                Read
              </Text>
            </View>
          </View>

          <Text preset="titleSm" style={$title}>
            {notificationData.title}
          </Text>
          <Text preset="body">{notificationData.content}</Text>
        </View>

        <TouchableOpacity style={$deleteBtn} onPress={handleDelete}>
          <Feather name="trash-2" size={20} color={colors.palette.angry500} />
          <Text preset="body" style={$deleteBtnText}>
            Delete Notification
          </Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}
