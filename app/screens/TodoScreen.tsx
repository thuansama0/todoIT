import { FC, useEffect, useState } from "react"
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native"
import { AppSectionHeader, Screen, TodoItem } from "app/components"
import { colors } from "app/theme"
import { AppStackParamList } from "../navigators"
import { observer } from "mobx-react-lite"
import { Feather } from "@expo/vector-icons"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TabParamList } from "../navigators/TabNavigator"
import {
  $fab,
  $flatListContent,
  $list,
  $loading,
  $screenInner,
  $todoItemContainer,
} from "./TodoScreen.styles"

import { todoApi, Todo } from "app/services/api/todoApi"

type TodoScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Todo">,
  NativeStackScreenProps<AppStackParamList>
>

export const TodoScreen: FC<TodoScreenProps> = observer(function TodoScreen({ navigation }) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])
  async function handleToggleStatus(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus

    // Cập nhật trước ở UI để giảm cảm giác trễ khi mạng chậm.
    setTodos(todos.map((t) => (t.id === id ? { ...t, isCompleted: newStatus } : t)))

    const response = await todoApi.toggleTodoStatus(id, newStatus)
    if (!response.ok || !response.data?.success) {
      setTodos(todos.map((t) => (t.id === id ? { ...t, isCompleted: currentStatus } : t)))
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
          // Giữ snapshot để có đường lui nếu API lỗi.
          const backupTodos = [...todos]
          setTodos(todos.filter((t) => t.id !== id))

          const response = await todoApi.deleteTodo(id)
          if (!response.ok || !response.data?.success) {
            setTodos(backupTodos)
            Alert.alert("Lỗi", "Không thể xóa công việc.")
          }
        },
      },
    ])
  }
  async function fetchTodos() {
    setIsLoading(true)
    const response = await todoApi.getTodos()

    if (response.ok && response.data?.success) {
      setTodos(response.data.data?.items || [])
    } else {
      console.log("Lỗi tải danh sách:", response.problem, response.data)
    }
    setIsLoading(false)
  }

  const formatTime = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return "No date"
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenInner}
      contentContainerStyle={$screenInner}
    >
      <AppSectionHeader title="My Todos" onRefresh={fetchTodos} />

      {isLoading ? (
        <View style={$loading}>
          <ActivityIndicator size="large" color={colors.palette.secondary400} />
        </View>
      ) : (
        <FlatList
          style={$list}
          data={todos}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={fetchTodos}
          renderItem={({ item }) => (
            <View style={$todoItemContainer}>
              <Pressable
                onPress={() => (navigation.navigate as any)("TodoDetail", { id: item.id })}
              >
                <TodoItem
                  title={item.title}
                  notes={item.content}
                  timeText={formatTime(item.dueDate)}
                  category={item.category?.name || "General"}
                  isCompleted={item.isCompleted}
                  onToggle={() => handleToggleStatus(item.id, item.isCompleted)}
                  onDelete={() => handleDelete(item.id)}
                  onEdit={() => {
                    ;(navigation.navigate as any)("EditTodo", { todoData: item })
                  }}
                />
              </Pressable>
            </View>
          )}
          contentContainerStyle={$flatListContent}
        />
      )}

      {/* Nút cộng nổi */}
      <TouchableOpacity style={$fab} onPress={() => navigation.navigate("NewTodo")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    </Screen>
  )
})
