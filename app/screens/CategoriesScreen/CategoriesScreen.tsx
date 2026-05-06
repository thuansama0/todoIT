import { FC, useEffect } from "react"
import {
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native"
import { AppSectionHeader, Screen, ListView } from "app/components"
import { CategoryItem } from "app/components/CategoryItem"
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"

export const CategoriesScreen: FC = observer(function CategoriesScreen() {
  type AppStackNavigatorProps = NativeStackNavigationProp<AppStackParamList>
  const navigation = useNavigation<AppStackNavigatorProps>()
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
      <AppSectionHeader title="Categories" onRefresh={() => categoryStore.fetchCategories()} />

      {categoryStore.isLoading ? (
        <View>
          <ActivityIndicator size="large" color={colors.palette.secondary400} style={$loadingSpinner} />
        </View>
      ) : (
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
      )}

      <TouchableOpacity style={$fab} onPress={() => navigation.navigate("NewCategory")}>
        <Feather name="plus" size={24} color={colors.palette.neutral100} />
      </TouchableOpacity>
    </Screen>
  )
})
