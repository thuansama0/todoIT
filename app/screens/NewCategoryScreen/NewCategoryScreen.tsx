import { FC, useState } from "react"
import { View, Alert } from "react-native"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { AppSectionHeader, Screen, Button, Text, TextField, Toggle } from "app/components"
import { colors } from "app/theme"
import { useStores } from "app/models"
import { translate } from "app/i18n"
import {
  $disabledButton,
  $formContainer,
  $label,
  $screenContainer,
  $submitButton,
  $submitButtonText,
  $switchRow,
  $switchTextContainer,
  $switchTitle,
} from "./NewCategoryScreen.styles"

interface NewCategoryScreenProps extends AppStackScreenProps<"NewCategory"> {}

export const NewCategoryScreen: FC<NewCategoryScreenProps> = observer(function NewCategoryScreen({
  navigation,
}) {
  const { categoryStore } = useStores()
  const [name, setName] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleCreateCategory() {
    const finalName = name.trim()
    if (!finalName) {
      Alert.alert(translate("common.missingInfo"), translate("newCategoryScreen.missingName"))
      return
    }

    setIsLoading(true)
    try {
      const response = await categoryStore.createCategory(finalName, isPublic)

      if (response.ok && response.data?.success) {
        Alert.alert(translate("common.success"), translate("newCategoryScreen.createSuccess"))
        navigation.goBack()
      } else {
        const message =
          response.data?.message === "Category already exists"
            ? translate("newCategoryScreen.nameExists")
            : response.data?.message || translate("newCategoryScreen.createFailed")
        Alert.alert(translate("common.error"), message)
      }
    } catch {
      Alert.alert(translate("common.error"), translate("common.tryAgainLater"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
      <AppSectionHeader
        title={translate("newCategoryScreen.title")}
        showRefresh={false}
        leftIcon="x"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={$formContainer}>
        <TextField
          labelTx="newCategoryScreen.nameLabel"
          LabelTextProps={{ preset: "formLabel", style: $label }}
          placeholderTx="newCategoryScreen.namePlaceholder"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.palette.neutral400}
        />

        <View style={$switchRow}>
          <View style={$switchTextContainer}>
            <Text style={$switchTitle} preset="body" tx="newCategoryScreen.publicLabel" />
            <Text
              preset="caption"
              tx={isPublic ? "newCategoryScreen.publicHintPublic" : "newCategoryScreen.publicHintPrivate"}
            />
          </View>

          <Toggle variant="switch" value={isPublic} onValueChange={setIsPublic} />
        </View>

        <Button
          text={
            isLoading
              ? translate("newCategoryScreen.creating")
              : translate("newCategoryScreen.create")
          }
          disabled={isLoading}
          style={[$submitButton, isLoading && $disabledButton]}
          textStyle={$submitButtonText}
          onPress={handleCreateCategory}
        />
      </View>
    </Screen>
  )
})
