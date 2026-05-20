import Config from "app/config"
import { getAccessToken } from "app/utils/accessToken"

/** Response shape per backend Swagger for POST /upload/image */
export interface UploadImageApiResult {
  success: boolean
  message?: string
  errors?: unknown
  data?: string
}

export type LocalImageFilePart = {
  uri: string
  mimeType?: string | null
  fileName?: string | null
}

function guessMimeAndName(uri: string): { name: string; type: string } {
  const last = uri.split("/").pop() || "photo.jpg"
  const base = decodeURIComponent(last.split("?")[0])
  const lower = base.toLowerCase()
  if (lower.endsWith(".png")) return { name: base, type: "image/png" }
  if (lower.endsWith(".webp")) return { name: base, type: "image/webp" }
  if (lower.endsWith(".heic") || lower.endsWith(".heif"))
    return { name: base.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg"), type: "image/jpeg" }
  if (base.includes(".")) return { name: base, type: "image/jpeg" }
  return { name: "photo.jpg", type: "image/jpeg" }
}

function buildMultipartFile(part: LocalImageFilePart) {
  const guessed = guessMimeAndName(part.uri)
  const name = part.fileName?.trim() || guessed.name
  const type = part.mimeType?.trim() || guessed.type
  return { uri: part.uri, type, name } as unknown as Blob
}

function parseJsonBody(text: string): UploadImageApiResult | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  try {
    return JSON.parse(trimmed) as UploadImageApiResult
  } catch {
    return null
  }
}

/**
 * POST /upload/image — multipart field `image`.
 * Dùng `fetch` (RN + axios/apisauce hay làm hỏng multipart → 400 missing image).
 */
export async function uploadProfileImage(
  file: LocalImageFilePart,
  authToken?: string | null,
): Promise<string> {
  const token = await getAccessToken(authToken)
  if (!token) {
    throw new Error("AUTH_REQUIRED")
  }

  const formData = new FormData()
  formData.append("image", buildMultipartFile(file))

  const base = Config.API_URL.replace(/\/+$/, "")
  const url = `${base}/upload/image`

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  const text = await res.text()
  const parsed = parseJsonBody(text)
  const msg = parsed?.message?.trim()

  if (!res.ok) {
    const fallback = msg || `Upload failed (HTTP ${res.status}).`
    if (res.status === 401 || /invalid token/i.test(fallback)) {
      throw new Error("AUTH_INVALID")
    }
    if (res.status === 400) {
      throw new Error(msg || "UPLOAD_BAD_REQUEST")
    }
    throw new Error(fallback)
  }

  if (!parsed?.success) {
    const failMsg = msg || "Upload failed."
    if (/invalid token/i.test(failMsg)) {
      throw new Error("AUTH_INVALID")
    }
    throw new Error(failMsg)
  }

  const imageUrl = parsed.data?.trim()
  if (!imageUrl) {
    throw new Error(msg || "Server did not return an image URL.")
  }
  return imageUrl
}
