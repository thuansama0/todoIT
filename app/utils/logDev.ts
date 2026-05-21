/**
 * Dev-only logging — stripped in release builds (__DEV__ === false).
 * Avoid tokens, passwords, and full response bodies (PII / size).
 */

type ApisauceLikeResponse = {
  ok?: boolean
  status?: number
  problem?: string | null
  data?: unknown
  config?: { url?: string; method?: string; baseURL?: string }
}

export function logDev(tag: string, message: string, data?: Record<string, unknown>) {
  if (!__DEV__) return
  if (data !== undefined) {
    console.log(`[${tag}]`, message, data)
  } else {
    console.log(`[${tag}]`, message)
  }
}

function apiMessage(data: unknown): string | undefined {
  if (data && typeof data === "object" && "message" in data) {
    const msg = (data as { message?: unknown }).message
    return typeof msg === "string" ? msg : undefined
  }
  return undefined
}

function apiSuccess(data: unknown): boolean | undefined {
  if (data && typeof data === "object" && "success" in data) {
    return (data as { success?: boolean }).success
  }
  return undefined
}

/** apisauce response — log when call fails or backend returns success: false */
export function logApisauceResponse(tag: string, response: ApisauceLikeResponse) {
  if (!__DEV__) return

  const base = response.config?.baseURL ?? ""
  const path = response.config?.url ?? ""
  const url = `${base}${path}` || "unknown"

  logDev(tag, `${response.config?.method ?? "?"} ${url}`, {
    ok: response.ok,
    status: response.status,
    problem: response.problem,
    success: apiSuccess(response.data),
    message: apiMessage(response.data),
  })
}

export function shouldLogApisauceResponse(response: ApisauceLikeResponse): boolean {
  if (!__DEV__) return false
  if (response.problem) return true
  if (!response.ok) return true
  if (apiSuccess(response.data) === false) return true
  return false
}

/** fetch upload/image — separate from apisauce */
export function logUploadResponse(params: {
  url: string
  status: number
  ok: boolean
  success?: boolean
  message?: string
  hasImageUrl?: boolean
  parseFailed?: boolean
  bodyPreview?: string
}) {
  if (!__DEV__) return
  logDev("upload", "POST /upload/image", params)
}

export function logUploadError(code: string, detail?: string) {
  if (!__DEV__) return
  logDev("upload", code, detail ? { detail } : undefined)
}
