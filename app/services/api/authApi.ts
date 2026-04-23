import { ApiResponse } from "apisauce"
import { api } from "./api"
// trả về
export interface LoginResult {
  success: boolean
  message: string
  errors?: any[]
  data?: {
    id: string
    email: string
    name: string
    imageUrl: string
    accessToken: string
  }
}
export interface GenericResponse {
  success: boolean
  message: string
  errors?: any[]
  data?: any
}

//   các hàm gọi API liên quan đến Auth
export const authApi = {
  signIn: async (email: string, password: string): Promise<ApiResponse<LoginResult>> => {
    // API Đăng nhập (Sign-in)
    const response = await api.apisauce.post<LoginResult>("/auth/sign-in", {
      email,
      password,
    })
    return response
  },
  signUp: async (
    email: string,
    password: string,
    name: string,
  ): Promise<ApiResponse<LoginResult>> => {
    // API Đăng ký
    const response = await api.apisauce.post<LoginResult>("/auth/sign-up", {
      email,
      password,
      name,
    })
    return response
  },
  signOut: async (): Promise<ApiResponse<GenericResponse>> => {
    // API Đăng xuất (Logout)
    const response = await api.apisauce.post<GenericResponse>("/auth/sign-out")
    return response
  },
}
