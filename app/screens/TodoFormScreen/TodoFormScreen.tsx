import { FC, useEffect, useState } from "react"
import { Alert, ScrollView, Switch, TouchableOpacity, View } from "react-native"
import { AppSectionHeader, Button, Screen, Text, TextField } from "app/components"
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import type { AppStackParamList } from "app/navigators"
import { CreateTodoPayload } from "app/services/api/todoApi"

import {
  $disabledButton,
  $dropdownButton,
  $dropdownButtonOpen,
  $dropdownItem,
  $dropdownItemActive,
  $dropdownList,
  $dropdownText,
  $dropdownTextPlaceholder,
  $dueDateRow,
  $dueDateWrap,
  $footerContainer,
  $formContainer,
  $formContent,
  $imagePickerText,
  $imagePickerWrapper,
  $label,
  $labelLargeTop,
  $labelNoTop,
  $labelSmallTop,
  $notesInput,
  $reminderChip,
  $reminderChipActive,
  $reminderChipTextActive,
  $reminderRow,
  $screenContainer,
  $screenFill,
  $submitButton,
  $submitButtonText,
} from "./TodoFormScreen.styles"

const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/demo/image/upload/sample.jpg"

export type TodoFormMode = "create" | "edit"

export type TodoFormScreenProps =
  | { mode: "create" }
  | { mode: "edit"; initialTodo: AppStackParamList["EditTodo"]["todoData"] }

