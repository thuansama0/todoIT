import { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, Alert, TouchableOpacity } from "react-native"
import { AppSectionHeader, Screen, Button, Text, TextField, Toggle } from "app/components"
import { colors } from "app/theme"
import { Feather } from "@expo/vector-icons"
import { useStores } from "app/models"
import type { AppStackScreenProps } from "app/navigators"
import { translate } from "app/i18n"
import { Category } from "app/services/api/categoryApi"
import {
  $deleteContainer,
  $deleteInnerCircle,
  $deleteOuterCircle,
  $disabledButton,
  $formContainer,
  $label,
  $screenContainer,
  $submitButton,
  $submitButtonText,
  $switchRow,
  $switchTextContainer,
  $switchTitle,
} from "./EditCategoryScreen.styles"

type EditCategoryScreenProps = AppStackScreenProps<"EditCategory">

export const EditCategoryScreen: FC<EditCategoryScreenProps> = observer(
  function EditCategoryScreen({ route, navigation }) {
    const { categoryStore } = useStores()

    const { categoryData } = route.params as { categoryData: Category }
    const [name, setName] = useState(categoryData.name)
    const [isPublic, setIsPublic] = useState(categoryData.isPublic)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSaveChanges() {
      if (!name.trim()) {
        Alert.alert(translate("common.missingInfo"), translate("editCategoryScreen.missingName"))
        return
      }

      setIsLoading(true)
      const response = await categoryStore.updateCategory(categoryData.id, name.trim(), isPublic)
      setIsLoading(false)

      if (response.ok && response.data?.success) {
        Alert.alert(translate("common.success"), translate("editCategoryScreen.updateSuccess"))
        navigation.goBack()
      } else {
        Alert.alert(
          translate("common.error"),
          response.data?.message || translate("editCategoryScreen.updateFailed"),
        )
      }
    }

    async function handleDelete() {
      Alert.alert(translate("common.confirm"), translate("editCategoryScreen.deleteConfirm"), [
        { text: translate("common.cancel"), style: "cancel" },
        {
          text: translate("common.delete"),
          style: "destructive",
          onPress: async () => {
            setIsLoading(true)
            const response = await categoryStore.deleteCategory(categoryData.id)
            if (response.ok && response.data?.success) {
              navigation.goBack()
            } else {
              setIsLoading(false)
              Alert.alert(translate("common.error"), translate("editCategoryScreen.deleteFailed"))
            }
          },
        },
      ])
    }

    return (
      <Screen preset="scroll" safeAreaEdges={["top"]} style={$screenContainer}>
        <AppSectionHeader
          title={translate("editCategoryScreen.title")}
          showRefresh={false}
          leftIcon="x"
          onLeftPress={() => navigation.goBack()}
        />

        <View style={$formContainer}>
          <TextField
            labelTx="editCategoryScreen.nameLabel"
            LabelTextProps={{ preset: "formLabel", style: $label }}
            placeholderTx="editCategoryScreen.namePlaceholder"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.palette.neutral400}
          />

          <View style={$switchRow}>
            <View style={$switchTextContainer}>
              <Text style={$switchTitle} preset="body" tx="editCategoryScreen.publicLabel" />
              <Text
                preset="caption"
                tx={
                  isPublic
                    ? "editCategoryScreen.publicHintPublic"
                    : "editCategoryScreen.publicHintPrivate"
                }
              />
            </View>

            <Toggle variant="switch" value={isPublic} onValueChange={setIsPublic} />
          </View>

          <Button
            text={
              isLoading
                ? translate("editCategoryScreen.saving")
                : translate("editCategoryScreen.save")
            }
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
  },
)
