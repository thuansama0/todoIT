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
    items: Todo[] // Mảng Todo trả về từ API
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
  // lấy danh sách Todo với phân trang
  getTodos: async (page = 0, size = 20): Promise<ApiResponse<GetTodosResult>> => {
    const response = await api.apisauce.get<GetTodosResult>("/todo/all", {
      page,
      size,
    })
    return response
  },
  // Tạo mới một Todo
  createTodo: async (payload: CreateTodoPayload): Promise<ApiResponse<any>> => {
    const response = await api.apisauce.post("/todo", payload)
    return response
  },
  // Lấy chi tiết một Todo theo ID
  getTodoById: async (id: string) => {
    const response = await api.apisauce.get<any>(`/todo/${id}`)
    return response
  },
  // Cập nhật một Todo theo ID
  toggleTodoStatus: async (id: string, isCompleted: boolean) => {
    const response = await api.apisauce.patch<any>(`/todo/${id}/toggle-completed`, {
      isCompleted,
    })
    return response
  },
  // Xóa một Todo theo ID
  deleteTodo: async (id: string) => {
    const response = await api.apisauce.delete<any>(`/todo/${id}`)
    return response
  },
  // Sửa toàn bộ nội dung công việc
  updateTodo: async (id: string, payload: CreateTodoPayload) => {
    const response = await api.apisauce.put<any>(`/todo/${id}`, payload)
    return response
  },
}
