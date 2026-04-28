import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
  })
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },

    logout() {
      store.authToken = undefined
    },
  }))
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}