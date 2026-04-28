# todoIT

`todoIT` là ứng dụng quản lý công việc cá nhân được xây dựng bằng React Native + Expo. App hỗ trợ đăng nhập/đăng ký, quản lý Todo, Category, Profile, Notification, local cache, optimistic UI và nhắc việc bằng local notification.

## Công Nghệ Chính

- `React Native`: xây dựng giao diện mobile.
- `Expo`: chạy, build và tích hợp các module native như notification, device, constants.
- `TypeScript`: kiểm tra kiểu dữ liệu và giảm lỗi runtime.
- `Ignite`: bộ khung project, cấu trúc thư mục và generator template.
- `React Navigation`: điều hướng Stack + Bottom Tabs.
- `MobX-State-Tree`: quản lý state tập trung cho Todo, Category, Notification, Profile, Auth.
- `AsyncStorage`: lưu cache local thông qua helper `app/utils/storage`.
- `apisauce`: gọi REST API.
- `expo-notifications`: push/local notification, lấy push token, schedule reminder.
- `react-native-toast-message`: hiển thị toast khi app đang active.
- `@expo/vector-icons`: icon UI.
- `react-native-safe-area-context`, `react-native-screens`, `react-native-gesture-handler`: nền tảng navigation/UI mobile.

## Cấu Trúc Thư Mục

```text
app/
├── app.tsx                  # Entry app, RootStoreProvider, Toast, push notification hook
├── components/              # Component dùng chung
├── config/                  # API URL và config môi trường
├── models/                  # MobX-State-Tree stores
├── navigators/              # App stack + bottom tab navigation
├── screens/                 # Màn hình chức năng
├── services/api/            # API clients
├── theme/                   # Colors, spacing, typography
└── utils/                   # Storage, notification, reminder helpers
```

## Luồng Khởi Động App

1. `app/app.tsx` gọi `useInitialRootStore()` để khởi tạo MST root store.
2. `setupRootStore.ts` load snapshot từ storage để phục hồi cache local.
3. `RootStoreProvider` bọc toàn app để các màn hình dùng `useStores()`.
4. `AppNavigator` dựng Stack navigation.
5. `TabNavigator` hiển thị 4 tab chính: `Categories`, `Todos`, `Notifications`, `Profile`.
6. `usePushNotifications()` đăng ký push token, listener nhận notification và xử lý điều hướng khi bấm notification.

## Luồng Đăng Nhập / Đăng Ký

Màn hình chính:

- `LoginScreen`
- `SignUpScreen`

Luồng hoạt động:

1. Người dùng nhập thông tin đăng nhập hoặc đăng ký.
2. App gọi API trong `app/services/api/authApi.ts`.
3. Nếu thành công, `accessToken` được lưu vào `AuthenticationStore`.
4. API client trong `app/services/api/api.ts` tự gắn token vào header `Authorization`.
5. App điều hướng vào `MainTabs`.

Thư viện liên quan:

- `apisauce`: gọi API auth.
- `mobx-state-tree`: lưu token trong store.
- `AsyncStorage`: persist token qua `setupRootStore`.
- `React Navigation`: điều hướng sau login/signup.

## Luồng Todo

Màn hình chính:

- `TodoScreen`
- `NewTodoScreen`
- `EditTodoScreen`
- `TodoDetailScreen`

Store/API:

- `app/models/TodoStore.ts`
- `app/services/api/todoApi.ts`
- `app/utils/todoReminder.ts`

Luồng tải danh sách:

1. `TodoScreen` gọi `todoStore.loadIfNeeded()`.
2. Nếu store chưa có data, `TodoStore.fetchTodos()` gọi `todoApi.getTodos()`.
3. Data được normalize rồi lưu vào `todoStore.items`.
4. UI đọc trực tiếp từ `todoStore.items`.

Luồng tạo Todo:

1. Người dùng nhập title, content, category, due date và reminder.
2. `NewTodoScreen` gọi `todoStore.createTodo(payload, reminderMinutes)`.
3. Store thêm Todo tạm vào local ngay để UI hiện liền (optimistic UI).
4. API tạo Todo chạy nền.
5. Khi API trả về Todo thật, store đổi `tempId` thành `id` thật.
6. Nếu có reminder, app schedule local notification.

Luồng sửa Todo:

