import { ApiResponse } from "apisauce"
import { api } from "./api"

export interface Notification {
  id: string
  title: string
  content: string
  isRead: boolean
  sentAt: number
}

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

export interface UnreadCountResult {
  success: boolean
  message: string
  data?: number
}

export interface CreateNotificationPayload {
  userId: string
  title: string
  content: string
}

export const notificationApi = {
  getNotifications: async (page = 0, size = 20): Promise<ApiResponse<GetNotificationsResult>> => {
    return await api.apisauce.get<GetNotificationsResult>("/notification/all", { page, size })
  },

  getUnreadCount: async (): Promise<ApiResponse<UnreadCountResult>> => {
    return await api.apisauce.get<UnreadCountResult>("/notification/unread-count")
  },

  createNotification: async (payload: CreateNotificationPayload) => {
    return await api.apisauce.post<any>("/notification", payload)
  },

  markAsRead: async (id: string) => {
    return await api.apisauce.patch<any>(`/notification/mark-read/${id}`)
  },

  markAllAsRead: async () => {
    return await api.apisauce.patch<any>("/notification/mark-read/all")
  },

  deleteNotification: async (id: string) => {
    return await api.apisauce.delete<any>(`/notification/${id}`)
  },

  deleteAllNotifications: async () => {
    return await api.apisauce.delete<any>("/notification/all")
  },
}
