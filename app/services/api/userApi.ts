import { ApiResponse } from "apisauce"
import { api } from "./api"

export interface UserProfile {
  id: string
  email: string
  name: string
  imageUrl?: string
  accessToken?: string
  pushToken?: string
}

export interface UpdateUserPayload {
  email?: string
  password?: string
  name?: string
  imageUrl?: string
}

export interface UserApiResult {
  success: boolean
  message: string
  data?: UserProfile
}

export interface GenericResult {
  success: boolean
  message: string
  data?: any
}

export const userApi = {
  getMe: async (): Promise<ApiResponse<UserApiResult>> => {
    return await api.apisauce.get<UserApiResult>("/user/me")
  },

  getUserById: async (id: string): Promise<ApiResponse<UserApiResult>> => {
    return await api.apisauce.get<UserApiResult>(`/user/${id}`)
  },

  updateProfile: async (payload: UpdateUserPayload): Promise<ApiResponse<UserApiResult>> => {
    return await api.apisauce.put<UserApiResult>("/user", payload)
  },

  deleteAccount: async (): Promise<ApiResponse<GenericResult>> => {
    return await api.apisauce.delete<GenericResult>("/user")
  },

  updatePushToken: async (
    pushToken: string,
    accessToken?: string,
  ): Promise<ApiResponse<GenericResult>> => {
    return await api.apisauce.patch<GenericResult>(
      "/user/update-push-token",
      { pushToken },
      accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
    )
  },
}
