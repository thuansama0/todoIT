import { api } from "./api"
import { ApiResponse } from "apisauce"
export interface Category {
  id: string
  name: string
  isPublic: boolean
  isOwner: boolean
}

export interface Todo {
  id: string
  title: string
  content: string
  imageUrl: string
  dueDate: number
  isCompleted: boolean
  category: Category
  reminderMinutes?: number
}
export interface GetTodosResult {
  success: boolean
  message: string
  data?: {
    meta: {
      page: number
      size: number
      totalItems: number
      totalPages: number
    }
    items: Todo[]
  }
}
export interface CreateTodoPayload {
  title: string
  content: string
  imageUrl: string
  dueDate: number
  categoryId: string
}
export const todoApi = {
  getTodos: async (page = 0, size = 20): Promise<ApiResponse<GetTodosResult>> => {
    const response = await api.apisauce.get<GetTodosResult>("/todo/all", {
      page,
      size,
    })
    return response
  },

  createTodo: async (payload: CreateTodoPayload): Promise<ApiResponse<any>> => {
    const response = await api.apisauce.post("/todo", payload)
    return response
  },

  getTodoById: async (id: string) => {
    const response = await api.apisauce.get<any>(`/todo/${id}`)
    return response
  },

  toggleTodoStatus: async (id: string, isCompleted: boolean) => {
    const response = await api.apisauce.patch<any>(`/todo/${id}/toggle-completed`, {
      isCompleted,
    })
    return response
  },

  deleteTodo: async (id: string) => {
    const response = await api.apisauce.delete<any>(`/todo/${id}`)
    return response
  },

  updateTodo: async (id: string, payload: CreateTodoPayload) => {
    const response = await api.apisauce.put<any>(`/todo/${id}`, payload)
    return response
  },
}
