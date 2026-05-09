import { cast, Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { Category, categoryApi } from "app/services/api/categoryApi"
import { withSetPropAction } from "./helpers/withSetPropAction"

const CategoryModel = types.model("Category", {
  id: types.identifier,
  name: types.string,
  isPublic: types.boolean,
  isOwner: types.boolean,
})

export const CategoryStoreModel = types
  .model("CategoryStore")
  .props({
    items: types.optional(types.array(CategoryModel), []),
    isLoading: types.optional(types.boolean, false),
    isLoaded: types.optional(types.boolean, false),
  })
  .views((store) => ({
    get sortedItems() {
      // Sort ở layer store để mọi màn dùng chung một thứ tự ổn định, tránh mỗi nơi tự sort khác nhau.
      return store.items.slice().sort((a, b) => a.name.localeCompare(b.name))
    },
  }))
  .actions(withSetPropAction)
  .actions((store) => {
    const normalizeCategory = (input: Partial<Category> & { id: string }) => ({
      id: input.id,
      name: input.name ?? "",
      isPublic: input.isPublic ?? false,
      isOwner: input.isOwner ?? true,
    })

    const fetchCategories = flow(function* fetchCategories() {
      store.isLoading = true
      try {
        const response = yield categoryApi.getCategories()
        if (response.ok && response.data?.success) {
          store.items.replace((response.data.data?.items ?? []).map(normalizeCategory))
          store.isLoaded = true
        }
        return response
      } finally {
        store.isLoading = false
      }
    })

    const loadIfNeeded = flow(function* loadIfNeeded() {
      // Chặn request lặp lại khi nhiều màn mở gần nhau hoặc re-render liên tiếp.
      if (store.isLoaded || store.isLoading) return
      yield fetchCategories()
    })

    const createCategory = flow(function* createCategory(name: string, isPublic: boolean) {
      const normalizedName = name.trim()
      const tempId = `temp-${Date.now()}`
      // Optimistic insert để danh sách phản hồi ngay thay vì chờ round-trip network.
      store.items.unshift(
        cast(
          normalizeCategory({
          id: tempId,
          name: normalizedName,
          isPublic,
          isOwner: true,
          }),
        ),
      )

      const response = yield categoryApi.createCategory(name.trim(), isPublic)
      if (response.ok && response.data?.success) {
        // Refetch để đồng bộ metadata do server quyết định (id thật, quyền, thứ tự...).
        yield fetchCategories()
      } else {
        store.items.replace(store.items.filter((category) => category.id !== tempId))
      }
      return response
    })

    const updateCategory = flow(function* updateCategory(id: string, name: string, isPublic: boolean) {
      const idx = store.items.findIndex((x) => x.id === id)
      const backup =
        idx >= 0
          ? {
              id: store.items[idx].id,
              name: store.items[idx].name,
              isPublic: store.items[idx].isPublic,
              isOwner: store.items[idx].isOwner,
            }
          : null
      if (idx >= 0) {
        store.items[idx] = cast(normalizeCategory({ ...store.items[idx], name: name.trim(), isPublic }))
      }

      const response = yield categoryApi.updateCategory(id, name.trim(), isPublic)
      if (!response.ok || !response.data?.success) {
        if (idx >= 0 && backup) {
          store.items[idx] = cast(backup)
        }
      } else if (idx < 0) {
        yield fetchCategories()
      }
      return response
    })

    const deleteCategory = flow(function* deleteCategory(id: string) {
      const response = yield categoryApi.deleteCategory(id)
      if (response.ok && response.data?.success) {
        store.items.replace(store.items.filter((x) => x.id !== id))
      }
      return response
    })

    const resetForAuthChange = () => {
      store.items.clear()
      store.isLoaded = false
      store.isLoading = false
    }

    return { fetchCategories, loadIfNeeded, createCategory, updateCategory, deleteCategory, resetForAuthChange }
  })

export interface CategoryStore extends Instance<typeof CategoryStoreModel> {}
export interface CategoryStoreSnapshot extends SnapshotOut<typeof CategoryStoreModel> {}