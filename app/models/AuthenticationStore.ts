import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    // Khai báo biến authToken kiểu chuỗi (string), có thể trống (maybe)
    authToken: types.maybe(types.string),
  })
  .actions((store) => ({
    // Hàm để lưu token vào store
    setAuthToken(value?: string) {
      store.authToken = value
    },
    // Hàm đăng xuất (xóa token)
    logout() {
      store.authToken = undefined
    },
  }))
  .views((store) => ({
    // Biến kiểm tra xem đã đăng nhập chưa (có token là đã đăng nhập)
    get isAuthenticated() {
      return !!store.authToken
    },
  }))

// Bỏ qua lỗi TypeScript bằng cách export các type
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}