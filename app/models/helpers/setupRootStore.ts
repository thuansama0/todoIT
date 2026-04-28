/* @refresh reset */
import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree"
import { RootStore, RootStoreSnapshot } from "../RootStore"
import * as storage from "../../utils/storage"

const ROOT_STATE_STORAGE_KEY = "root-v1"

let _disposer: IDisposer | undefined
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null

  try {
    restoredState = ((await storage.load(ROOT_STATE_STORAGE_KEY)) ?? {}) as RootStoreSnapshot
    const snapshotToApply = {
      ...(restoredState ?? {}),
      authenticationStore: restoredState?.authenticationStore ?? {},
      categoryStore: {
        items: restoredState?.categoryStore?.items ?? [],
        isLoading: false,
        isLoaded: false,
      },
      todoStore: {
        items: restoredState?.todoStore?.items ?? [],
        isLoading: false,
        isLoaded: false,
      },
      notificationStore: {
        items: restoredState?.notificationStore?.items ?? [],
        unreadCount: restoredState?.notificationStore?.unreadCount ?? 0,
        isLoading: false,
        isLoaded: false,
      },
      profileStore: {
        profile: restoredState?.profileStore?.profile,
        isLoading: false,
        isLoaded: !!restoredState?.profileStore?.profile,
      },
    } as RootStoreSnapshot
    applySnapshot(rootStore, snapshotToApply)
  } catch (e) {
    if (__DEV__) {
      if (e instanceof Error) console.error(e.message)
    }
  }

  if (_disposer) _disposer()

  _disposer = onSnapshot(rootStore, (snapshot) => storage.save(ROOT_STATE_STORAGE_KEY, snapshot))

  const unsubscribe = () => {
    _disposer?.()
    _disposer = undefined
  }

  return { rootStore, restoredState, unsubscribe }
}
