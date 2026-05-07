# todoIT - Tài liệu kỹ thuật chi tiết để demo

`todoIT` là ứng dụng quản lý công việc cá nhân viết bằng React Native + Expo, theo kiến trúc tách lớp rõ ràng:

- `screens`: hiển thị UI + điều phối hành vi người dùng
- `models` (MobX-State-Tree): giữ state và xử lý nghiệp vụ
- `services/api`: giao tiếp backend
- `utils`: xử lý nền (storage, reminder, notification)
- `components`: thư viện UI tái sử dụng

Tài liệu này tập trung vào:

1. Dự án dùng thư viện nào và dùng để làm gì  
2. Luồng hoạt động từ lúc app mở đến khi user thao tác  
3. Mỗi file chính đảm nhiệm chức năng gì  
4. Hàm nào là hàm quan trọng trong từng flow  
5. Component nào đang được tái sử dụng sau refactor

---

## 1. Tổng quan chức năng sản phẩm

App có các module chính:

- **Auth**: đăng nhập/đăng ký
- **Todo**: tạo, sửa, xóa, đổi trạng thái hoàn thành, xem chi tiết
- **Category**: tạo/sửa/xóa danh mục
- **Notification**: nhận, đọc, xóa thông báo
- **Profile**: xem/cập nhật thông tin người dùng, xóa tài khoản
- **Reminder**: nhắc việc local theo giờ hẹn của Todo

Các kỹ thuật nổi bật:

- Local cache sau khi đóng/mở app
- Optimistic UI (phản hồi nhanh trước khi API xong)
- Rollback khi API lỗi
- Tái sử dụng component/screen logic để giảm duplicate code

---

## 2. Tech stack và vai trò từng thư viện

## 2.1 Nhóm nền tảng

- `react-native`: xây dựng ứng dụng mobile đa nền tảng
- `expo`: runtime + tích hợp native module dễ dàng
- `typescript`: kiểm tra kiểu dữ liệu, giảm lỗi runtime

