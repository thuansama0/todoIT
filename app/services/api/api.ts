import {
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import type {
  ApiConfig,
} from "./api.types"
import { loadString } from "../../utils/storage"

export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
    this.apisauce.addAsyncRequestTransform(async (request) => {
    
      const token = await loadString("accessToken")

      if (token) {
        request.headers = request.headers ?? {}
        request.headers.Authorization = `Bearer ${token}`
      }
    })
  }

}

export const api = new Api()
