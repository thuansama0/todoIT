import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { CreateTodoPayload, Todo, todoApi } from "app/services/api/todoApi"

const TodoCategoryModel = types.model("TodoCategory", {
  id: types.string,
  name: types.string,
  isPublic: types.boolean,
  isOwner: types.boolean,
})

const TodoModel = types.model("Todo", {
  id: types.identifier,
  title: types.string,
  content: types.optional(types.string, ""),
  imageUrl: types.optional(types.string, ""),
  dueDate: types.optional(types.number, 0),
  isCompleted: types.optional(types.boolean, false),
  category: types.maybeNull(TodoCategoryModel),
})

function normalizeTodo(input: Partial<Todo> & { id: string }): any {
  return {
    id: input.id,
    title: input.title ?? "",
    content: input.content ?? "",
    imageUrl: input.imageUrl ?? "",
    dueDate: input.dueDate ?? 0,
    isCompleted: input.isCompleted ?? false,
    category: input.category
      ? {
          id: input.category.id ?? "",
          name: input.category.name ?? "General",
          isPublic: input.category.isPublic ?? false,
          isOwner: input.category.isOwner ?? false,
        }
      : null,
  }
}

export const TodoStoreModel = types
  .model("TodoStore")
  .props({
    items: types.optional(types.array(TodoModel), []),
    isLoading: types.optional(types.boolean, false),
    isLoaded: types.optional(types.boolean, false),
  })
  .actions((store) => {
    const fetchTodos = flow(function* fetchTodos() {
      store.isLoading = true
      try {
        const response = yield todoApi.getTodos(0, 50)
        if (response.ok && response.data?.success) {
          const items = (response.data.data?.items ?? []).map((todo: Todo) => normalizeTodo(todo))
          store.items.replace(items)
          store.isLoaded = true
        }
        return response
      } finally {
        store.isLoading = false
      }
    })

    const loadIfNeeded = flow(function* loadIfNeeded() {
      if (store.isLoading || store.isLoaded) return
      yield fetchTodos()
    })

    const createTodo = flow(function* createTodo(payload: CreateTodoPayload) {
      const tempId = `temp-${Date.now()}`
      const optimisticTodo = normalizeTodo({
        id: tempId,
        title: payload.title,
        content: payload.content,
        imageUrl: payload.imageUrl,
        dueDate: payload.dueDate,
        isCompleted: false,
      })
      store.items.unshift(optimisticTodo)

      const response = yield todoApi.createTodo(payload)
      if (response.ok && response.data?.success) {
        yield fetchTodos()
      } else {
        store.items.replace(store.items.filter((todo) => todo.id !== tempId))
      }
      return response
    })

    const updateTodo = flow(function* updateTodo(id: string, payload: CreateTodoPayload) {
      const idx = store.items.findIndex((todo) => todo.id === id)
      const backup = idx >= 0 ? getSnapshotTodo(store.items[idx]) : null
      if (idx >= 0) {
        store.items[idx] = {
          ...store.items[idx],
          title: payload.title,
          content: payload.content,
          imageUrl: payload.imageUrl,
          dueDate: payload.dueDate,
        } as any
      }

      const response = yield todoApi.updateTodo(id, payload)
      if (!response.ok || !response.data?.success) {
        if (idx >= 0 && backup) {
          store.items[idx] = backup as any
        }
      } else if (idx < 0) {
        yield fetchTodos()
      }
      return response
    })

    const toggleTodoStatus = flow(function* toggleTodoStatus(id: string, newStatus: boolean) {
      const idx = store.items.findIndex((todo) => todo.id === id)
      const previousStatus = idx >= 0 ? store.items[idx].isCompleted : false
      if (idx >= 0) {
        store.items[idx] = { ...store.items[idx], isCompleted: newStatus } as any
      }

      const response = yield todoApi.toggleTodoStatus(id, newStatus)
      if ((!response.ok || !response.data?.success) && idx >= 0) {
        store.items[idx] = { ...store.items[idx], isCompleted: previousStatus } as any
      }
      return response
    })

    const deleteTodo = flow(function* deleteTodo(id: string) {
      const backup = store.items.slice()
      store.items.replace(store.items.filter((todo) => todo.id !== id))

      const response = yield todoApi.deleteTodo(id)
      if (!response.ok || !response.data?.success) {
        store.items.replace(backup as any)
      }
      return response
    })

    return { fetchTodos, loadIfNeeded, createTodo, updateTodo, toggleTodoStatus, deleteTodo }
  })

function getSnapshotTodo(todo: any) {
  return {
    id: todo.id,
    title: todo.title,
    content: todo.content,
    imageUrl: todo.imageUrl,
    dueDate: todo.dueDate,
    isCompleted: todo.isCompleted,
    category: todo.category
      ? {
          id: todo.category.id,
          name: todo.category.name,
          isPublic: todo.category.isPublic,
          isOwner: todo.category.isOwner,
        }
      : null,
  }
}

export interface TodoStore extends Instance<typeof TodoStoreModel> {}
export interface TodoStoreSnapshot extends SnapshotOut<typeof TodoStoreModel> {}
