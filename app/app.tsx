/* eslint-disable import/first */
if (__DEV__) {
  require("./devtools/ReactotronConfig.ts")
}
import "./i18n"
import "./utils/ignoreWarnings"
import { useFonts } from "expo-font"
import React, { useEffect } from "react"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"
import * as Linking from "expo-linking"
import { RootStoreProvider, useInitialRootStore } from "app/models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { ErrorBoundary } from "./screens/ErrorScreen/ErrorBoundary"
import * as storage from "./utils/storage"
import { customFontsToLoad } from "./theme"
import Config from "./config"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ViewStyle } from "react-native"
import { usePushNotifications } from "./utils/usePushNotifications"
import Toast from "react-native-toast-message"

export const NAVIGATION_PERSISTENCE_KEY = "NAVIGATION_STATE"

const prefix = Linking.createURL("/")
const config = {
  screens: {
    Login: {
      path: "",
    },
    Demo: {
      screens: {
        DemoShowroom: {
          path: "showroom/:queryIndex?/:itemIndex?",
        },
        DemoDebug: "debug",
        DemoPodcastList: "podcast",
        DemoCommunity: "community",
      },
    },
  },
}

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

// Component rỗng chỉ để gắn hook — listener phải sống suốt lifecycle app, không gắn vào từng màn.
function PushNotificationHandler() {
  usePushNotifications()
  return null
}

function App(props: AppProps) {
  const { hideSplashScreen } = props
  const {
    initialNavigationState, // State của navigation khi khởi tạo app
    onNavigationStateChange, // Hàm callback khi state navigation thay đổi
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  const [areFontsLoaded] = useFonts(customFontsToLoad)
  // khởi tạo store và hiển thị splash screen
  const { rootStore, rehydrated } = useInitialRootStore(() => {
    setTimeout(hideSplashScreen, 500)
  })

  // Token đã có từ persist → kéo list nhẹ ở nền; user vào tab vẫn có fetch theo focus (README mục Todo flow).
  useEffect(() => {
    if (!rehydrated) return
    if (!rootStore.authenticationStore.authToken) return
    rootStore.todoStore.loadIfNeeded().catch(() => undefined)
    rootStore.categoryStore.loadIfNeeded().catch(() => undefined)
  }, [rehydrated, rootStore])

  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <RootStoreProvider value={rootStore}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <GestureHandlerRootView style={$container}>
            <PushNotificationHandler />
            <AppNavigator
              linking={linking}
              initialState={initialNavigationState}
              onStateChange={onNavigationStateChange}
            />
          </GestureHandlerRootView>
        </ErrorBoundary>
      </RootStoreProvider>
      <Toast />
    </SafeAreaProvider>
  )
}

export default App

const $container: ViewStyle = {
  flex: 1,
}