1. `EditTodoScreen` nhận plain todo data từ navigation.
2. Người dùng sửa thông tin.
3. `todoStore.updateTodo()` cập nhật UI trước.
4. API cập nhật chạy sau.
5. Nếu API lỗi, store rollback dữ liệu cũ.

Luồng xóa Todo:

1. Người dùng bấm xóa ở `TodoScreen` hoặc `TodoDetailScreen`.
2. Store remove item khỏi local trước để UI phản hồi nhanh.
3. App hủy reminder local nếu Todo có reminder.
4. API xóa chạy sau.
5. Nếu API lỗi, store rollback list từ snapshot.

Lưu ý kỹ thuật:

- Không truyền trực tiếp MST node qua navigation. App chuyển Todo sang plain object trước khi qua `EditTodoScreen` để tránh lỗi detached node.
- `deleteTodo()` dùng snapshot plain object để tránh đọc node đã bị xóa khỏi MST tree.

## Luồng Category

Màn hình chính:

- `CategoriesScreen`
- `NewCategoryScreen`
- `EditCategoryScreen`

Store/API:

- `app/models/CategoryStore.ts`
- `app/services/api/categoryApi.ts`

Luồng hoạt động:

1. `CategoriesScreen` gọi `categoryStore.loadIfNeeded()`.
2. Store gọi API lấy danh sách category.
3. Tạo/sửa/xóa category dùng optimistic UI.
4. Nếu API fail, store rollback lại dữ liệu trước đó.

Validation:

- Tên category được trim.
- App kiểm tra trùng tên local trước khi gọi API để tránh lỗi `Category already exists`.

## Luồng Notifications

Màn hình chính:

- `NotificationsScreen`
- `NotificationDetailScreen`

Store/API/Utils:

- `app/models/NotificationStore.ts`
- `app/services/api/notificationApi.ts`
- `app/utils/localNotificationLog.ts`
- `app/utils/usePushNotifications.ts`

Luồng tải notification:

1. `NotificationsScreen` gọi `notificationStore.fetchNotifications()` khi focus.
2. Store gọi API `/notification/all` và `/notification/unread-count`.
3. Store merge notification từ backend với local notification log.
4. Danh sách được sort theo `sentAt` mới nhất.

Luồng nhận push notification:

1. `usePushNotifications()` đăng ký listener qua `expo-notifications`.
2. Nếu app active, app hiển thị toast bằng `react-native-toast-message`.
3. Nếu user bấm notification, app điều hướng tới tab `Notifications`.
4. Notification được lưu vào `NotificationStore`.

Luồng local notification log:

1. Local reminder hoặc push fallback được lưu bằng `appendLocalNotificationLog()`.
2. Log được lưu vào AsyncStorage.
3. `NotificationStore.fetchNotifications()` merge local log vào danh sách.

## Luồng Nhắc Việc Todo Reminder

File chính:

- `app/utils/todoReminder.ts`
- `app/utils/usePushNotifications.ts`
- `app/models/TodoStore.ts`

Khi tạo Todo có reminder:

1. App tính `triggerAt = dueDate - reminderMinutes`.
2. App gọi `Notifications.scheduleNotificationAsync()`.
3. Nội dung notification:
   - `title`: `Nhắc việc: <Tên Todo>`
   - `body`: `Còn n phút/giờ nữa đến lịch của bạn`
4. App lưu mapping local:
   - `todoId -> notificationId`
   - `todoId -> reminderMinutes`
   - `notificationId -> displayTitle/displayBody/fireAtMs`

Khi sửa/xóa Todo:

1. App hủy reminder cũ bằng `cancelScheduledNotificationAsync()`.
2. Nếu vẫn còn reminder, app schedule lại bằng thông tin mới.

Giới hạn Android cần biết:

- Local scheduled notification có thể không bắn system notification nếu app bị kill trên một số hãng Android như HONOR, Oppo, Xiaomi.
- Project đã thêm quyền Android liên quan trong `AndroidManifest.xml` và `app.json`, gồm `POST_NOTIFICATIONS`, `SCHEDULE_EXACT_ALARM`, `USE_EXACT_ALARM`, `WAKE_LOCK`, `RECEIVE_BOOT_COMPLETED`.
- Trên máy HONOR test thực tế, notification vẫn có thể bị OS chặn khi app bị vuốt kill.
- App có cơ chế recovery: khi mở app lại, nếu thấy reminder đã quá hạn nhưng chưa bắn, app tự thêm notification vào `NotificationsScreen`.
- Nếu yêu cầu bắt buộc kill app vẫn hiện system notification ổn định trên mọi máy, hướng đúng là server-side scheduled push qua Expo/FCM.

