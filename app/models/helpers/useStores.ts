import { createContext, useContext, useEffect, useState } from "react"
import { RootStore, RootStoreModel } from "../RootStore"
import { setupRootStore } from "./setupRootStore"
import {
  isRootStoreRehydratedInSession,
  markRootStoreRehydratedInSession,
} from "../../utils/appSession"

const _rootStore = RootStoreModel.create({})

const RootStoreContext = createContext<RootStore>(_rootStore)

export const RootStoreProvider = RootStoreContext.Provider

export const useStores = () => useContext(RootStoreContext)

export const useInitialRootStore = (callback?: () => void | Promise<void>) => {
  const rootStore = useStores()
  const [rehydrated, setRehydrated] = useState(isRootStoreRehydratedInSession())

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (isRootStoreRehydratedInSession()) {
        await setupRootStore(rootStore, { skipRestore: true })
        if (!cancelled) setRehydrated(true)
        if (callback) await callback()
        return
      }

      await setupRootStore(rootStore)
      markRootStoreRehydratedInSession()

      if (__DEV__) {
        console.tron.trackMstNode(rootStore)
      }

      if (!cancelled) setRehydrated(true)
      if (callback) await callback()
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return { rootStore, rehydrated }
}
