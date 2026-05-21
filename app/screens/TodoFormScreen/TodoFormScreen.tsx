import { FC, useEffect, useState } from "react"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import { AppSectionHeader, Button, Screen, Text, TextField, Toggle } from "app/components"
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import type { AppStackParamList } from "app/navigators"
import { CreateTodoPayload } from "app/services/api/todoApi"
import {
  formatDueDateFromTimestamp,
  getCurrentDateString,
  parseDateTime,
} from "app/utils/formatDate"
import { DEFAULT_TODO_IMAGE_URL } from "app/config/media"
import { translate } from "app/i18n"
import { TODO_REMINDER_MINUTE_OPTIONS } from "app/constants/todo"
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

export type TodoFormMode = "create" | "edit"

export type TodoFormScreenProps =
  | { mode: "create"; navigation: NativeStackNavigationProp<AppStackParamList, "NewTodo"> }
  | {
      mode: "edit"
      initialTodo: AppStackParamList["EditTodo"]["todoData"]
      navigation: NativeStackNavigationProp<AppStackParamList, "EditTodo">
    }

export const TodoFormScreen: FC<TodoFormScreenProps> = observer(function TodoFormScreen(props) {
  const { navigation } = props
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
    props.mode === "edit"
      ? props.initialTodo.category?.name || translate("common.noCategory")
      : translate("common.noCategory"),
  )

  useEffect(() => {
    // Bảo đảm dropdown luôn có dữ liệu mà không tạo thêm request nếu store đã có sẵn.
    categoryStore.loadIfNeeded()
  }, [categoryStore])

  const handleToggleDueDate = (value: boolean) => {
    setHasDueDate(value)
    if (value) {
      // Prefill để giảm thao tác nhập tay khi người dùng chỉ muốn chỉnh nhẹ thời gian.
      setDueDateString(getCurrentDateString())
    } else {
      setDueDateString("")
      // Tránh lưu reminder "mồ côi" khi todo không còn due date.
      setReminderMinutes(0)
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert(
        translate("common.missingInfo"),
        props.mode === "create"
          ? translate("todoFormScreen.missingTitleCreate")
          : translate("todoFormScreen.missingTitleEdit"),
      )
      return
    }

    if (props.mode === "create" && !categoryId) {
      // Bắt buộc chọn category lúc tạo mới để hỗ trợ phân nhóm/filter ngay từ đầu.
      Alert.alert(translate("common.missingInfo"), translate("todoFormScreen.missingCategory"))
      return
    }

    setIsLoading(true)

    // Dùng 0 làm sentinel nhất quán cho trạng thái "không đặt hạn".
    let finalDueDate = 0
    if (hasDueDate && dueDateString) {
      const parsedDate = parseDateTime(dueDateString)
      if (!isNaN(parsedDate)) {
        finalDueDate = parsedDate
      } else {
        Alert.alert(translate("common.error"), translate("todoFormScreen.invalidDateFormat"))
        setIsLoading(false)
        return
      }
    }

    const payload: CreateTodoPayload = {
      title,
      content,
      // Giữ contract backend ổn định trước khi hoàn thiện luồng upload/chọn ảnh thật.
      imageUrl: DEFAULT_TODO_IMAGE_URL,
      dueDate: finalDueDate,
      categoryId,
    }

    if (props.mode === "create") {
      const response = await todoStore.createTodo(payload, reminderMinutes)
      setIsLoading(false)
      if (response.ok && response.data?.success) {
        navigation.goBack()
      } else {
        Alert.alert(
          translate("common.error"),
          response.data?.message || translate("todoFormScreen.createFailed"),
        )
      }
      return
    }

    const response = await todoStore.updateTodo(props.initialTodo.id, payload, reminderMinutes)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      Alert.alert(translate("common.success"), translate("todoFormScreen.updateSuccess"))
      navigation.goBack()
    } else {
      Alert.alert(
        translate("common.error"),
        response.data?.message || translate("todoFormScreen.updateFailed"),
      )
    }
  }
  //
  const headerTitle =
    props.mode === "create"
      ? translate("todoFormScreen.newTitle")
      : translate("todoFormScreen.editTitle")
  const submitLabel =
    props.mode === "create"
      ? isLoading
        ? translate("todoFormScreen.creating")
        : translate("todoFormScreen.create")
      : isLoading
      ? translate("todoFormScreen.saving")
      : translate("todoFormScreen.save")

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
        <TextField
          labelTx="todoFormScreen.titleLabel"
          LabelTextProps={{ preset: "formLabel", style: $label }}
          placeholderTx="todoFormScreen.titlePlaceholder"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.palette.neutral400}
        />

        <TextField
          labelTx="todoFormScreen.notesLabel"
          LabelTextProps={{ preset: "formLabel", style: $label }}
          placeholderTx="todoFormScreen.notesPlaceholder"
          multiline
          value={content}
          onChangeText={setContent}
          placeholderTextColor={colors.palette.neutral400}
          inputWrapperStyle={$notesInput}
        />

        <View style={$dueDateRow}>
          <Text preset="formLabel" tx="todoFormScreen.setDueDate" />
          <Toggle variant="switch" value={hasDueDate} onValueChange={handleToggleDueDate} />
        </View>

        {hasDueDate && (
          <View style={$dueDateWrap}>
            <TextField
              labelTx="todoFormScreen.dueDateLabel"
              LabelTextProps={{ preset: "formLabel", style: [$label, $labelNoTop] }}
              placeholderTx="todoFormScreen.dueDatePlaceholder"
              value={dueDateString}
              onChangeText={setDueDateString}
              placeholderTextColor={colors.palette.neutral400}
            />

            {/* Chip sync với TODO_REMINDER_MINUTE_OPTIONS + backend reminderMinutes */}
            <Text style={$label} preset="formLabel" tx="todoFormScreen.reminderLabel" />
            <View style={$reminderRow}>
              {TODO_REMINDER_MINUTE_OPTIONS.map(
                (minute: (typeof TODO_REMINDER_MINUTE_OPTIONS)[number]) => (
                  <TouchableOpacity
                    key={minute}
                    style={[$reminderChip, reminderMinutes === minute && $reminderChipActive]}
                    onPress={() => setReminderMinutes(minute)}
                  >
                    <Text
                      preset="caption"
                      style={reminderMinutes === minute && $reminderChipTextActive}
                    >
                      {minute === 0
                        ? translate("todoFormScreen.reminderOff")
                        : minute >= 60
                        ? translate("todoFormScreen.reminderOneHour")
                        : translate("todoFormScreen.reminderMinutes", { minutes: minute })}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          </View>
        )}

        <Text
          style={[$label, $labelSmallTop]}
          preset="formLabel"
          tx={
            props.mode === "create"
              ? "todoFormScreen.categoryLabelCreate"
              : "todoFormScreen.categoryLabelEdit"
          }
        />
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
                  setSelectedCategoryName(translate("common.noCategory"))
                  setIsDropdownOpen(false)
                }}
              >
                <Text preset="body" tx="common.noCategory" />
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

        <Text style={[$label, $labelLargeTop]} preset="formLabel" tx="todoFormScreen.imageLabel" />
        <TouchableOpacity style={$imagePickerWrapper}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.palette.primary700} />
          <Text style={$imagePickerText} preset="caption" tx="todoFormScreen.imageSelected" />
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
