import { FC, useEffect, useState } from "react"
import {
  FlatList,
  TouchableOpacity,
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
import { categoryApi, Category } from "app/services/api/categoryApi"


export const CategoriesScreen: FC = observer(function CategoriesScreen() {
  const navigation = useNavigation()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setIsLoading(true)
    // #region agent log
    fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "local-category", hypothesisId: "H6", location: "CategoriesScreen.tsx:fetch:start", message: "fetch categories started", data: { isLoadingBefore: isLoading, itemsCountBefore: categories.length }, timestamp: Date.now() }) }).catch(() => {})
    // #endregion
    try {
      const response = await categoryApi.getCategories()
      // #region agent log
      fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "local-category", hypothesisId: "H6", location: "CategoriesScreen.tsx:fetch:response", message: "fetch categories response", data: { ok: response?.ok ?? false, problem: response?.problem ?? null, success: response?.data?.success ?? null, itemsCount: response?.data?.data?.items?.length ?? 0 }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
      if (response.ok && response.data?.success) {
        setCategories(response.data.data?.items || [])
      } else {
        Alert.alert("Lỗi", response.data?.message || "Không thể tải danh mục.")
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh mục.")
      console.log("Lỗi tải danh mục:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleDelete(id: string) {
    Alert.alert("Xác nhận", "Xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          const backup = [...categories]
          setCategories(categories.filter((c) => c.id !== id))
          const response = await categoryApi.deleteCategory(id)
          if (!response.ok || !response.data?.success) {
            setCategories(backup)
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
      <AppSectionHeader title="Categories" onRefresh={fetchCategories} />

      {/* 2. Danh sách (FlatList) */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
      ) : (
        <FlatList
          style={$list}
          data={categories}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={fetchCategories}
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
