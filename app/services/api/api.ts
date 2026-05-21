import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig } from "./api.types"
import { getAccessToken } from "../../utils/accessToken"
import { logDev, logApisauceResponse, shouldLogApisauceResponse } from "../../utils/logDev"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config

    if (__DEV__ && !this.config.url?.trim()) {
      logDev(
        "api",
        "EXPO_PUBLIC_API_URL is empty — API calls will fail until .env / EAS env is set",
      )
    }

    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.apisauce.addAsyncRequestTransform(async (request) => {
      const token = await getAccessToken()

      if (token && !request.headers?.Authorization) {
        request.headers = request.headers ?? {}
        request.headers.Authorization = `Bearer ${token}`
      }

      if (__DEV__) {
        const base = request.baseURL ?? this.config.url
        const path = request.url ?? ""
        logDev("api", `→ ${request.method ?? "?"} ${base}${path}`, {
          hasAuth: !!request.headers?.Authorization,
        })
      }
    })

    this.apisauce.addMonitor((response) => {
      if (shouldLogApisauceResponse(response)) {
        logApisauceResponse("api", response)
      }
    })
  }
}

export const api = new Api()