function formatDueDateFromTimestamp(timestamp: number): string {
  if (!timestamp || timestamp === 0) return ""
  const date = new Date(timestamp)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

function getCurrentDateString(): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const hh = String(today.getHours()).padStart(2, "0")
  const min = String(today.getMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

function parseDateTime(value: string): number {
  const [datePart, timePart] = value.trim().split(" ")
  if (!datePart || !timePart) return NaN
  const [yyyy, mm, dd] = datePart.split("-").map(Number)
  const [hh, min] = timePart.split(":").map(Number)
  if (!yyyy || !mm || !dd || hh === undefined || min === undefined) return NaN
  return new Date(yyyy, mm - 1, dd, hh, min, 0, 0).getTime()
}

export const TodoFormScreen: FC<TodoFormScreenProps> = observer(function TodoFormScreen(props) {
  const navigation = useNavigation()
  const { todoStore, categoryStore } = useStores()

  const [title, setTitle] = useState(() =>
    props.mode === "edit" ? props.initialTodo.title || "" : "",
  )
  const [content, setContent] = useState(() =>
    props.mode === "edit" ? props.initialTodo.content || "" : "",
  )
  const [isLoading, setIsLoading] = useState(false)

  const [hasDueDate, setHasDueDate] = useState(() =>
    props.mode === "edit" ? !!props.initialTodo.dueDate && props.initialTodo.dueDate > 0 : false,
  )
  const [dueDateString, setDueDateString] = useState(() =>
    props.mode === "edit" ? formatDueDateFromTimestamp(props.initialTodo.dueDate) : "",
  )
  const [reminderMinutes, setReminderMinutes] = useState(() =>
    props.mode === "edit" ? props.initialTodo.reminderMinutes ?? 0 : 0,
  )

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [categoryId, setCategoryId] = useState(() =>
    props.mode === "edit" ? props.initialTodo.category?.id || "" : "",
  )
  const [selectedCategoryName, setSelectedCategoryName] = useState(() =>
    props.mode === "edit" ? props.initialTodo.category?.name || "No category" : "No category",
  )

  useEffect(() => {
    categoryStore.loadIfNeeded()
  }, [categoryStore])

  const handleToggleDueDate = (value: boolean) => {
    setHasDueDate(value)
    if (value) {
      setDueDateString(getCurrentDateString())
    } else {
      setDueDateString("")
      setReminderMinutes(0)
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert(
        "Thiếu thông tin",
        props.mode === "create"
          ? "Vui lòng nhập tiêu đề (Title) cho công việc."
          : "Vui lòng nhập tiêu đề (Title).",
      )
      return
    }

    if (props.mode === "create" && !categoryId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn danh mục cho công việc.")
      return
    }

    setIsLoading(true)

    let finalDueDate = 0
    if (hasDueDate && dueDateString) {
      const parsedDate = parseDateTime(dueDateString)
      if (!isNaN(parsedDate)) {
        finalDueDate = parsedDate
      } else {
        Alert.alert("Sai định dạng", "Vui lòng nhập đúng dạng YYYY-MM-DD HH:mm.")
        setIsLoading(false)
        return
      }
    }

    const payload: CreateTodoPayload = {
      title,
      content,
      imageUrl: DEFAULT_IMAGE_URL,
      dueDate: finalDueDate,
      categoryId,
    }

    if (props.mode === "create") {
      const response = todoStore.createTodo(payload, reminderMinutes)
      setIsLoading(false)
      if (response.ok && response.data?.success) {
        navigation.goBack()
      } else {
        Alert.alert("Lỗi", response.data?.message || "Không thể tạo Todo lúc này.")
      }
      return
    }

    const response = await todoStore.updateTodo(props.initialTodo.id, payload, reminderMinutes)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      Alert.alert("Thành công", "Đã cập nhật công việc!")
      navigation.goBack()
    } else {
      Alert.alert("Lỗi", response.data?.message || "Không thể cập nhật lúc này.")
    }
  }

  const headerTitle = props.mode === "create" ? "New Todo" : "Edit Todo"
  const submitLabel =
    props.mode === "create"
      ? isLoading
        ? "Creating..."
        : "Create Todo"
      : isLoading
        ? "Saving..."
        : "Save Changes"

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenFill}
      contentContainerStyle={$screenContainer}
    >
      <AppSectionHeader
        title={headerTitle}
        showRefresh={false}
        leftIcon="x"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={$formContainer}
        contentContainerStyle={$formContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={$label} preset="formLabel">
          Title *
        </Text>
        <TextField
          label="Title *"
          LabelTextProps={{ preset: "formLabel", style: $label }}
          placeholder="What needs to be done?"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.palette.neutral400}
        />

        <TextField
          label="Notes (optional)"
          LabelTextProps={{ preset: "formLabel", style: $label }}
          placeholder="Add any details..."
          multiline
          value={content}
          onChangeText={setContent}
          placeholderTextColor={colors.palette.neutral400}
          inputWrapperStyle={$notesInput}
        />

        <View style={$dueDateRow}>
          <Text preset="formLabel">Set due date</Text>
          <Switch
            value={hasDueDate}
            onValueChange={handleToggleDueDate}
            trackColor={{ false: colors.palette.neutral300, true: colors.palette.secondary400 }}
            thumbColor={colors.palette.neutral100}
          />
        </View>

        {hasDueDate && (
          <View style={$dueDateWrap}>
            <TextField
              label="Due Date (YYYY-MM-DD HH:mm)"
              LabelTextProps={{ preset: "formLabel", style: [$label, $labelNoTop] }}
              placeholder="2026-04-22 14:30"
              value={dueDateString}
              onChangeText={setDueDateString}
              placeholderTextColor={colors.palette.neutral400}
            />

            <Text style={$label} preset="formLabel">
              Remind before
            </Text>
            <View style={$reminderRow}>
              {[0, 5, 15, 30, 60].map((minute) => (
                <TouchableOpacity
                  key={minute}
                  style={[$reminderChip, reminderMinutes === minute && $reminderChipActive]}
                  onPress={() => setReminderMinutes(minute)}
                >
                  <Text
                    preset="caption"
                    style={[reminderMinutes === minute && $reminderChipTextActive]}
                  >
                    {minute === 0 ? "Off" : minute >= 60 ? "1h" : `${minute}m`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Text style={[$label, $labelSmallTop]} preset="formLabel">
          Category
        </Text>
        <TouchableOpacity
          style={[$dropdownButton, isDropdownOpen && $dropdownButtonOpen]}
          onPress={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Text preset="body" style={[$dropdownText, !categoryId && $dropdownTextPlaceholder]}>
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
            {props.mode === "edit" && (
              <TouchableOpacity
                style={[$dropdownItem, !categoryId && $dropdownItemActive]}
                onPress={() => {
                  setCategoryId("")
                  setSelectedCategoryName("No category")
                  setIsDropdownOpen(false)
                }}
              >
                <Text preset="body">No category</Text>
              </TouchableOpacity>
            )}

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
                <Text preset="body">{cat.name}</Text>
                {!cat.isPublic && (
                  <Feather name="lock" size={14} color={colors.palette.neutral400} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={[$label, $labelLargeTop]} preset="formLabel">
          Image
        </Text>
        <TouchableOpacity style={$imagePickerWrapper}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.palette.secondary400} />
          <Text style={$imagePickerText} preset="caption">
            Image selected (tap to change)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={$footerContainer}>
        <Button
          text={submitLabel}
          disabled={isLoading}
          style={[$submitButton, isLoading && $disabledButton]}
          textStyle={$submitButtonText}
          onPress={handleSubmit}
        />
      </View>
    </Screen>
  )
})
