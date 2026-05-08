import I18n from "i18n-js"

// Vì RN bundle không tree-shake tốt: import trực tiếp từng hàm/locale của date-fns để tránh kéo cả thư viện vào production.
import type { Locale } from "date-fns"
import format from "date-fns/format"
import parseISO from "date-fns/parseISO"
import ar from "date-fns/locale/ar-SA"
import ko from "date-fns/locale/ko"
import en from "date-fns/locale/en-US"

type Options = Parameters<typeof format>[2]

const getLocale = (): Locale => {
  const locale = I18n.currentLocale().split("-")[0]
  return locale === "ar" ? ar : locale === "ko" ? ko : en
}

// Vì chuỗi ngày cần theo locale người dùng (i18n), tránh format cố định một ngôn ngữ trong UI.
export const formatDate = (date: string, dateFormat?: string, options?: Options) => {
  const locale = getLocale()
  const dateOptions = {
    ...options,
    locale,
  }
  return format(parseISO(date), dateFormat ?? "MMM dd, yyyy", dateOptions)
}

// Vì list và detail notification cần cùng cách hiển thị “bao lâu trước”; gom một chỗ tránh lệch copy-paste.
export const formatTimeAgo = (timestamp: number) => {
  if (!timestamp) return ""

  const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000)
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

// Vì todo list/detail dùng chung nhãn “No date” và kiểu ngày ngắn; một util để không đổi UX chỗ này quên chỗ kia.
export const formatTodoDate = (timestamp: number) => {
  if (!timestamp || timestamp === 0) return "No date"
  return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Vì form todo và API đang thống nhất một chuỗi nhập tay; một hàm format tránh mỗi màn tự pad/ghép khác nhau.
export function formatDueDateFromTimestamp(timestamp: number): string {
  if (!timestamp || timestamp === 0) return ""
  const date = new Date(timestamp)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const hh = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

// Vì khi bật due date cần giá trị ban đầu hợp lệ ngay; để trống dễ gây lỗi parse hoặc submit không nhất quán.
export function getCurrentDateString(): string {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const hh = String(today.getHours()).padStart(2, "0")
  const min = String(today.getMinutes()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

// Vì cùng một quy tắc parse với chuỗi do formatDueDateFromTimestamp tạo; tách util để submit không lệch rule giữa màn hình.
export function parseDateTime(value: string): number {
  const [datePart, timePart] = value.trim().split(" ")
  if (!datePart || !timePart) return NaN
  const [yyyy, mm, dd] = datePart.split("-").map(Number)
  const [hh, min] = timePart.split(":").map(Number)
  if (!yyyy || !mm || !dd || hh === undefined || min === undefined) return NaN
  return new Date(yyyy, mm - 1, dd, hh, min, 0, 0).getTime()
}
