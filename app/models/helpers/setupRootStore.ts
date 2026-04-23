/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreSnapshot } from "../RootStore"
import * as storage from "../../utils/storage"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root-v1"

/**
 * Setup the root state.
 */
let _disposer: IDisposer | undefined
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null

  try {
    // load the last known state from AsyncStorage
    restoredState = ((await storage.load(ROOT_STATE_STORAGE_KEY)) ?? {}) as RootStoreSnapshot
    // #region agent log
    fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H5", location: "setupRootStore.ts:restored", message: "restored root snapshot loaded", data: { hasSnapshot: !!restoredState, hasCategoryStore: !!restoredState?.categoryStore, hasAuthStore: !!restoredState?.authenticationStore }, timestamp: Date.now() }) }).catch(() => {})
    // #endregion
    const snapshotToApply = {
      ...(restoredState ?? {}),
      authenticationStore: restoredState?.authenticationStore ?? {},
      categoryStore: {
        items: restoredState?.categoryStore?.items ?? [],
        // Không persist trạng thái loading để tránh kẹt spinner sau khi app restart.
        isLoading: false,
        // Ép fetch lại sau khi mở app để dữ liệu luôn fresh.
        isLoaded: false,
      },
    } as RootStoreSnapshot
    // #region agent log
    fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H5", location: "setupRootStore.ts:apply", message: "applying normalized root snapshot", data: { categoryItemsCount: snapshotToApply.categoryStore?.items?.length ?? 0, categoryIsLoading: snapshotToApply.categoryStore?.isLoading ?? null, categoryIsLoaded: snapshotToApply.categoryStore?.isLoaded ?? null }, timestamp: Date.now() }) }).catch(() => {})
    // #endregion
    applySnapshot(rootStore, snapshotToApply)
  } catch (e) {
    // #region agent log
    fetch("http://127.0.0.1:7942/ingest/6b989365-f233-4ed8-9075-a0afcb68671f", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "1209eb" }, body: JSON.stringify({ sessionId: "1209eb", runId: "initial", hypothesisId: "H5", location: "setupRootStore.ts:catch", message: "setupRootStore failed", data: { errorName: e instanceof Error ? e.name : "UnknownError", errorMessage: e instanceof Error ? e.message : "unknown" }, timestamp: Date.now() }) }).catch(() => {})
    // #endregion
    // if there's any problems loading, then inform the dev what happened
    if (__DEV__) {
      if (e instanceof Error) console.error(e.message)
    }
  }

  // stop tracking state changes if we've already setup
  if (_disposer) _disposer()

  // track changes & save to AsyncStorage
  _disposer = onSnapshot(rootStore, (snapshot) => storage.save(ROOT_STATE_STORAGE_KEY, snapshot))

  const unsubscribe = () => {
    _disposer?.()
    _disposer = undefined
  }

  return { rootStore, restoredState, unsubscribe }
}
