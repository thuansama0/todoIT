import type { NavigationProps } from "../navigators/AppNavigator"

let rootStoreRehydratedInSession = false
let navigationRestoredInSession = false
let appNavigatorMountedInSession = false
let splashHiddenInSession = false
let cachedNavigationState: NavigationProps["initialState"] | undefined

export function isRootStoreRehydratedInSession() {
  return rootStoreRehydratedInSession
}

export function markRootStoreRehydratedInSession() {
  rootStoreRehydratedInSession = true
}

export function getNavigationSessionCache() {
  return {
    restored: navigationRestoredInSession,
    state: cachedNavigationState,
  }
}

export function markNavigationRestoredInSession(state?: NavigationProps["initialState"]) {
  navigationRestoredInSession = true
  if (state !== undefined) {
    cachedNavigationState = state
  }
}

export function hasAppNavigatorMountedInSession() {
  return appNavigatorMountedInSession
}

export function markAppNavigatorMountedInSession() {
  appNavigatorMountedInSession = true
}

export function consumeSplashHideRequest() {
  if (splashHiddenInSession) return false
  splashHiddenInSession = true
  return true
}
