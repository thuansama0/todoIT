import { ApiResponse } from "apisauce"
import { api } from "./api"

// Cấu trúc dữ liệu User trả về từ API (Dựa theo ảnh Swagger)
export interface UserProfile {
  id: string
  email: string
  name: string
  imageUrl?: string
  accessToken?: string
}

// Cấu trúc dữ liệu gửi lên khi muốn Cập nhật thông tin (PUT)
export interface UpdateUserPayload {
  email?: string
  password?: string
  name?: string
  imageUrl?: string
}

// Cấu trúc chung cho API trả về Profile
export interface UserApiResult {
  success: boolean
  message: string
  data?: UserProfile
}

// Cấu trúc chung cho API chỉ trả về thành công/thất bại (như Xóa user)
export interface GenericResult {
  success: boolean
  message: string
  data?: any
}

export const userApi = {
  // 1. Lấy thông tin cá nhân của User đang đăng nhập (Thường dùng nhất để in ra màn hình Profile)
  getMe: async (): Promise<ApiResponse<UserApiResult>> => {
    return await api.apisauce.get<UserApiResult>("/user/me")
  },

  // 2. Lấy thông tin User bất kỳ theo ID
  getUserById: async (id: string): Promise<ApiResponse<UserApiResult>> => {
    return await api.apisauce.get<UserApiResult>(`/user/${id}`)
  },

  // 3. Cập nhật thông tin cá nhân (Đổi tên, đổi avatar, đổi pass...)
  updateProfile: async (payload: UpdateUserPayload): Promise<ApiResponse<UserApiResult>> => {
    return await api.apisauce.put<UserApiResult>("/user", payload)
  },

  // 4. Xóa tài khoản (Xóa chính mình)
  deleteAccount: async (): Promise<ApiResponse<GenericResult>> => {
    return await api.apisauce.delete<GenericResult>("/user")
  },

  // 5. Cập nhật mã Push Token (Dùng để sau này bắn thông báo đẩy về điện thoại)
  updatePushToken: async (pushToken: string): Promise<ApiResponse<GenericResult>> => {
    return await api.apisauce.patch<GenericResult>("/user/update-push-token", { pushToken })
  },
}
