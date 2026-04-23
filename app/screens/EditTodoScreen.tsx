import { FC, useState, useEffect } from "react"
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native"
import { AppSectionHeader, Screen, Button } from "app/components"
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { todoApi, Todo } from "app/services/api/todoApi"
import { categoryApi, Category } from "app/services/api/categoryApi"
import {
  $disabledButton,
  $dropdownButton,
  $dropdownButtonOpen,
  $dropdownItem,
  $dropdownItemActive,
  $dropdownItemText,
  $dropdownList,
  $dropdownText,
  $dropdownTextPlaceholder,
  $dueDateLabel,
  $dueDateRow,
  $dueDateWrap,
  $footerContainer,
  $formContainer,
  $formContent,
  $imagePickerText,
  $imagePickerWrapper,
  $input,
  $label,
  $labelLargeTop,
  $labelNoTop,
  $labelSmallTop,
  $notesInput,
  $screenContainer,
  $screenFill,
  $submitButton,
  $submitButtonText,
} from "./EditTodoScreen.styles"

export const EditTodoScreen: FC<any> = ({ route }) => {
  const navigation = useNavigation()

  const { todoData } = route.params as { todoData: Todo }

  const getInitialDateString = (timestamp: number) => {
    if (!timestamp || timestamp === 0) return ""
    const date = new Date(timestamp)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const [title, setTitle] = useState(todoData.title || "")
  const [content, setContent] = useState(todoData.content || "")
  const [isLoading, setIsLoading] = useState(false)

  const [hasDueDate, setHasDueDate] = useState(!!todoData.dueDate && todoData.dueDate > 0)
  const [dueDateString, setDueDateString] = useState(getInitialDateString(todoData.dueDate))

  const [categories, setCategories] = useState<Category[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(todoData.category?.id || "")
  const [selectedCategoryName, setSelectedCategoryName] = useState(
    todoData.category?.name || "No category",
  )

  useEffect(() => {
    async function fetchCats() {
      const response = await categoryApi.getCategories()
      if (response.ok && response.data?.success) {
        setCategories(response.data.data?.items || [])
      }
    }
    // Nạp danh sách để cho phép đổi category ngay cả khi todo cũ không có category.
    fetchCats()
  }, [])

  const getCurrentDateString = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd}`
  }

  const handleToggleDueDate = (value: boolean) => {
    setHasDueDate(value)
    if (value) {
      // Bật due date thì gán sẵn hôm nay để tránh field rỗng gây lỗi parse.
      setDueDateString(getCurrentDateString())
    } else {
      setDueDateString("")
    }
  }

  async function handleSaveChanges() {
    if (!title.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề (Title).")
      return
    }

    setIsLoading(true)

    let finalDueDate = 0
    if (hasDueDate && dueDateString) {
      const parsedDate = new Date(dueDateString).getTime()
      if (!isNaN(parsedDate)) {
        finalDueDate = parsedDate
      }
    }

    const payload: any = {
      title,
      content,
      // Tạm khóa đổi ảnh để không phá dữ liệu cũ khi backend chưa mở API riêng.
      imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      dueDate: finalDueDate,
    }

    if (categoryId !== "") {
      payload.categoryId = categoryId
    }

    const response = await todoApi.updateTodo(todoData.id, payload)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      Alert.alert("Thành công", "Đã cập nhật công việc!")
      navigation.goBack()
    } else {
      Alert.alert("Lỗi", response.data?.message || "Không thể cập nhật lúc này.")
      console.log("Chi tiết lỗi:", response.problem, response.data)
    }
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenFill}
      contentContainerStyle={$screenContainer}
    >
      <AppSectionHeader title="Edit Todo" showRefresh={false} leftIcon="x" onLeftPress={() => navigation.goBack()} />

      <ScrollView
        style={$formContainer}
        contentContainerStyle={$formContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={$label}>Title *</Text>
        <TextInput
          style={$input}
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.palette.neutral400}
        />

        <Text style={$label}>Notes (optional)</Text>
        <TextInput
          style={[$input, $notesInput]}
          placeholder="Add any details..."
          multiline
          value={content}
          onChangeText={setContent}
          placeholderTextColor={colors.palette.neutral400}
          textAlignVertical="top"
        />

        <View style={$dueDateRow}>
          <Text style={$dueDateLabel}>Set due date</Text>
          <Switch
            value={hasDueDate}
            onValueChange={handleToggleDueDate}
            trackColor={{ false: colors.palette.neutral300, true: colors.palette.secondary400 }}
            thumbColor={colors.palette.neutral100}
          />
        </View>

        {hasDueDate && (
          <View style={$dueDateWrap}>
            <Text style={[$label, $labelNoTop]}>Due Date (YYYY-MM-DD)</Text>
            <TextInput
              style={$input}
              placeholder="2026-04-22"
              value={dueDateString}
              onChangeText={setDueDateString}
              placeholderTextColor={colors.palette.neutral400}
            />
          </View>
        )}

        <Text style={[$label, $labelSmallTop]}>Category</Text>
        <TouchableOpacity
          style={[$dropdownButton, isDropdownOpen && $dropdownButtonOpen]}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text style={[$dropdownText, !categoryId && $dropdownTextPlaceholder]}>
            {selectedCategoryName}
          </Text>
          <Feather
            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.palette.neutral500}
          />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={$dropdownList}>
            <TouchableOpacity
              style={[$dropdownItem, !categoryId && $dropdownItemActive]}
              onPress={() => {
                setCategoryId("")
                setSelectedCategoryName("No category")
                setIsDropdownOpen(false)
              }}
            >
              <Text style={$dropdownItemText}>No category</Text>
            </TouchableOpacity>

            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[$dropdownItem, categoryId === cat.id && $dropdownItemActive]}
                onPress={() => {
                  setCategoryId(cat.id)
                  setSelectedCategoryName(cat.name)
                  setIsDropdownOpen(false)
                }}
              >
                <Text style={$dropdownItemText}>{cat.name}</Text>
                {!cat.isPublic && <Feather name="lock" size={14} color={colors.palette.neutral400} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[$label, $labelLargeTop]}>Image</Text>
        <TouchableOpacity style={$imagePickerWrapper}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.palette.secondary400} />
          <Text style={$imagePickerText}>Image selected (tap to change)</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={$footerContainer}>
        <Button
          text={isLoading ? "Saving..." : "Save Changes"}
          disabled={isLoading}
          style={[$submitButton, isLoading && $disabledButton]}
          textStyle={$submitButtonText}
          onPress={handleSaveChanges}
        />
      </View>
    </Screen>
  )
}
