import { loadString, saveString } from "app/utils/storage"

/** Chuẩn hóa JWT — bỏ khoảng trắng / prefix Bearer lặp. */
export function normalizeAccessToken(raw: string | null | undefined): string | null {
  if (!raw) return null
  let token = raw.trim()
  if (!token || token.toLowerCase() === "null") return null
  if (token.toLowerCase().startsWith("bearer ")) {
    token = token.slice(7).trim()
  }
  return token || null
}

/**
 * Token đăng nhập: ưu tiên authToken từ store (MST persist), sau đó AsyncStorage `accessToken`.
 */
export async function getAccessToken(preferred?: string | null): Promise<string | null> {
  const fromPreferred = normalizeAccessToken(preferred)
  if (fromPreferred) return fromPreferred
  return normalizeAccessToken(await loadString("accessToken"))
}

/** Sau khi restore MST — giữ AsyncStorage khớp authToken (apisauce + fetch upload). */
export async function syncAccessTokenToStorage(
  authToken: string | null | undefined,
): Promise<void> {
  const token = normalizeAccessToken(authToken)
  if (token) {
    await saveString("accessToken", token)
  }
}