## 2.2 Nhóm điều hướng

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`

Vai trò:

- Điều hướng Stack (màn hình sâu)
- Điều hướng Tab (4 tab chính)
- Hỗ trợ navigation ref để điều hướng từ notification listener

## 2.3 Nhóm quản lý state

- `mobx`
- `mobx-state-tree`
- `mobx-react-lite`

Vai trò:

- Tạo store theo domain (`TodoStore`, `CategoryStore`, ...)
- Quản lý state tập trung
- Dùng `flow` cho async action
- Tự động cập nhật UI qua `observer`

## 2.4 Nhóm gọi API

- `apisauce`

Vai trò:

- Tạo API client tại `app/services/api/api.ts`
- Chuẩn hóa response `ok`, `problem`, `data`
- Tách endpoint theo module (`authApi`, `todoApi`, ...)

## 2.5 Nhóm local storage và cache

- `@react-native-async-storage/async-storage` (qua helper `app/utils/storage`)

Vai trò:

- Persist root store snapshot
- Lưu access token
- Lưu mapping reminder/notification local

## 2.6 Nhóm notification

- `expo-notifications`
- `expo-device`
- `expo-constants`
- `react-native-toast-message`

Vai trò:

- Xin quyền notification
- Lấy Expo push token
- Schedule local reminder
- Lắng nghe notification khi foreground/background
- Hiện toast khi app đang mở

## 2.7 Nhóm UI/UX hỗ trợ

- `@shopify/flash-list` (bọc qua `ListView`): list hiệu năng cao
- `@expo/vector-icons`: icon
- `react-native-safe-area-context`: xử lý safe area
- `react-native-gesture-handler`: gesture root
- `expo-image-picker`: chọn/chụp ảnh trong Profile

---

## 3. Kiến trúc thư mục và trách nhiệm

```text
app/
├── app.tsx                  # Khởi động app, provider, navigator, push hook
├── components/              # Component UI tái sử dụng
├── config/                  # Config môi trường
├── models/                  # MST stores theo domain
├── navigators/              # App stack + Tab navigator + navigation ref
├── screens/                 # Màn hình người dùng thao tác
├── services/api/            # API module theo domain
├── theme/                   # Design tokens
└── utils/                   # Helper nghiệp vụ nền
```

Nguyên tắc tổ chức:

- `screen` không xử lý logic backend phức tạp, ưu tiên gọi `store action`
- `store` là lớp nghiệp vụ chính (optimistic, rollback, merge local/server)
- `api` chỉ làm nhiệm vụ gọi endpoint
- `utils` gom các xử lý hạ tầng hoặc cross-module

---

## 4. Luồng khởi động ứng dụng (App bootstrap)

File trung tâm: `app/app.tsx`

Luồng hoạt động:

1. Load i18n, warning config, fonts.
2. Gọi `useInitialRootStore()` để rehydrate dữ liệu từ local.
3. Gọi `useNavigationPersistence()` để khôi phục state navigation.
4. Bọc app bởi:
   - `SafeAreaProvider`
   - `RootStoreProvider`
   - `ErrorBoundary`
   - `GestureHandlerRootView`
5. Mount `PushNotificationHandler` (gọi `usePushNotifications()`).
6. Render `AppNavigator`.
7. Mount `Toast` global.

Kết quả:

- App khởi động với dữ liệu gần nhất
- Notification listener có sẵn ngay từ đầu
- Điều hướng có thể khôi phục trạng thái cũ

---

## 5. Navigation chi tiết

## 5.1 Stack navigator

File: `app/navigators/AppNavigator.tsx`

`AppStackParamList` khai báo type-safe route params:

- `Login`
- `SignUp`
- `MainTabs`
- `NewTodo`
- `TodoDetail`
- `NewCategory`
- `EditCategory`
- `EditTodo`
- `NotificationDetail`

Vai trò chính:

- Tạo stack bằng `createNativeStackNavigator`
- Tắt header mặc định để dùng header custom
- Dùng `navigationRef` cho navigation ngoài screen context

## 5.2 Tab navigator

File: `app/navigators/TabNavigator.tsx`

Tabs:

- `Categories`
- `Todo`
- `Notifications`
- `Profile`

Vai trò:

- Định nghĩa icon theo route bằng `Ionicons`
- Tùy biến style thanh tab
- Quy định tab mặc định là `Todo`

---

## 6. State management (MST) theo store

## 6.1 AuthenticationStore

File: `app/models/AuthenticationStore.ts`

State:

- `authToken`

Hàm chính:

- `setAuthToken(value?)`: set token
- `logout()`: clear token
- `isAuthenticated` (view): kiểm tra trạng thái đăng nhập

## 6.2 TodoStore

File: `app/models/TodoStore.ts`

State:

- `items`
- `isLoading`
- `isLoaded`

Hàm chính:

- `fetchTodos()`: lấy danh sách todo từ API
- `loadIfNeeded()`: lazy load nếu chưa load
- `createTodo(payload, reminderMinutes)`: optimistic create
- `syncCreateTodoInBackground(tempId, payload, reminderMinutes)`: đồng bộ item tạm với server
- `updateTodo(id, payload, reminderMinutes)`: optimistic update + rollback
- `toggleTodoStatus(id, newStatus)`: optimistic toggle + rollback
- `deleteTodo(id)`: optimistic delete + rollback

Điểm kỹ thuật quan trọng:

- Dùng `temp-<timestamp>` cho item tạo mới local
- Khi server trả id thật thì replace temp item
- Gắn/hủy reminder theo từng thao tác create/update/delete
- Dùng `toPlainTodo()` để tránh lỗi detached node của MST

## 6.3 CategoryStore

File: `app/models/CategoryStore.ts`

State:

- `items`
- `isLoading`
- `isLoaded`

View:

- `sortedItems`: sort theo tên

Hàm chính:

- `fetchCategories()`
- `loadIfNeeded()`
- `createCategory(name, isPublic)` (optimistic + fetch sync)
- `updateCategory(id, name, isPublic)` (optimistic + rollback)
- `deleteCategory(id)`

## 6.4 NotificationStore

File: `app/models/NotificationStore.ts`

State:

- `items`
- `unreadCount`
- `isLoading`
- `isLoaded`

Hàm chính:

- `fetchNotifications()`: gọi song song list + unread count, merge local/server
- `loadIfNeeded()`
- `markRead(id)` / `markAllRead()`
- `deleteNotification(id)` / `deleteAllNotifications()`
- `addLocalNotification(title, content, sentAtMs?)`
- `addIncomingNotification(title, content, userId?, sentAtMs?)`

Điểm kỹ thuật quan trọng:

- Dùng `Map` để merge dữ liệu không trùng id
- Có dedupe notification gần nhau theo thời gian
- Nếu là notification local (`id` bắt đầu bằng `local-`) thì ưu tiên thao tác local log

## 6.5 ProfileStore

File: `app/models/ProfileStore.ts`

State:

- `profile`
- `isLoading`
- `isLoaded`

Hàm chính:

- `fetchProfile()`
- `loadIfNeeded()`
- `updateProfile(payload)` (optimistic + rollback)
- `deleteAccount()`
- `clearProfile()`

---

## 7. API layer theo file và theo hàm

## 7.1 `authApi.ts`

- `signIn(email, password)` -> `POST /auth/sign-in`
- `signUp(email, password, name)` -> `POST /auth/sign-up`
- `signOut()` -> `POST /auth/sign-out`

## 7.2 `todoApi.ts`

- `getTodos(page, size)` -> `GET /todo/all`
- `createTodo(payload)` -> `POST /todo`
- `getTodoById(id)` -> `GET /todo/{id}`
- `toggleTodoStatus(id, isCompleted)` -> `PATCH /todo/{id}/toggle-completed`
- `deleteTodo(id)` -> `DELETE /todo/{id}`
- `updateTodo(id, payload)` -> `PUT /todo/{id}`

## 7.3 `categoryApi.ts`

- `getCategories()` -> `GET /category/all`
- `createCategory(name, isPublic)` -> `POST /category`
- `updateCategory(id, name, isPublic)` -> `PUT /category/{id}`
- `deleteCategory(id)` -> `DELETE /category/{id}`

## 7.4 `notificationApi.ts`

- `getNotifications(page, size)` -> `GET /notification/all`
- `getUnreadCount()` -> `GET /notification/unread-count`
- `createNotification(payload)` -> `POST /notification`
- `markAsRead(id)` -> `PATCH /notification/mark-read/{id}`
- `markAllAsRead()` -> `PATCH /notification/mark-read/all`
- `deleteNotification(id)` -> `DELETE /notification/{id}`
- `deleteAllNotifications()` -> `DELETE /notification/all`

## 7.5 `userApi.ts`

- `getMe()` -> `GET /user/me`
- `getUserById(id)` -> `GET /user/{id}`
- `updateProfile(payload)` -> `PUT /user`
- `deleteAccount()` -> `DELETE /user`
- `updatePushToken(pushToken, accessToken?)` -> `PATCH /user/update-push-token`

---

## 8. Luồng chức năng theo màn hình (screen flow)

## 8.1 Auth flow

File chính:

- `app/screens/LoginScreen/LoginScreen.tsx`
- `app/screens/SignUpScreen/SignUpScreen.tsx`
- `app/utils/completeAuthSession.ts`

### Login

Hàm chính:

- `onLogin()`

Flow:

1. Validate email/password không rỗng
2. Gọi `authApi.signIn`
3. Thành công -> lấy `accessToken`
4. Gọi `completeAuthSession(authenticationStore, navigation, accessToken)`
5. Điều hướng vào `MainTabs`

### SignUp

Hàm chính:

- `onSignUp()`

Flow tương tự login:

1. Validate name/email/password
2. Gọi `authApi.signUp`
3. Thành công -> `completeAuthSession(...)`

## 8.2 Todo flow

File chính:

- `TodoScreen.tsx`
- `TodoFormScreen.tsx` (reusable)
- `NewTodoScreen.tsx` (wrapper create)
- `EditTodoScreen.tsx` (wrapper edit)
- `TodoDetailScreen.tsx`

### Danh sách Todo (`TodoScreen`)

Hàm chính:

- `todoStore.loadIfNeeded()` trong `useEffect`
- `handleToggleStatus(id, currentStatus)`
- `handleDelete(id)`

UI tái sử dụng:

- `AppSectionHeader`
- `ListView`
- `TodoItem`

### Form Todo tái sử dụng (`TodoFormScreen`)

Props:

- `{ mode: "create" }`
- `{ mode: "edit"; initialTodo }`

Hàm chính:

- `handleToggleDueDate(value)`
- `handleSubmit()`
- `parseDateTime(value)`

Tính năng:

- Input title/notes
- Bật/tắt due date
- Chọn mức reminder (`0, 5, 15, 30, 60`)
- Chọn category dropdown
- Submit theo mode create/edit

### Wrapper screens

- `NewTodoScreen`: render duy nhất `<TodoFormScreen mode="create" />`
- `EditTodoScreen`: render duy nhất `<TodoFormScreen mode="edit" initialTodo={...} />`

Đây là phần refactor quan trọng nhất giúp tái sử dụng logic.

## 8.3 Category flow

File chính:

- `CategoriesScreen.tsx`
- `NewCategoryScreen.tsx`
- `EditCategoryScreen.tsx`

Hàm chính:

- `CategoriesScreen`: `handleDelete(id)`
- `NewCategoryScreen`: `handleCreateCategory()`
- `EditCategoryScreen`: `handleSaveChanges()`, `handleDelete()`

UI tái sử dụng:

- `AppSectionHeader`
- `ListView`
- `CategoryItem`
- `Button`, `TextField`

## 8.4 Notification flow

File chính:

- `NotificationsScreen.tsx`
- `NotificationDetailScreen.tsx`
- `usePushNotifications.ts`

`NotificationsScreen`:

- `handleMarkAllRead()`
- `handleDeleteAll()`
- `handleMarkRead(id)`
- `handleDelete(id)`

UI tái sử dụng:

- `AppSectionHeader`
- `ListView`
- `NotificationItem`

## 8.5 Profile flow

File chính:

- `ProfileScreen.tsx`

Hàm chính:

- `handleStartEdit()`
- `handleCancelEdit()`
- `pickImageFromLibrary()`
- `takePhoto()`
- `handleChangePhoto()`
- `handleSaveProfile()`
- `handleDeleteAccount()`
- `handleSignOut()`

Thư viện dùng trực tiếp:

- `expo-image-picker` cho avatar

---

## 9. Notification và reminder - phần quan trọng khi demo

## 9.1 Hook điều phối notification toàn app

File: `app/utils/usePushNotifications.ts`

Hàm chính:

- `usePushNotifications()`: đăng ký listener và xử lý response
- `syncExpoPushTokenWithServer(accessToken?)`: đồng bộ push token
- `ensureNotificationPermissionsAsync()`: xin quyền notification
- `registerForPushNotificationsAsync()`: lấy Expo token

Hàm xử lý logic sâu:

- `resolveNotificationText(notification)`: suy luận title/body từ nhiều nguồn
- `pushIncomingReminder(notification)`: đẩy notification vào store + dedupe
- `navigateToNotificationsTab()`: điều hướng về tab notification
- `shouldHandleNotificationResponse(response)`: lọc response rác/phantom

## 9.2 Reminder local cho Todo

File: `app/utils/todoReminder.ts`

Hàm chính:

- `scheduleTodoReminder({ todoId, title, dueDate, reminderMinutes })`
- `cancelTodoReminder(todoId)`
- `loadTodoReminderMinutesMap()`
- `getReminderPayloadByNotificationId(notificationId)`
- `getNearestReminderPayload(nowMs, maxDeltaMs)`
- `formatLeadTime(minutes)`

Dữ liệu local được lưu:

- `todoId -> notificationId`
- `todoId -> reminderMinutes`
- `notificationId -> { displayTitle, displayBody, fireAtMs }`

## 9.3 Log notification local

File: `app/utils/localNotificationLog.ts`

Hàm chính:

- `loadLocalNotificationLog()`
- `appendLocalNotificationLog(input)`
- `markLocalNotificationAsRead(id)`
- `deleteLocalNotification(id)`
- `clearLocalNotifications()`

Mục đích:

- Nếu notification local/push có tình huống bất ổn, vẫn giữ lịch sử local để hiển thị trong app.

---

## 10. Reusable component map (để demo phần refactor)

File export trung tâm: `app/components/index.ts`

Component tái sử dụng chính:

- `Screen`: khung màn hình chuẩn
- `AppSectionHeader`: header đồng nhất (title/subtitle/refresh/left icon)
- `Button`: nút chuẩn style toàn app
- `Text`, `TextField`: typography + input chuẩn
- `ListView`: danh sách chung cho Todo/Category/Notification
- `TodoItem`: card item todo với action toggle/edit/delete
- `CategoryItem`: item category với action edit/delete
- `NotificationItem`: item notification với action mark read/delete

Kết quả của cách làm này:

- UI đồng nhất
- Dễ thay đổi global style
- Giảm thời gian tạo màn hình mới

---

## 11. Bảng mapping "Thư viện -> Chức năng thực tế"

- `mobx-state-tree` -> `TodoStore.createTodo`, `TodoStore.updateTodo`, `NotificationStore.fetchNotifications`, `ProfileStore.updateProfile`
- `apisauce` -> toàn bộ hàm trong `authApi`, `todoApi`, `categoryApi`, `notificationApi`, `userApi`
- `expo-notifications` -> `scheduleTodoReminder`, `usePushNotifications`
- `react-native-toast-message` -> hiện toast trong listener `addNotificationReceivedListener`
- `@shopify/flash-list` (qua `ListView`) -> render list tại `TodoScreen`, `CategoriesScreen`, `NotificationsScreen`
- `expo-image-picker` -> `ProfileScreen.pickImageFromLibrary`, `ProfileScreen.takePhoto`
- `react-navigation` -> `AppNavigator`, `TabNavigator`, route typed trong `AppStackParamList`
- `AsyncStorage` (qua storage helper) -> persist root store + notification/reminder map

---

## 12. Điểm kỹ thuật nổi bật để trình bày với sếp

1. **Refactor tái sử dụng screen logic**
   - Gộp create/edit todo vào `TodoFormScreen`
   - Wrapper mỏng (`NewTodoScreen`, `EditTodoScreen`)

2. **Trải nghiệm nhanh nhờ optimistic UI**
   - Người dùng thấy dữ liệu đổi ngay
   - Backend sync chạy sau
   - Có rollback khi lỗi

3. **Thiết kế module rõ ràng**
   - UI (`screens/components`) tách khỏi business logic (`models`)
   - API layer tách độc lập

4. **Xử lý notification thực tế**
   - Có dedupe
   - Có fallback local log
   - Có recovery cho lịch local bị miss

5. **Type-safe và dễ bảo trì**
   - Type route params
   - Type response API
   - Type model state

---

## 13. Hạn chế hiện tại và hướng nâng cấp

1. Reminder local có thể bị chặn khi app bị kill trên một số OEM Android.
2. Để đảm bảo tuyệt đối, cần backend scheduler + push server-side.
3. Flow Sign Out ở `ProfileScreen` hiện reset navigation; có thể mở rộng thêm gọi `authApi.signOut` + clear token/store đồng bộ.

---

## 14. Scripts dùng trong quá trình phát triển

```bash
npm run compile
npm run lint
npm run test
npm run start
npm run start:dev
npm run android
npm run ios
```

Build EAS local:

```bash
npm run build:android:dev
npm run build:android:prod
npm run build:ios:dev
npm run build:ios:prod
```

---

## 15. Kịch bản demo gợi ý (5-7 phút)

1. **Mở app** -> nói về bootstrap + store rehydrate.
2. **Đăng nhập** -> nói về `authApi.signIn` và `completeAuthSession`.
3. **Vào Todo**:
   - tạo mới (mode create)
   - sửa todo (mode edit)
   - nhấn mạnh dùng chung `TodoFormScreen`.
4. **Vào Category** -> tạo/xóa category, nói optimistic UI.
5. **Vào Notifications** -> mark read/delete.
6. **Vào Profile** -> sửa tên/email, đổi ảnh.
7. Kết luận:
   - kiến trúc tách lớp rõ
   - component tái sử dụng tốt
   - sẵn sàng mở rộng tính năng.
