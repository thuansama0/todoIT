import { FC, useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native"
import { AppStackScreenProps } from "../navigators"
import { AppSectionHeader, Screen } from "app/components"
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { todoApi, Todo } from "app/services/api/todoApi"
import {
  $actionBtn,
  $actionBtnText,
  $actionDelete,
  $actionDeleteText,
  $actionDoneBg,
  $actionDoneText,
  $actionsContainer,
  $categoryValue,
  $circleUnchecked,
  $content,
  $divider,
  $rightEditIcon,
  $infoBox,
  $infoIconText,
  $infoLabel,
  $infoRow,
  $infoValue,
  $loadingSpinner,
  $notesText,
  $screenContainer,
  $statusDone,
  $statusPending,
  $titleRow,
  $titleText,
  $titleTextDone,
} from "./TodoDetailScreen.styles"

export const TodoDetailScreen: FC<AppStackScreenProps<"TodoDetail">> = ({ route }) => {
  const navigation = useNavigation()
  const id = (route.params as { id: string } | undefined)?.id ?? ""
  const [todo, setTodo] = useState<Todo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDetail()
  }, [])
  async function fetchDetail() {
    setIsLoading(true)
    if (!id) {
      setIsLoading(false)
      Alert.alert("Lỗi", "Không tìm thấy công việc.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
      return
    }
    const response = await todoApi.getTodoById(id)
    if (response.ok && response.data?.success) {
      setTodo(response.data.data)
    } else {
      Alert.alert("Lỗi", "Không thể tải dữ liệu chi tiết.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    }
    setIsLoading(false)
  }

  async function handleToggleStatus() {
    if (!todo) return
    const newStatus = !todo.isCompleted

    setTodo({ ...todo, isCompleted: newStatus })

    const response = await todoApi.toggleTodoStatus(id, newStatus)
    if (!response.ok || !response.data?.success) {
      setTodo({ ...todo, isCompleted: !newStatus })
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.")
    }
  }

  async function handleDelete() {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa công việc này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true)
          const response = await todoApi.deleteTodo(id)
          if (response.ok && response.data?.success) {
            navigation.goBack()
          } else {
            setIsLoading(false)
            Alert.alert("Lỗi", "Không thể xóa công việc.")
          }
        },
      },
    ])
  }

  const formatTime = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return "No date"
    return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  if (isLoading && !todo) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
        <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
      </Screen>
    )
  }

  if (!todo) return null

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["top"]}
      style={$screenContainer}
      contentContainerStyle={$content}
    >
      <AppSectionHeader
        title="Todo Detail"
        showRefresh={false}
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
        rightActionComponent={
          <Feather
            name="edit-2"
            size={22}
            color={colors.palette.secondary400}
            style={$rightEditIcon}
            onPress={() => (navigation.navigate as any)("EditTodo", { todoData: todo })}
          />
        }
      />

      <View style={$titleRow}>
        <TouchableOpacity onPress={handleToggleStatus}>
          {todo.isCompleted ? (
            <Ionicons name="checkmark-circle" size={32} color={colors.palette.secondary400} />
          ) : (
            <View style={$circleUnchecked} />
          )}
        </TouchableOpacity>
        <Text style={[$titleText, todo.isCompleted && $titleTextDone]}>{todo.title}</Text>
      </View>

      <Text style={$notesText}>{todo.content || "No description provided."}</Text>

      <View style={$infoBox}>
        <View style={$infoRow}>
          <View style={$infoIconText}>
            <Feather name="clock" size={16} color={colors.palette.neutral500} />
            <Text style={$infoLabel}>Due date</Text>
          </View>
          <Text style={$infoValue}>{formatTime(todo.dueDate)}</Text>
        </View>

        <View style={$divider} />

        <View style={$infoRow}>
          <View style={$infoIconText}>
            <Feather name="tag" size={16} color={colors.palette.neutral500} />
            <Text style={$infoLabel}>Category</Text>
          </View>
          <Text style={[$infoValue, $categoryValue]}>{todo.category?.name || "None"}</Text>
        </View>

        <View style={$divider} />

        <View style={$infoRow}>
          <View style={$infoIconText}>
            <Feather name="circle" size={16} color={colors.palette.neutral500} />
            <Text style={$infoLabel}>Status</Text>
          </View>
          <Text style={[$infoValue, todo.isCompleted ? $statusDone : $statusPending]}>
            {todo.isCompleted ? "Completed" : "Pending"}
          </Text>
        </View>
      </View>

      <View style={$actionsContainer}>
        <TouchableOpacity
          style={[$actionBtn, $actionDoneBg]}
          onPress={handleToggleStatus}
        >
          <Feather name={todo.isCompleted ? "x" : "check"} size={18} color={colors.palette.secondary400} />
          <Text style={[$actionBtnText, $actionDoneText]}>
            {todo.isCompleted ? "Mark Undone" : "Mark Done"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[$actionBtn, $actionDelete]} onPress={handleDelete}>
          <Feather name="trash-2" size={18} color={colors.palette.angry500} />
          <Text style={[$actionBtnText, $actionDeleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
}

