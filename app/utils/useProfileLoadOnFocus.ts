import { useEffect } from "react"
import type { ProfileStore } from "app/models/ProfileStore"

export function useProfileLoadOnFocus(isFocused: boolean, profileStore: ProfileStore) {
  useEffect(() => {
    if (isFocused) {
      profileStore.loadIfNeeded()
    }
  }, [isFocused, profileStore])
}