## Luồng Profile

Màn hình chính:

- `ProfileScreen`

Store/API:

- `app/models/ProfileStore.ts`
- `app/services/api/userApi.ts`

Luồng hoạt động:

1. `ProfileScreen` gọi `profileStore.loadIfNeeded()` hoặc `fetchProfile()`.
2. Store gọi API lấy thông tin user.
3. Người dùng sửa name/email.
4. Store update local trước, API chạy sau.
5. Nếu API fail, store rollback profile cũ.

## State Management

Root store:

- `RootStore.ts` gom các store con:
  - `authenticationStore`
  - `categoryStore`
  - `todoStore`
  - `notificationStore`
  - `profileStore`

Persist/rehydration:

- `setupRootStore.ts` load snapshot từ storage.
- Khi app mở lại, dữ liệu cache được phục hồi.
- Các flag như `isLoading`, `isLoaded` được reset để tránh app boot lên ở trạng thái loading sai.

## Navigation

File chính:

- `app/navigators/AppNavigator.tsx`
- `app/navigators/TabNavigator.tsx`
- `app/navigators/navigationUtilities.ts`

Stack chính:

- `Welcome`
- `Login`
- `SignUp`
- `MainTabs`
- `NewTodo`
- `TodoDetail`
- `NewCategory`
- `EditCategory`
- `EditTodo`
- `NotificationDetail`

Tabs:

- `Categories`
- `Todo`
- `Notifications`
- `Profile`

App dùng `navigationRef` để điều hướng từ notification listener, vì listener không nằm trực tiếp trong screen component.

## API Layer

Các file API nằm trong `app/services/api/`:

- `api.ts`: cấu hình apisauce instance và gắn token.
- `authApi.ts`: login/signup.
- `todoApi.ts`: CRUD Todo.
- `categoryApi.ts`: CRUD Category.
- `notificationApi.ts`: danh sách, unread count, mark read, delete, create notification.
- `userApi.ts`: profile user.

API response thường có dạng:

```ts
{
  success: boolean
  message: string
  data?: ...
}
```

## UI Components Dùng Chung

Một số component quan trọng:

- `AppSectionHeader`: header dùng chung cho các màn chính và màn add/edit/detail.
- `Screen`: layout wrapper từ Ignite.
- `Button`: button dùng chung.
- `TodoItem`: hiển thị Todo trong list.
- `CategoryItem`: hiển thị Category.
- `NotificationItem`: hiển thị Notification.

## Theme Và Style

- Màu sắc nằm trong `app/theme/colors`.
- Các screen đã tách style riêng như `TodoScreen.styles.ts`, `NewTodoScreen.styles.ts`, `EditTodoScreen.styles.ts`.
- Hạn chế inline style để code dễ đọc và dễ bảo trì.

## Scripts Hay Dùng

```bash
npm run compile
npm run lint
npm run test
npm run start
npm run start:dev
npm run android
npm run ios
```

Build Android/iOS với EAS local:

```bash
npm run build:android:dev
npm run build:android:prod
npm run build:ios:dev
npm run build:ios:prod
```

## Ghi Chú Khi Test Notification

- Sau khi sửa `app.json` hoặc `android/app/src/main/AndroidManifest.xml`, cần rebuild/reinstall app native. Reload Metro không đủ.
- Test notification active/background trước, sau đó mới test killed.
- Với các máy Android có chính sách pin mạnh, nên kiểm tra:
  - Notification permission.
  - Battery optimization.
  - Auto-start/background permission.
  - App có bị force stop từ Settings không.

## Trạng Thái Hiện Tại

- Todo/Category/Notification/Profile đã có local cache và optimistic UI.
- Todo reminder đã schedule local notification và recovery missed reminder khi mở app lại.
- App đã xử lý detached MST node khi xóa Todo bằng cách dùng snapshot/plain object.
- Case system notification khi app bị kill phụ thuộc chính sách OS/OEM; để đảm bảo tuyệt đối cần server push notification theo lịch.
