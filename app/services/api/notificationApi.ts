import { ApiResponse } from "apisauce"
import { api } from "./api"

export interface Notification {
  id: string
  title: string
  content: string
  isRead: boolean
  sentAt: number
}

// Cấu trúc kết quả trả về khi lấy danh sách
export interface GetNotificationsResult {
  success: boolean
  message: string
  data?: {
    items: Notification[]
    meta: {
      page: number
      size: number
      totalItems: number
      totalPages: number
    }
  }
}

// đếm số lượng chưa đọc (data trả về là 1 con số)
export interface UnreadCountResult {
  success: boolean
  message: string
  data?: number
}

export const notificationApi = {
  // 1. Lấy danh sách thông báo (có phân trang page, size)
  getNotifications: async (page = 0, size = 20): Promise<ApiResponse<GetNotificationsResult>> => {
    return await api.apisauce.get<GetNotificationsResult>("/notification/all", { page, size })
  },

  // 2. Lấy số lượng thông báo chưa đọc (Dùng để hiện số đỏ ở dưới thanh TabBar)
  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResult>> => {
    return await api.apisauce.get<UnreadCountResult>("/notification/unread-count")
  },

  // 3. Đánh dấu MỘT thông báo là đã đọc
  markAsRead: async (id: string) => {
    return await api.apisauce.patch<any>(`/notification/mark-read/${id}`)
  },

  // 4. Đánh dấu TẤT CẢ thông báo là đã đọc
  markAllAsRead: async () => {
    return await api.apisauce.patch<any>("/notification/mark-read/all")
  },

  // 5. Xóa MỘT thông báo
  deleteNotification: async (id: string) => {
    return await api.apisauce.delete<any>(`/notification/${id}`)
  },

  // 6. Xóa TẤT CẢ thông báo (Dọn sạch)
  deleteAllNotifications: async () => {
    return await api.apisauce.delete<any>("/notification/all")
  },
}
