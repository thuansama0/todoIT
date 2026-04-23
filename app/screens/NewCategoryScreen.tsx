import { FC, useState } from "react"
import { View, Text, Switch, TextInput, Alert } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { AppSectionHeader, Screen, Button } from "app/components"
import { colors } from "app/theme"
import { useNavigation } from "@react-navigation/native"
import {
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
} from "./NewCategoryScreen.styles"
import { categoryApi } from "app/services/api/categoryApi"



interface NewCategoryScreenProps extends AppStackScreenProps<"NewCategory"> {}

export const NewCategoryScreen: FC<NewCategoryScreenProps> = () => {
  const navigation = useNavigation()
  const [name, setName] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  async function handleCreateCategory() {
    const finalName = name.trim()
    if (!finalName) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên danh mục.")
      return
    }

    setIsLoading(true)
    try {
      const response = await categoryApi.createCategory(finalName, isPublic)

      if (response.ok && response.data?.success) {
        Alert.alert("Thành công", "Đã tạo danh mục mới!")
        navigation.goBack()
      } else {
        const message =
          response.data?.message === "Category already exists"
            ? "Tên danh mục đã tồn tại."
            : response.data?.message || "Không thể tạo danh mục lúc này."
        Alert.alert("Lỗi", message)
        console.log("Chi tiết lỗi:", response.problem, response.data)
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.")
      console.log("Lỗi tạo category:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader title="New Category" showRefresh={false} leftIcon="x" onLeftPress={() => navigation.goBack()} />

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
          text={isLoading ? "Creating..." : "Create Category"} 
          disabled={isLoading}
          style={[$submitButton, isLoading && $disabledButton]} 
          textStyle={$submitButtonText}
          onPress={handleCreateCategory} 
        />

      </View>
    </Screen>
  )
}
