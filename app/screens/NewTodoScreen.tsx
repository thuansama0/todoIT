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
import { AppStackScreenProps } from "../navigators"
import { AppSectionHeader, Screen, Button } from "app/components"
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"

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
} from "./NewTodoScreen.styles"

interface NewTodoScreenProps extends AppStackScreenProps<"NewTodo"> {}

export const NewTodoScreen: FC<NewTodoScreenProps> = observer(function NewTodoScreen() {
  const navigation = useNavigation()
  const { todoStore, categoryStore } = useStores()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageUrl] = useState(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  )
  const [isLoading, setIsLoading] = useState(false)

  const [hasDueDate, setHasDueDate] = useState(false)
  const [dueDateString, setDueDateString] = useState("")

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [categoryId, setCategoryId] = useState("")
  const [selectedCategoryName, setSelectedCategoryName] = useState("No category")

  useEffect(() => {
    categoryStore.loadIfNeeded()
  }, [categoryStore])

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
      // Điền ngày hiện tại làm mốc để giảm thao tác nhập tay.
      setDueDateString(getCurrentDateString())
    } else {
      setDueDateString("")
    }
  }

  async function handleCreateTodo() {
    if (!title.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề (Title) cho công việc.")
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

    const payload = {
      title,
      content,
      // Giữ contract backend ổn định cho tới khi có luồng upload ảnh thật.
      imageUrl,
      dueDate: finalDueDate,
      categoryId,
    }

    const response = await todoStore.createTodo(payload)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      Alert.alert("Thành công", "Đã tạo công việc mới!")
      navigation.goBack()
    } else {
      Alert.alert("Lỗi", response.data?.message || "Không thể tạo Todo lúc này.")
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
      <AppSectionHeader title="New Todo" showRefresh={false} leftIcon="x" onLeftPress={() => navigation.goBack()} />

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

            {categoryStore.sortedItems.map((cat) => (
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
          text={isLoading ? "Creating..." : "Create Todo"}
          disabled={isLoading}
          style={[$submitButton, isLoading && $disabledButton]}
          textStyle={$submitButtonText}
          onPress={handleCreateTodo}
        />
      </View>
    </Screen>
  )
})

