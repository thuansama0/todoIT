import { ApiResponse } from "apisauce"
import { api } from "./api"
import type { ApiResult } from "./api.types"

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

export const authApi = {
  signIn: async (email: string, password: string): Promise<ApiResponse<LoginResult>> => {
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
    const response = await api.apisauce.post<LoginResult>("/auth/sign-up", {
      email,
      password,
      name,
    })
    return response
  },
  signOut: async (): Promise<ApiResponse<ApiResult>> => {
    const response = await api.apisauce.post<ApiResult>("/auth/sign-out")
    return response
  },
}
