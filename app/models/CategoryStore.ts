import { Instance, SnapshotOut, flow, types } from "mobx-state-tree"
import { categoryApi } from "app/services/api/categoryApi"

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
    const fetchCategories = flow(function* fetchCategories() {
      // #region agent log
      fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H2", location: "CategoryStore.ts:fetchCategories:start", message: "fetchCategories started", data: { isLoading: store.isLoading, isLoaded: store.isLoaded, itemsCount: store.items.length }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
      store.isLoading = true
      const response = yield categoryApi.getCategories()
      // #region agent log
      fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H3", location: "CategoryStore.ts:fetchCategories:response", message: "fetchCategories response", data: { ok: response?.ok ?? false, problem: response?.problem ?? null, success: response?.data?.success ?? null, hasData: !!response?.data }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
      if (response.ok && response.data?.success) {
        store.items.replace(response.data.data?.items ?? [])
        store.isLoaded = true
      }
      store.isLoading = false
      // #region agent log
      fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H2", location: "CategoryStore.ts:fetchCategories:end", message: "fetchCategories finished", data: { isLoading: store.isLoading, isLoaded: store.isLoaded, itemsCount: store.items.length }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
      return response
    })

    const loadIfNeeded = flow(function* loadIfNeeded() {
      // #region agent log
      fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H4", location: "CategoryStore.ts:loadIfNeeded", message: "loadIfNeeded called", data: { isLoading: store.isLoading, isLoaded: store.isLoaded, itemsCount: store.items.length }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
      if (store.isLoaded || store.isLoading) return
      yield fetchCategories()
    })

    const createCategory = flow(function* createCategory(name: string, isPublic: boolean) {
      const response = yield categoryApi.createCategory(name.trim(), isPublic)
      if (response.ok && response.data?.success) {
        // Nếu API create không trả item đầy đủ thì fetch lại cho chắc
        yield fetchCategories()
      }
      return response
    })

    const updateCategory = flow(function* updateCategory(id: string, name: string, isPublic: boolean) {
      const response = yield categoryApi.updateCategory(id, name.trim(), isPublic)
      if (response.ok && response.data?.success) {
        const idx = store.items.findIndex((x) => x.id === id)
        if (idx >= 0) {
          store.items[idx] = { ...store.items[idx], name: name.trim(), isPublic } as any
        } else {
          yield fetchCategories()
        }
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