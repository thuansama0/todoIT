import { flow, Instance, SnapshotOut, types } from "mobx-state-tree"
import { UpdateUserPayload, userApi } from "app/services/api/userApi"
import { withSetPropAction } from "./helpers/withSetPropAction"

const ProfileModel = types.model("Profile", {
  id: types.identifier,
  email: types.string,
  name: types.string,
  imageUrl: types.maybeNull(types.string),
  accessToken: types.maybeNull(types.string),
  pushToken: types.maybeNull(types.string),
})

function toProfileSnapshot(input: {
  id: string
  email?: string
  name?: string
  imageUrl?: string | null
  accessToken?: string | null
  pushToken?: string | null
}) {
  return {
    id: input.id,
    email: input.email ?? "",
    name: input.name ?? "",
    imageUrl: input.imageUrl ?? null,
    accessToken: input.accessToken ?? null,
    pushToken: input.pushToken ?? null,
  }
}

export const ProfileStoreModel = types
  .model("ProfileStore")
  .props({
    profile: types.maybe(ProfileModel),
    isLoading: types.optional(types.boolean, false),
    isLoaded: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .actions((store) => {
    const fetchProfile = flow(function* fetchProfile() {
      store.isLoading = true
      try {
        const response = yield userApi.getMe()
        if (response.ok && response.data?.success && response.data.data) {
          store.profile = toProfileSnapshot(response.data.data)
          store.isLoaded = true
        }
        return response
      } finally {
        store.isLoading = false
      }
    })

    const loadIfNeeded = flow(function* loadIfNeeded() {
      if (store.isLoaded || store.isLoading) return
      yield fetchProfile()
    })

    const updateProfile = flow(function* updateProfile(payload: UpdateUserPayload) {
      const backup = store.profile
        ? {
            id: store.profile.id,
            email: store.profile.email,
            name: store.profile.name,
            imageUrl: store.profile.imageUrl,
            accessToken: store.profile.accessToken,
            pushToken: store.profile.pushToken,
          }
        : undefined

      if (store.profile) {
        store.profile = toProfileSnapshot({
          ...toProfileSnapshot(store.profile),
          ...(payload.name !== undefined ? { name: payload.name } : {}),
          ...(payload.email !== undefined ? { email: payload.email } : {}),
          ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
        })
      }

      const response = yield userApi.updateProfile(payload)
      if (!response.ok || !response.data?.success) {
        if (backup) store.profile = toProfileSnapshot(backup)
      } else if (response.data.data) {
        store.profile = toProfileSnapshot(response.data.data)
      }
      return response
    })

    const deleteAccount = flow(function* deleteAccount() {
      const response = yield userApi.deleteAccount()
      if (response.ok && response.data?.success) {
        store.profile = undefined
        store.isLoaded = false
      }
      return response
    })

    const clearProfile = () => {
      store.profile = undefined
      store.isLoaded = false
      store.isLoading = false
    }

    return { fetchProfile, loadIfNeeded, updateProfile, deleteAccount, clearProfile }
  })

export interface ProfileStore extends Instance<typeof ProfileStoreModel> {}
export interface ProfileStoreSnapshot extends SnapshotOut<typeof ProfileStoreModel> {}
