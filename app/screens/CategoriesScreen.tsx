import { FC, useEffect } from "react"
import {
  FlatList,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native"
import { AppSectionHeader, Screen } from "app/components"
import { CategoryItem } from "../components/CategoryItem"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

import {
  $fab,
  $flatListContent,
  $list,
  $loadingSpinner,
  $screenFill,
  $screenInner,
} from "./CategoriesScreen.styles"
import { useStores } from "app/models"


export const CategoriesScreen: FC = observer(function CategoriesScreen() {
  const navigation = useNavigation()
  const { categoryStore } = useStores()

  useEffect(() => {
    categoryStore.loadIfNeeded()
  }, [categoryStore])

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
        }
      },
    ])
  }

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top"]}
      style={$screenFill}
      contentContainerStyle={$screenInner}
    >
      {/* 1. Header ĐÃ ĐƯỢC CHỈNH LẠI GIỐNG TRANG TODO */}
      <AppSectionHeader title="Categories" onRefresh={() => categoryStore.fetchCategories()} />

      {/* 2. Danh sách (FlatList) */}
      {categoryStore.isLoading ? (
        <View>
          <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
        </View>
      ) : (
        <FlatList
          style={$list}
          data={categoryStore.sortedItems}
          keyExtractor={(item) => item.id}
          refreshing={categoryStore.isLoading}
          onRefresh={() => categoryStore.fetchCategories()}
          contentContainerStyle={$flatListContent}
          renderItem={({ item }) => (
            <CategoryItem
              name={item.name}
              isPublic={item.isPublic}
              isOwner={item.isOwner}
              onEdit={() => {
                ;(navigation.navigate as any)("EditCategory", { categoryData: item })
              }}
              onDelete={() => handleDelete(item.id)}
            />
          )}
        />
      )}

      {/* 3. Nút Thêm nổi (FAB) */}
      <TouchableOpacity style={$fab} onPress={() => (navigation.navigate as any)("NewCategory")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    </Screen>
  )
})
