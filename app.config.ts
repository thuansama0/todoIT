import { ExpoConfig, ConfigContext } from "@expo/config"

/**
 * Use ts-node here so we can use TypeScript for our Config Plugins
 * and not have to compile them to JavaScript
 */
require("ts-node/register")

/**
 * @param config ExpoConfig coming from the static config app.json if it exists
 * 
 * You can read more about Expo's Configuration Resolution Rules here:
 * https://docs.expo.dev/workflow/configuration/#configuration-resolution-rules
 */
module.exports = ({ config }: ConfigContext): Partial<ExpoConfig> => {
  const existingPlugins = config.plugins ?? []
  const existingExtra = config.extra ?? {}
  const existingEas = (existingExtra as Record<string, any>).eas ?? {}
  const envProjectId = process.env.EXPO_PUBLIC_EAS_PROJECT_ID

  return {
    ...config,
    extra: {
      ...existingExtra,
      eas: {
        ...existingEas,
        projectId: envProjectId ?? existingEas.projectId,
      },
    },
    plugins: [
      ...existingPlugins,
      require("./plugins/withSplashScreen").withSplashScreen,
      require("./plugins/withFlipperDisabled").withFlipperDisabled,
    ],
  }
}
