import { FC } from "react"
import { TouchableOpacity, View, ActivityIndicator, Alert } from "react-native"
import { AppSectionHeader, Screen, ListView } from "app/components"
import { CategoryItem } from "app/components/CategoryItem"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import { Feather } from "@expo/vector-icons"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import type { CompositeScreenProps } from "@react-navigation/native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"

import {
  $fab,
  $flatListContent,
  $list,
  $loadingSpinner,
  $screenFill,
  $screenInner,
} from "./CategoriesScreen.styles"
import { useStores } from "app/models"
import type { AppStackParamList } from "app/navigators"
import type { TabParamList } from "app/navigators/TabNavigator"

type CategoriesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Categories">,
  NativeStackScreenProps<AppStackParamList>
>

export const CategoriesScreen: FC<CategoriesScreenProps> = observer(function CategoriesScreen({
  navigation,
}) {
  const { categoryStore } = useStores()

  function handleDelete(id: string) {
    Alert.alert("Xác nhận", "Xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const response = await categoryStore.deleteCategory(id)
          if (!response.ok || !response.data?.success) {
            Alert.alert("Lỗi", "Không thể xóa danh mục.")
          }
        },
      },
    ])
  }

  function renderCategoriesList() {
    if (categoryStore.isLoading) {
      return (
        <View>
          <ActivityIndicator
            size="large"
            color={colors.palette.primary700}
            style={$loadingSpinner}
          />
        </View>
      )
    }

    return (
      <View style={$list}>
        <ListView
          data={categoryStore.sortedItems}
          keyExtractor={(item) => item.id}
          estimatedItemSize={56}
          refreshing={categoryStore.isLoading}
          onRefresh={() => categoryStore.fetchCategories()}
          contentContainerStyle={$flatListContent}
          renderItem={({ item }) => (
            <CategoryItem
              name={item.name}
              isPublic={item.isPublic}
              isOwner={item.isOwner}
              onEdit={() => {
                navigation.navigate("EditCategory", { categoryData: item })
              }}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      </View>
    )
  }

  function renderAddButton() {
    return (
      <TouchableOpacity style={$fab} onPress={() => navigation.navigate("NewCategory")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    )
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenFill}
      contentContainerStyle={$screenInner}
    >
      <AppSectionHeader title="Categories" onRefresh={() => categoryStore.fetchCategories()} />
      {renderCategoriesList()}
      {renderAddButton()}
    </Screen>
  )
})
