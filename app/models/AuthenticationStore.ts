import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    logout() {
      // Dung setProp de tan dung helper co san, tranh lap setter 1 dong.
      store.setProp("authToken", undefined)
    },
  }))
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
