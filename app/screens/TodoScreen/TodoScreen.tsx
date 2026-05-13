import { FC, useCallback, useState } from "react"
import { ActivityIndicator, Alert, Pressable, TouchableOpacity, View } from "react-native"
import { AppSectionHeader, ListView, Screen, TodoItem } from "app/components"
import { AppStackParamList } from "app/navigators"
import { TabParamList } from "app/navigators/TabNavigator"
import { useStores } from "app/models"
import { formatTodoDate } from "app/utils/formatDate"
import { isMutationSuccess } from "app/utils/isMutationSuccess"
import { toPlainTodo } from "app/utils/todoMapper"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import {
  $body,
  $fab,
  $flatListContent,
  $list,
  $loading,
  $screenInner,
  $todoItemContainer,
} from "./TodoScreen.styles"

type TodoScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Todo">,
  NativeStackScreenProps<AppStackParamList>
>

export const TodoScreen: FC<TodoScreenProps> = observer(function TodoScreen({ navigation }) {
  const { todoStore } = useStores()

  // Không gắn refreshing của List với todoStore.isLoading: trên Android mỗi lần GET là RefreshControl nhấp nháy.
  const [pullRefreshing, setPullRefreshing] = useState(false)
  const runTodoRefresh = useCallback(async () => {
    setPullRefreshing(true)
    try {
      await todoStore.fetchTodos()
    } finally {
      setPullRefreshing(false)
    }
  }, [todoStore])

  async function handleToggleStatus(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus
    const response = await todoStore.toggleTodoStatus(id, newStatus)
    if (!isMutationSuccess(response)) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.")
    }
  }

  function handleDelete(id: string) {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const response = await todoStore.deleteTodo(id)
          if (!isMutationSuccess(response)) {
            Alert.alert("Lỗi", "Không thể xóa công việc.")
          }
        },
      },
    ])
  }

  function renderTodoList() {
    const todoItems = todoStore.items.map(toPlainTodo)
    // Spinner full vùng list chỉ khi chưa có item; đã có list thì giữ list + pull refresh (tránh trắng màn mỗi lần fetch trên Android).
    const showBlockingLoader = todoStore.isLoading && todoStore.items.length === 0

    if (showBlockingLoader) {
      return (
        <View style={$loading}>
          <ActivityIndicator size="large" color={colors.palette.primary700} />
        </View>
      )
    }

    return (
      <View style={$list}>
        <ListView
          data={todoItems}
          keyExtractor={(item) => item.id}
          refreshing={pullRefreshing}
          onRefresh={runTodoRefresh}
          estimatedItemSize={56}
          contentContainerStyle={$flatListContent}
          renderItem={({ item }) => (
            <View style={$todoItemContainer}>
              <Pressable onPress={() => navigation.navigate("TodoDetail", { id: item.id })}>
                <TodoItem
                  title={item.title}
                  notes={item.content}
                  timeText={formatTodoDate(item.dueDate)}
                  category={item.category?.name || "General"}
                  isCompleted={item.isCompleted}
                  onToggle={() => handleToggleStatus(item.id, item.isCompleted)}
                  onDelete={() => handleDelete(item.id)}
                  onEdit={() => {
                    navigation.navigate("EditTodo", { todoData: toPlainTodo(item) })
                  }}
                />
              </Pressable>
            </View>
          )}
        />
      </View>
    )
  }

  function renderAddButton() {
    return (
      <TouchableOpacity style={$fab} onPress={() => navigation.navigate("NewTodo")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    )
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenInner}
      contentContainerStyle={$screenInner}
    >
      {/* flex:1 để FlashList có cha có chiều cao (Android). */}
      <View style={$body}>
        <AppSectionHeader title="My Todos" onRefresh={runTodoRefresh} />
        {renderTodoList()}
      </View>
      {renderAddButton()}
    </Screen>
  )
})
