import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { CategoryStoreModel } from "./CategoryStore"
import { NotificationStoreModel } from "./NotificationStore"
import { ProfileStoreModel } from "./ProfileStore"
import { TodoStoreModel } from "./TodoStore"
/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  categoryStore: types.optional(CategoryStoreModel, {}),
  todoStore: types.optional(TodoStoreModel, {}),
  notificationStore: types.optional(NotificationStoreModel, {}),
  profileStore: types.optional(ProfileStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
