import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { Category, categoryApi } from "app/services/api/categoryApi"

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
      return store.items.slice().sort((a, b) => a.name.localeCompare(b.name))
    },
  }))
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
      if (store.isLoaded || store.isLoading) return
      yield fetchCategories()
    })

    const createCategory = flow(function* createCategory(name: string, isPublic: boolean) {
      const normalizedName = name.trim()
      const tempId = `temp-${Date.now()}`
      store.items.unshift(
        normalizeCategory({
          id: tempId,
          name: normalizedName,
          isPublic,
          isOwner: true,
        }) as any,
      )

      const response = yield categoryApi.createCategory(name.trim(), isPublic)
      if (response.ok && response.data?.success) {
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
        store.items[idx] = normalizeCategory({ ...store.items[idx], name: name.trim(), isPublic }) as any
      }

      const response = yield categoryApi.updateCategory(id, name.trim(), isPublic)
      if (!response.ok || !response.data?.success) {
        if (idx >= 0 && backup) {
          store.items[idx] = backup as any
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

    return { fetchCategories, loadIfNeeded, createCategory, updateCategory, deleteCategory }
  })

export interface CategoryStore extends Instance<typeof CategoryStoreModel> {}
export interface CategoryStoreSnapshot extends SnapshotOut<typeof CategoryStoreModel> {}