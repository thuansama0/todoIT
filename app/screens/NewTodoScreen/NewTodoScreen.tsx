import { FC, useState, useEffect } from "react"
import { View, Switch, TouchableOpacity, ScrollView, Alert } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AppSectionHeader, Screen, Button, Text, TextField } from "app/components"
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
  $dropdownList,
  $dropdownText,
  $dropdownTextPlaceholder,
  $dueDateRow,
  $dueDateWrap,
  $reminderChip,
  $reminderChipActive,
  $reminderChipTextActive,
  $reminderRow,
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
  const [imageUrl] = useState("https://res.cloudinary.com/demo/image/upload/sample.jpg")
  const [isLoading, setIsLoading] = useState(false)

  const [hasDueDate, setHasDueDate] = useState(false)
  const [dueDateString, setDueDateString] = useState("")
  const [reminderMinutes, setReminderMinutes] = useState(0)

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
    const hh = String(today.getHours()).padStart(2, "0")
    const min = String(today.getMinutes()).padStart(2, "0")
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`
  }

  const parseDateTime = (value: string) => {
    const [datePart, timePart] = value.trim().split(" ")
    if (!datePart || !timePart) return NaN
    const [yyyy, mm, dd] = datePart.split("-").map(Number)
    const [hh, min] = timePart.split(":").map(Number)
    if (!yyyy || !mm || !dd || hh === undefined || min === undefined) return NaN
    return new Date(yyyy, mm - 1, dd, hh, min, 0, 0).getTime()
  }

  const handleToggleDueDate = (value: boolean) => {
    setHasDueDate(value)
    if (value) {
      // Chọn sẵn thời điểm hiện tại để người dùng chỉ cần chỉnh phần khác.
      setDueDateString(getCurrentDateString())
    } else {
      setDueDateString("")
      setReminderMinutes(0)
    }
  }

  async function handleCreateTodo() {
    if (!title.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tiêu đề (Title) cho công việc.")
      return
    }

    if (!categoryId) {
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

    const payload = {
      title,
      content,
      // BE vẫn bắt buộc imageUrl, nên giữ ảnh mặc định cho tới khi có upload thật.
      imageUrl,
      dueDate: finalDueDate,
      categoryId,
    }

    const response = todoStore.createTodo(payload, reminderMinutes)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      navigation.goBack()
    } else {
      Alert.alert("Lỗi", response.data?.message || "Không thể tạo Todo lúc này.")
    }
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenFill}
      contentContainerStyle={$screenContainer}
    >
      <AppSectionHeader
        title="New Todo"
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
                    style={[
                      reminderMinutes === minute && $reminderChipTextActive,
                    ]}
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
