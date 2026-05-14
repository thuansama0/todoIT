import { FC, useEffect } from "react"
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AppSectionHeader, Screen, Text } from "app/components"
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { toPlainTodo } from "app/utils/todoMapper"
import { formatTodoDate } from "app/utils/formatDate"
import { isMutationSuccess } from "app/utils/isMutationSuccess"
import { formatReminderSettingLabel } from "app/utils/todoReminder"
import {
  $actionBtn,
  $actionBtnText,
  $actionDelete,
  $actionDeleteText,
  $actionMarkDoneBg,
  $actionMarkDoneText,
  $actionMarkUndoneBg,
  $actionMarkUndoneText,
  $actionsContainer,
  $categoryValue,
  $circleUnchecked,
  $content,
  $divider,
  $headerEditAction,
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

export const TodoDetailScreen: FC<AppStackScreenProps<"TodoDetail">> = observer(
  function TodoDetailScreen({ route, navigation }) {
    const { todoStore } = useStores()
    const { id } = route.params
    const todo = todoStore.items.find((item) => item.id === id)

    useEffect(() => {
      if (!id) {
        Alert.alert("Lỗi", "Không tìm thấy công việc.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ])
        return
      }
      if (!todoStore.isLoaded) {
        todoStore.loadIfNeeded()
      }
    }, [id, navigation, todoStore])

    async function handleToggleStatus() {
      if (!todo) return
      const newStatus = !todo.isCompleted

      const response = await todoStore.toggleTodoStatus(id, newStatus)
      if (!isMutationSuccess(response)) {
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
            const responsePromise = todoStore.deleteTodo(id)
            navigation.goBack()
            const response = await responsePromise
            if (!isMutationSuccess(response)) {
              Alert.alert("Lỗi", "Không thể xóa công việc.")
            }
          },
        },
      ])
    }

    if (todoStore.isLoading && !todo) {
      return (
        <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
          <ActivityIndicator
            size="large"
            color={colors.palette.primary700}
            style={$loadingSpinner}
          />
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
          leftIcon="back"
          onLeftPress={() => navigation.goBack()}
          RightActionComponent={
            <TouchableOpacity
              onPress={() => navigation.navigate("EditTodo", { todoData: toPlainTodo(todo) })}
              accessibilityRole="button"
              accessibilityLabel="Edit todo"
              style={$headerEditAction}
            >
              <Feather name="edit-2" size={22} color={colors.palette.primary700} />
            </TouchableOpacity>
          }
        />

        <View style={$titleRow}>
          <TouchableOpacity onPress={handleToggleStatus}>
            {todo.isCompleted ? (
              <Ionicons name="checkmark-circle" size={32} color={colors.palette.primary700} />
            ) : (
              <View style={$circleUnchecked} />
            )}
          </TouchableOpacity>
          <Text preset="title" style={[$titleText, todo.isCompleted && $titleTextDone]}>
            {todo.title}
          </Text>
        </View>

        <Text preset="body" style={$notesText}>
          {todo.content || "No description provided."}
        </Text>

        <View style={$infoBox}>
          <View style={$infoRow}>
            <View style={$infoIconText}>
              <Feather name="clock" size={16} color={colors.palette.neutral500} />
              <Text preset="caption" style={$infoLabel}>
                Due date
              </Text>
            </View>
            <Text preset="body" style={$infoValue}>
              {formatTodoDate(todo.dueDate)}
            </Text>
          </View>

          <View style={$divider} />

          <View style={$infoRow}>
            <View style={$infoIconText}>
              <Feather name="bell" size={16} color={colors.palette.neutral500} />
              <Text preset="caption" style={$infoLabel}>
                Reminder
              </Text>
            </View>
            <Text preset="body" style={$infoValue}>
              {!todo.dueDate ? "—" : formatReminderSettingLabel(todo.reminderMinutes)}
            </Text>
          </View>

          <View style={$divider} />

          <View style={$infoRow}>
            <View style={$infoIconText}>
              <Feather name="tag" size={16} color={colors.palette.neutral500} />
              <Text preset="caption" style={$infoLabel}>
                Category
              </Text>
            </View>
            <Text preset="body" style={[$infoValue, $categoryValue]}>
              {todo.category?.name || "None"}
            </Text>
          </View>

          <View style={$divider} />

          <View style={$infoRow}>
            <View style={$infoIconText}>
              {todo.isCompleted ? (
                <Ionicons name="checkmark-circle" size={16} color={colors.palette.primary700} />
              ) : (
                <Feather name="circle" size={16} color={colors.palette.neutral500} />
              )}
              <Text preset="caption" style={$infoLabel}>
                Status
              </Text>
            </View>
            <Text
              preset="body"
              style={[$infoValue, todo.isCompleted ? $statusDone : $statusPending]}
            >
              {todo.isCompleted ? "Completed" : "Pending"}
            </Text>
          </View>
        </View>

        <View style={$actionsContainer}>
          <TouchableOpacity
            style={[$actionBtn, todo.isCompleted ? $actionMarkUndoneBg : $actionMarkDoneBg]}
            onPress={handleToggleStatus}
          >
            <Feather
              name={todo.isCompleted ? "rotate-ccw" : "check"}
              size={18}
              color={todo.isCompleted ? colors.palette.accent500 : colors.palette.primary700}
            />
            <Text
              preset="body"
              style={[
                $actionBtnText,
                todo.isCompleted ? $actionMarkUndoneText : $actionMarkDoneText,
              ]}
            >
              {todo.isCompleted ? "Mark Undone" : "Mark Done"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[$actionBtn, $actionDelete]} onPress={handleDelete}>
            <Feather name="trash-2" size={18} color={colors.palette.angry500} />
            <Text preset="body" style={[$actionBtnText, $actionDeleteText]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </Screen>
    )
  },
)
