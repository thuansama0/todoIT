import { FC, useEffect } from "react"
import { FlatList, TouchableOpacity, View, ActivityIndicator, Alert, Pressable } from "react-native"
import { AppSectionHeader, Screen, TodoItem } from "app/components"
import { colors } from "app/theme"
import { AppStackParamList } from "app/navigators"
import { observer } from "mobx-react-lite"
import { Feather } from "@expo/vector-icons"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TabParamList } from "app/navigators/TabNavigator"
import { useStores } from "app/models"
import {
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

const isMutationSuccess = (response: any) => response.ok && response.data?.success !== false

export const TodoScreen: FC<TodoScreenProps> = observer(function TodoScreen({ navigation }) {
  const { todoStore } = useStores()

  useEffect(() => {
    todoStore.loadIfNeeded()
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

  const formatTime = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return "No date"
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const toPlainTodo = (todo: any) => ({
    id: todo.id,
    title: todo.title,
    content: todo.content,
    imageUrl: todo.imageUrl,
    dueDate: todo.dueDate,
    isCompleted: todo.isCompleted,
    reminderMinutes: todo.reminderMinutes ?? 0,
    category: todo.category
      ? {
          id: todo.category.id,
          name: todo.category.name,
          isPublic: todo.category.isPublic,
          isOwner: todo.category.isOwner,
        }
      : null,
  })

  const todoItems = todoStore.items.map(toPlainTodo)

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenInner}
      contentContainerStyle={$screenInner}
    >
      <AppSectionHeader title="My Todos" onRefresh={() => todoStore.fetchTodos()} />

      {todoStore.isLoading ? (
        <View style={$loading}>
          <ActivityIndicator size="large" color={colors.palette.secondary400} />
        </View>
      ) : (
        <FlatList
          style={$list}
          data={todoItems}
          keyExtractor={(item) => item.id}
          refreshing={todoStore.isLoading}
          onRefresh={() => todoStore.fetchTodos()}
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
                    ;(navigation.navigate as any)("EditTodo", { todoData: toPlainTodo(item) })
                  }}
                />
              </Pressable>
            </View>
          )}
          contentContainerStyle={$flatListContent}
        />
      )}

      <TouchableOpacity style={$fab} onPress={() => navigation.navigate("NewTodo")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    </Screen>
  )
})
