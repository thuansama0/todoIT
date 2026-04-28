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
  getCategories: async (): Promise<ApiResponse<GetCategoriesResult>> => {
    return await api.apisauce.get<GetCategoriesResult>("/category/all")
  },

  deleteCategory: async (id: string) => {
    return await api.apisauce.delete<any>(`/category/${id}`)
  },

  createCategory: async (name: string, isPublic: boolean) => {
    const response = await api.apisauce.post<any>("/category", {
      name,
      isPublic,
    })
    return response
  },

  updateCategory: async (id: string, name: string, isPublic: boolean) => {
    const response = await api.apisauce.put<any>(`/category/${id}`, {
      name,
      isPublic,
    })
    return response
  },
}
