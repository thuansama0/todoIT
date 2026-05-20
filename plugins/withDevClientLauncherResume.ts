import {
  ConfigPlugin,
  withDangerousMod,
  AndroidConfig,
} from "expo/config-plugins"
import fs from "fs"
import path from "path"

const ON_NEW_INTENT_BLOCK = `
  /**
   * expo-dev-client gọi loadApp() mỗi khi nhận MAIN intent (bấm icon launcher),
   * khiến app reload như vừa bị kill. Recent Apps chỉ onResume nên không bị.
   * Bỏ qua super.onNewIntent cho launcher tap — giữ nguyên session hiện tại.
   */
  override fun onNewIntent(intent: Intent?) {
    if (intent?.action == Intent.ACTION_MAIN) {
      setIntent(intent)
      return
    }
    super.onNewIntent(intent)
  }
`

const withDevClientLauncherResume: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const packageName = AndroidConfig.Package.getPackage(modConfig)
      if (!packageName) return modConfig

      const packagePath = packageName.replace(/\./g, path.sep)
      const mainActivityPath = path.join(
        modConfig.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "java",
        packagePath,
        "MainActivity.kt",
      )

      if (!fs.existsSync(mainActivityPath)) return modConfig

      let contents = fs.readFileSync(mainActivityPath, "utf8")
      if (contents.includes("override fun onNewIntent(intent: Intent?)")) {
        return modConfig
      }

      if (!contents.includes("import android.content.Intent")) {
        contents = contents.replace(
          "import android.os.Build",
          "import android.content.Intent\nimport android.os.Build",
        )
      }

      contents = contents.replace(
        /override fun onCreate\(savedInstanceState: Bundle\?\) \{[\s\S]*?\n  \}\n/,
        (match) => `${match}\n${ON_NEW_INTENT_BLOCK}\n`,
      )

      fs.writeFileSync(mainActivityPath, contents)
      return modConfig
    },
  ])
}

export const withDevClientLauncherResumePlugin = withDevClientLauncherResume
