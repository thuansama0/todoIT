import BaseConfig from "./config.base"

const Config = {
  ...BaseConfig,
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "",
}

export default Config
