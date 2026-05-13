import { FC } from "react"
import { View, TouchableOpacity, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { AppSectionHeader, Screen, Text } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { Notification } from "app/services/api/notificationApi"
import type { AppStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
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

type NotificationDetailScreenProps = AppStackScreenProps<"NotificationDetail">

export const NotificationDetailScreen: FC<NotificationDetailScreenProps> = observer(
  function NotificationDetailScreen({ route, navigation }) {
    const { notificationStore } = useStores()
    const { notificationData } = route.params as { notificationData: Notification }

    const handleDelete = () => {
      Alert.alert("Xác nhận", "Xóa thông báo này?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const response = await notificationStore.deleteNotification(notificationData.id)
            if (response?.ok && response?.data?.success) {
              navigation.goBack()
            } else {
              Alert.alert("Lỗi", "Không thể xóa thông báo. Vui lòng thử lại.")
            }
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
                <Feather name="bell" size={24} color={colors.palette.primary700} />
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
  },
)
