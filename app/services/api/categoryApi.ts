import { ApiResponse } from "apisauce"
import { api } from "./api"

export interface Category {
  id: string
  name: string
  isPublic: boolean
  isOwner: boolean
}

export interface GetCategoriesResult {
  success: boolean
  message: string
  data?: {
    items: Category[]
  }
}

export const categoryApi = {
  // 1. Lấy danh sách (Có thể sếp bạn để đường dẫn là /category/all hoặc /category, bạn check lại Swagger nhé)
  getCategories: async (): Promise<ApiResponse<GetCategoriesResult>> => {
    return await api.apisauce.get<GetCategoriesResult>("/category/all")
  },

  // 2. Xóa danh mục
  deleteCategory: async (id: string) => {
    return await api.apisauce.delete<any>(`/category/${id}`)
  },
  // 3. Tạo mới danh mục
  createCategory: async (name: string, isPublic: boolean) => {
    const response = await api.apisauce.post<any>("/category", {
      name,
      isPublic,
    })
    return response
  },
  // 4. Cập nhật danh mục
  updateCategory: async (id: string, name: string, isPublic: boolean) => {
    const response = await api.apisauce.put<any>(`/category/${id}`, {
      name,
      isPublic,
    })
    return response
  },
}
