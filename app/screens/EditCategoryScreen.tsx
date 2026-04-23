import { FC, useState } from "react"
import {
  View,
  Text,
  Switch,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native"
import { AppSectionHeader, Screen, Button } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import { categoryApi, Category } from "app/services/api/categoryApi"
import {
  $deleteContainer,
  $deleteInnerCircle,
  $deleteOuterCircle,
  $disabledButton,
  $formContainer,
  $input,
  $label,
  $screenContainer,
  $submitButton,
  $submitButtonText,
  $switchRow,
  $switchSubText,
  $switchTextContainer,
  $switchTitle,
} from "./EditCategoryScreen.styles"

export const EditCategoryScreen: FC<any> = ({ route }) => {
  const navigation = useNavigation()

  const { categoryData } = route.params as { categoryData: Category }
  const [name, setName] = useState(categoryData.name)
  const [isPublic, setIsPublic] = useState(categoryData.isPublic)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSaveChanges() {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên danh mục.")
      return
    }

    setIsLoading(true)
    const response = await categoryApi.updateCategory(categoryData.id, name.trim(), isPublic)
    setIsLoading(false)

    if (response.ok && response.data?.success) {
      Alert.alert("Thành công", "Đã cập nhật danh mục!")
      navigation.goBack()
    } else {
      Alert.alert("Lỗi", response.data?.message || "Không thể cập nhật danh mục.")
    }
  }

  async function handleDelete() {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true)
          const response = await categoryApi.deleteCategory(categoryData.id)
          if (response.ok && response.data?.success) {
            navigation.goBack()
          } else {
            setIsLoading(false)
            Alert.alert("Lỗi", "Không thể xóa danh mục.")
          }
        },
      },
    ])
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader
        title="Edit Category"
        showRefresh={false}
        leftIcon="x"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={$formContainer}>
        <Text style={$label}>Category name *</Text>
        <TextInput
          style={$input}
          placeholder="e.g. Work, Shopping, Health"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.palette.neutral400}
        />

        <View style={$switchRow}>
          <View style={$switchTextContainer}>
            <Text style={$switchTitle}>Public category</Text>
            <Text style={$switchSubText}>
              {isPublic ? "Visible to all users" : "Only visible to you"}
            </Text>
          </View>

          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: colors.palette.neutral300, true: colors.palette.secondary400 }}
            thumbColor={colors.palette.neutral100}
          />
        </View>

        <Button
          text={isLoading ? "Saving..." : "Save Changes"}
          disabled={isLoading}
          style={[$submitButton, isLoading && $disabledButton]}
          textStyle={$submitButtonText}
          onPress={handleSaveChanges}
        />

        <View style={$deleteContainer}>
          <View style={$deleteOuterCircle}>
            <TouchableOpacity style={$deleteInnerCircle} onPress={handleDelete}>
              <Feather name="trash-2" size={24} color={colors.palette.neutral100} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  )
}

