import { applySnapshot, flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CreateTodoPayload, Todo, todoApi } from "app/services/api/todoApi"
import {
  cancelTodoReminder,
  loadTodoReminderMinutesMap,
  scheduleTodoReminder,
} from "app/utils/todoReminder"
import { isMutationSuccess } from "app/utils/isMutationSuccess"
import { toPlainTodo } from "app/utils/todoMapper"
import { DEFAULT_LIST_PAGE_SIZE } from "app/constants/pagination"

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
  reminderMinutes: types.optional(types.number, 0),
  category: types.maybeNull(TodoCategoryModel),
})

type TodoMutationResult = { ok: boolean; data?: { success: boolean; message?: string } }

function normalizeTodo(input: Partial<Todo> & { id: string }) {
  return {
    id: input.id,
    title: input.title ?? "",
    content: input.content ?? "",
    imageUrl: input.imageUrl ?? "",
    dueDate: input.dueDate ?? 0,
    isCompleted: input.isCompleted ?? false,
    reminderMinutes: input.reminderMinutes ?? 0,
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
  .actions(withSetPropAction)
  .actions((store) => {
    const fetchTodos = flow(function* fetchTodos() {
      store.isLoading = true
      try {
        const response = yield todoApi.getTodos(0, DEFAULT_LIST_PAGE_SIZE)
        if (response.ok && response.data?.success) {
          const reminderMinutesMap = yield loadTodoReminderMinutesMap()
          const items = (response.data.data?.items ?? []).map((todo: Todo) =>
            normalizeTodo({
              ...todo,
              reminderMinutes: reminderMinutesMap?.[todo.id] ?? 0,
            }),
          )
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
      // Đã có todo trong persist → hiển thị ngay, không GET mỗi lần mở app (đồng bộ khi kéo refresh).
      if (store.items.length > 0) {
        store.isLoaded = true
        return
      }
      yield fetchTodos()
    })

    const createTodo = flow(function* createTodo(
      payload: CreateTodoPayload,
      reminderMinutes = 0,
    ) {
      const response = yield todoApi.createTodo(payload)
      if (!isMutationSuccess(response)) {
        return response as TodoMutationResult
      }

      const createdTodo = response.data?.data
      if (createdTodo?.id) {
        const normalized = normalizeTodo({
          ...createdTodo,
          reminderMinutes,
        })
        if (!store.items.some((todo) => todo.id === normalized.id)) {
          store.items.replace([normalized, ...store.items.map(toPlainTodo)])
        }
        if (reminderMinutes > 0 && (normalized.dueDate ?? 0) > 0) {
          yield scheduleTodoReminder({
            todoId: normalized.id,
            title: normalized.title,
            dueDate: normalized.dueDate ?? 0,
            reminderMinutes,
          })
        }
        return response
      }

      // Fallback fetch vì một số backend có thể trả success nhưng không trả entity vừa tạo.
      yield fetchTodos()
      const matchedTodo = [...store.items]
        .reverse()
        .find(
          (todo) =>
            todo.title === payload.title &&
            todo.content === payload.content &&
            todo.dueDate === payload.dueDate,
        )
      if (matchedTodo && reminderMinutes > 0) {
        matchedTodo.reminderMinutes = reminderMinutes
        yield scheduleTodoReminder({
          todoId: matchedTodo.id,
          title: matchedTodo.title,
          dueDate: matchedTodo.dueDate,
          reminderMinutes,
        })
      }
      return response
    })

    const updateTodo = flow(function* updateTodo(
      id: string,
      payload: CreateTodoPayload,
      reminderMinutes = 0,
    ) {
      const response = yield todoApi.updateTodo(id, payload)
      if (!isMutationSuccess(response)) {
        return response
      }

      const idx = store.items.findIndex((todo) => todo.id === id)
      if (idx >= 0) {
        applySnapshot(store.items[idx], {
          ...toPlainTodo(store.items[idx]),
          title: payload.title,
          content: payload.content,
          imageUrl: payload.imageUrl,
          dueDate: payload.dueDate,
          reminderMinutes,
        })
        if (reminderMinutes > 0) {
          yield scheduleTodoReminder({
            todoId: id,
            title: payload.title,
            dueDate: payload.dueDate,
            reminderMinutes,
          })
        } else {
          yield cancelTodoReminder(id)
        }
      } else {
        yield fetchTodos()
      }
      return response
    })

    const toggleTodoStatus = flow(function* toggleTodoStatus(id: string, newStatus: boolean) {
      const response = yield todoApi.toggleTodoStatus(id, newStatus)
      if (!isMutationSuccess(response)) {
        return response
      }

      const idx = store.items.findIndex((todo) => todo.id === id)
      if (idx >= 0) {
        const nextItems = store.items.map((todo) =>
          todo.id === id ? { ...toPlainTodo(todo), isCompleted: newStatus } : toPlainTodo(todo),
        )
        store.items.replace(nextItems)
      } else {
        yield fetchTodos()
      }
      return response
    })

    const deleteTodo = flow(function* deleteTodo(id: string) {
      const response = yield todoApi.deleteTodo(id)
      if (!isMutationSuccess(response)) {
        return response
      }

      store.items.replace(store.items.map(toPlainTodo).filter((todo) => todo.id !== id))
      yield cancelTodoReminder(id)
      return response
    })

    const resetForAuthChange = flow(function* resetForAuthChange() {
      const todoIds = store.items.map((todo) => todo.id)
      store.items.clear()
      store.isLoaded = false
      store.isLoading = false
      // Dọn reminder local để không lẫn giữa các phiên đăng nhập.
      for (const id of todoIds) {
        yield cancelTodoReminder(id)
      }
    })

    return {
      fetchTodos,
      loadIfNeeded,
      createTodo,
      updateTodo,
      toggleTodoStatus,
      deleteTodo,
      resetForAuthChange,
    }
  })

export interface TodoStore extends Instance<typeof TodoStoreModel> {}
export interface TodoStoreSnapshot extends SnapshotOut<typeof TodoStoreModel> {}
