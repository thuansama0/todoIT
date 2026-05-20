import { MIN_PASSWORD_LENGTH } from "app/constants/auth"
import { translate } from "app/i18n"

/** Trả message lỗi qua i18n; `null` nếu hợp lệ hoặc để trống (không đổi mật khẩu). */
export function getPasswordValidationError(password: string): string | null {
  const trimmed = password.trim()
  if (!trimmed) return null
  if (trimmed.length < MIN_PASSWORD_LENGTH) {
    return translate("profileScreen.passwordInvalidMessage", { min: MIN_PASSWORD_LENGTH })
  }
  return null
}
