import { FC, useCallback, useState } from "react"
import {  TouchableOpacity, View, ActivityIndicator, Alert, Pressable } from "react-native"
import { AppSectionHeader, Screen, TodoItem, ListView } from "app/components"
import { colors } from "app/theme"
import { AppStackParamList } from "app/navigators"
import { observer } from "mobx-react-lite"
import { Feather } from "@expo/vector-icons"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TabParamList } from "app/navigators/TabNavigator"
import { toPlainTodo } from "app/utils/todoMapper"
import { useStores } from "app/models"
import { formatTodoDate } from "app/utils/formatDate"
import { isMutationSuccess } from "app/utils/isMutationSuccess"
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
  // Không gắn refreshing của List với todoStore.isLoading: trên Android mỗi lần GET là RefreshControl nhấp nháy → giống reload cả trang (Categories/Profile không bị vì thường đã load xong trước khi vào tab).
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
    if (!isMutationSuccess(response)) { // nếu không thành công thì hiển thị thông báo lỗi
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.")
    }
  }

  function handleDelete(id: string) {
    // Yêu cầu xác nhận vì xóa là thao tác destructive, khó/không thể hoàn tác.
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

  const todoItems = todoStore.items.map(toPlainTodo)
  // Chỉ chặn cả màn bằng spinner khi chưa có dữ liệu; đã có list thì giữ list + indicator kéo (tránh “trắng trang” mỗi lần fetch trên Android).
  const showBlockingLoader = todoStore.isLoading && todoStore.items.length === 0

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenInner}
      contentContainerStyle={$screenInner}
    >
      {/* Bọc header + list trong flex:1 để FlashList luôn có cha có chiều cao (tránh cảnh báo size cha nhỏ trên Android). */}
      <View style={$body}>
        <AppSectionHeader title="My Todos" onRefresh={runTodoRefresh} />

        {showBlockingLoader ? (
          <View style={$loading}>
            <ActivityIndicator size="large" color={colors.palette.secondary400} />
          </View>
        ) : (
          <View style={$list}>
            <ListView
              data={todoItems}
              keyExtractor={(item) => item.id}
              refreshing={pullRefreshing}
              onRefresh={runTodoRefresh}
              estimatedItemSize={56}
              renderItem={({ item }) => (
                <View style={$todoItemContainer}>
                  <Pressable
                    onPress={() => navigation.navigate("TodoDetail", { id: item.id })}
                  >
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
              contentContainerStyle={$flatListContent}
            />
          </View>
        )}
      </View>

      {/* Giữ action thêm todo luôn dễ chạm ở mọi trạng thái của danh sách. */}
      <TouchableOpacity style={$fab} onPress={() => navigation.navigate("NewTodo")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    </Screen>
  )
})
