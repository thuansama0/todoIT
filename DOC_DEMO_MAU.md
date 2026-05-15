# Tài liệu demo / review code — TodoIT (bản đầy đủ theo repo)

> Dùng khi **vừa demo app vừa mở IDE**: mỗi chức năng → biết **mở file nào**, **chỉ đoạn nào**, **nói luồng ra sao**.  
> Cuối file có **từ điển & phân biệt thuật ngữ** để trả lời kiểu: “Đoạn này là gì?”, “Khác gì Redux?”.

**Không thay thế** `README.md` kỹ thuật — đây là **kịch bản demo + map code**.

**Nguồn đối chiếu đánh giá hoàn thiện (mục 9):** `YEU_CAU_DU_AN.md` (yêu cầu pet project công ty) + nội dung chữ đã trích từ file góp ý mentor `Nguyễn Minh Thuận.docx` (một số mục trong Word là ảnh/minh họa nên không hiện khi đổi sang `.txt` — phần đó cần bạn đối chiếu thủ công trong bản Word gốc).

---

## 1. Cách demo với sếp (workflow gợi ý)

1. **30 giây đầu — cây màn hình**  
   Mở `app/navigators/AppNavigator.tsx`: đây là **stack** (Login, SignUp, MainTabs, NewTodo, TodoDetail, …).  
   Mở `app/navigators/TabNavigator.tsx`: bốn **tab** bên trong `MainTabs` (Todo, Categories, Notifications, Profile).

2. **Với mỗi chức năng sếp hỏi**  
   - Trên điện thoại / simulator: thao tác **một hành động** (vd: đăng nhập, tạo todo).  
   - Trên máy: **Cmd+P** (hoặc Quick Open) gõ tên file trong **mục 3** (bảng map chức năng → file).  
   - Chỉ vào **một khối** (submit, `navigation.navigate`, `useStores`, `ListView`…) — không đọc cả file.

3. **Khi sếp hỏi “dòng đó làm gì”**  
   - Giải thích **vai trò** (gọi API / cập nhật store / điều hướng).  
   - Nếu hỏi sâu: dùng **mục 8** (Từ điển & phân biệt thuật ngữ).

4. **Thứ tự demo nghiệp vụ (gợi ý)**  
   Login → tab Todo (list, toggle, xóa) → TodoDetail → EditTodo / NewTodo → tab Categories → NewCategory / EditCategory → tab Notifications → NotificationDetail → tab Profile (edit, sign out).

---

## 2. Luồng tổng (auth + dữ liệu)

- **Đăng nhập / đăng ký thành công** → `completeAuthSession` (`app/utils/completeAuthSession.ts`): xóa dữ liệu session cũ, ghi `authToken`, lưu token vào storage, gọi `navigation.navigate("MainTabs")`, đồng thời **fetch nhẹ nền** todo/category.  
- **State toàn app** nằm trong **MobX-State-Tree** — `RootStore` gom `authenticationStore`, `todoStore`, `categoryStore`, `notificationStore`, `profileStore` (`app/models/RootStore.ts`).  
- **Màn hình** lấy store qua `useStores()`; bọc component bằng `observer(...)` để **UI tự render lại** khi observable trong store đổi.

---

## 3. Bảng: chức năng → file → đoạn code nên chỉ khi demo

Cột **“Chỉ vào”**: số dòng lấy theo snapshot repo; nếu bạn sửa file, dùng **tìm theo tên hàm** trong file.

### 3.1 Điều hướng & cấu trúc app

| Chức năng | File | Chỉ vào (gợi ý) |
|-----------|------|------------------|
| Khai báo toàn bộ màn stack + kiểu `route.params` | `app/navigators/AppNavigator.tsx` | `AppStackParamList` (~25–36), `Stack.Screen` (~49–58) |
| Tab bar + icon | `app/navigators/TabNavigator.tsx` | `TabParamList`, `Tab.Navigator` + `tabBarIcon` |
| Khởi tạo app, font, persist navigation, preload todo/category khi đã có token | `app/app.tsx` | `useInitialRootStore`, `useEffect` với `loadIfNeeded` (~67–73) |

### 3.2 Auth

| Chức năng | File | Chỉ vào |
|-----------|------|---------|
| Đăng nhập, validate, gọi API, xử lý lỗi mạng | `app/screens/LoginScreen/LoginScreen.tsx` | `onLogin` (~35–74), `authApi.signIn`, `completeAuthSession` |
| Đăng ký | `app/screens/SignUpScreen/SignUpScreen.tsx` | `onSignUp` (~34–59) |
| Sau login: reset store, token, navigate MainTabs | `app/utils/completeAuthSession.ts` | Toàn hàm `completeAuthSession` (~16–38) |
| Chỉ lưu token + `logout` | `app/models/AuthenticationStore.ts` | `authToken`, `isAuthenticated`, `logout` |

### 3.3 Todo (danh sách, chi tiết, form)

| Chức năng | File | Chỉ vào |
|-----------|------|---------|
| Danh sách, pull refresh, toggle, xóa, điều hướng Detail/Edit/New | `app/screens/TodoScreen/TodoScreen.tsx` | `runTodoRefresh`, `handleToggleStatus`, `renderTodoList` + `ListView` (~69–109), FAB `NewTodo` (~114–118) |
| Fetch list, optimistic create, toggle/delete có rollback | `app/models/TodoStore.ts` | `fetchTodos`, `loadIfNeeded`, `createTodo` (optimistic + `syncCreateTodoInBackground`), `toggleTodoStatus`, `deleteTodo` |
| Màn tạo mới (chỉ bọc form) | `app/screens/NewTodoScreen/NewTodoScreen.tsx` | `<TodoFormScreen mode="create" … />` |
| Màn sửa (truyền `todoData` từ route) | `app/screens/EditTodoScreen/EditTodoScreen.tsx` | `route.params.todoData` → `TodoFormScreen mode="edit"` |
| Form chung create/edit: due date, reminder, category, submit | `app/screens/TodoFormScreen/TodoFormScreen.tsx` | `useEffect` `categoryStore.loadIfNeeded`, `handleSubmit` (~106–166) |
| Chi tiết todo: tìm trong store theo `id`, toggle, xóa, nút Edit | `app/screens/TodoDetailScreen/TodoDetailScreen.tsx` | `route.params`, `todoStore.items.find`, header `navigate("EditTodo", …)` (~110–124) |
| Map MST todo → object thường cho navigation | `app/utils/todoMapper.ts` | `toPlainTodo` |
| **Nhắc việc — hẹn giờ local (Expo)** | `app/utils/todoReminder.ts` | **`scheduleTodoReminder`** (tính `triggerAt = dueDate - reminderMinutes`, `Notifications.scheduleNotificationAsync`), **`cancelTodoReminder`**; lưu map `todoId` ↔ `notificationId` + payload trong storage |
| **Nhắc việc — ai gọi schedule/cancel** | `app/models/TodoStore.ts` | Sau `createTodo` / `syncCreateTodoInBackground` / `updateTodo` / xóa todo / đổi id tạm → thực; `fetchTodos` merge `reminderMinutes` từ `loadTodoReminderMinutesMap()` |

### 3.4 Categories

| Chức năng | File | Chỉ vào |
|-----------|------|---------|
| List + refresh + FAB NewCategory | `app/screens/CategoriesScreen/CategoriesScreen.tsx` | `ListView`, `navigation.navigate("EditCategory"…)`, `NewCategory` FAB |
| API + sortedItems + optimistic create | `app/models/CategoryStore.ts` | `sortedItems` view, `fetchCategories`, `createCategory` |
| Tạo category | `app/screens/NewCategoryScreen/NewCategoryScreen.tsx` | `handleCreateCategory` |
| Sửa / xóa category | `app/screens/EditCategoryScreen/EditCategoryScreen.tsx` | `route.params.categoryData`, `handleSaveChanges`, `handleDelete` |

### 3.5 Notifications

| Chức năng | File | Chỉ vào |
|-----------|------|---------|
| Fetch khi tab focus, mark all read, delete all, list | `app/screens/NotificationsScreen/NotificationsScreen.tsx` | `useIsFocused` + `useEffect` fetch (~59–63), `handleMarkAllRead`, `ListView` `onPress` → `NotificationDetail` (~166–168) |
| Chi tiết + xóa | `app/screens/NotificationDetailScreen/NotificationDetailScreen.tsx` | `route.params.notificationData`, `handleDelete` |
| Logic store (nếu sếp hỏi API layer) | `app/models/NotificationStore.ts` | các flow fetch/mark/delete |
| **Todo reminder → dòng trong list + Toast** | `app/utils/usePushNotifications.ts` | Payload `data.kind === "todo-reminder"` → **`pushIncomingReminder`** → `notificationStore.addIncomingNotification`; foreground → **`Toast.show`** |

### 3.6 Profile

| Chức năng | File | Chỉ vào |
|-----------|------|---------|
| UI profile, edit mode, avatar | `app/screens/ProfileScreen/ProfileScreen.tsx` | `useProfileLoadOnFocus`, `useProfileEditForm`, `useAvatarImagePicker`, `useProfileSession` |
| GET/PATCH profile, optimistic rollback | `app/models/ProfileStore.ts` | `fetchProfile`, `updateProfile` (backup + rollback) |
| Sign out / xóa account + reset navigation | `app/utils/useProfileSession.ts` | `finishSession`, `navigation.reset` → Login |
| Form edit: payload name/email/password | `app/utils/useProfileEditForm.ts` | `saveProfile` — **lưu ý**: payload hiện chỉ gửi `name` / `email` / `password` tùy chọn; URI ảnh từ picker chủ yếu phục vụ UI/chuẩn bị mở rộng |
| Chọn ảnh thư viện / camera | `app/utils/useAvatarImagePicker.ts` | `expo-image-picker` request permission + `launchImageLibraryAsync` |

### 3.7 List chung (quan trọng khi sếp hỏi “FlashList ở đâu?”)

| Chức năng | File | Chỉ vào |
|-----------|------|---------|
| Wrapper: iOS LTR → FlashList; Android hoặc RTL → FlatList | `app/components/ListView.tsx` | Comment đầu file + nhánh `useRNFlatList` (~32–47) |

---

## 4. Chi tiết theo từng màn (luồng + “chỉ code đâu”)

### 4.1 Login

- **Luồng**: nhập email/password → `onLogin` → `authApi.signIn` → nếu OK → `completeAuthSession(..., accessToken)` → vào `MainTabs`. Thiếu field / lỗi mạng / sai mật khẩu → `Alert`.  
- **Mở code**: `LoginScreen.tsx` — hàm `onLogin`.  
- **Store**: `AuthenticationStore` nhận token trong `completeAuthSession`, không set trực tiếp trong `LoginScreen`.

### 4.2 SignUp

- **Luồng**: username + email + password → `authApi.signUp` → thành công thì cùng `completeAuthSession` như login.  
- **Mở code**: `SignUpScreen.tsx` — `onSignUp`.

### 4.3 Tab Todo (`TodoScreen`)

- **Luồng**: `todoStore` (MST) giữ `items`. Vào màn: có thể đã có data từ persist / `loadIfNeeded` từ `app.tsx`. Kéo refresh → `fetchTodos`. Bấm dòng → `TodoDetail` với `{ id }`. Toggle / xóa → gọi action store. FAB → `NewTodo`.  
- **Mở code**: `renderTodoList` — `ListView` + `navigation.navigate` / `TodoItem` props.  
- **Điểm kỹ thuật**: `pullRefreshing` tách khỏi `todoStore.isLoading` để tránh nhấp nháy RefreshControl trên Android (comment trong file).

### 4.4 NewTodo / EditTodo (`TodoFormScreen`)

- **Luồng**: **một component form** hai mode: `create` và `edit` (khác `initialTodo` và route type). Submit create → `todoStore.createTodo` (**optimistic**: thêm item tạm, sync nền). Submit edit → `todoStore.updateTodo` (async flow, có rollback).  
- **Mở code**: `TodoFormScreen.tsx` — `handleSubmit`; `NewTodoScreen` / `EditTodoScreen` chỉ là “vỏ” điều hướng.  
- **Rule nghiệp vụ**: tạo mới **bắt buộc chọn category** (Alert trong `handleSubmit`).  
- **Nhắc việc (reminder) — không nằm trong `TodoScreen`:** form chỉ giữ state **`reminderMinutes`** (chip) + due date, truyền vào `createTodo` / `updateTodo`. Việc **đặt lịch hệ thống** do **`TodoStore`** gọi **`scheduleTodoReminder`** trong **`app/utils/todoReminder.ts`** (Expo `scheduleNotificationAsync`; trước đó **`cancelTodoReminder`** theo `todoId`). Không có một hàm tên kiểu `setTimeReminder` trên màn list — đó là tách đúng trách nhiệm: UI → store → util OS.  
- **Sang tab Notifications:** khi notification nhắc việc **kích hoạt**, **`usePushNotifications`** ghi vào **`notificationStore.addIncomingNotification`** (và Toast nếu app đang mở) — xem thêm **§4.7** và dòng **`todo-reminder`** trong `usePushNotifications.ts`.

### 4.5 TodoDetail

- **Luồng**: `id` từ `route.params` → `todoStore.items.find`. Nếu store chưa load → `loadIfNeeded`. Header Edit → `EditTodo` với `todoData` đã `toPlainTodo`.  
- **Mở code**: `useEffect` khởi động; `handleToggleStatus` / `handleDelete`.

### 4.6 Categories / NewCategory / EditCategory

- **Luồng**: list từ `categoryStore.sortedItems`. Edit truyền nguyên object category qua params. Tạo mới: form name + public switch → `createCategory` (optimistic + refetch khi thành công).  
- **Mở code**: `CategoriesScreen.tsx` list; `CategoryStore.ts` cho logic sort và API.

### 4.7 Notifications / NotificationDetail

- **Luồng**: mỗi lần **tab được focus** → `fetchNotifications`. Bấm dòng: nếu chưa đọc → `markRead` rồi `navigate` `NotificationDetail` với object map từ store. Có “Mark all read” / “Delete all”.  
- **Mở code**: `NotificationsScreen.tsx` — hai `useEffect` (interval 15s chỉ để refresh text “time ago”, và fetch khi focus).  
- **Chi tiết**: `NotificationDetailScreen` đọc `route.params.notificationData`; xóa gọi `notificationStore.deleteNotification`.  
- **Liên quan Todo reminder:** thông báo **nhắc deadline** không tạo từ màn Notifications; nó được **lên lịch** bởi `todoReminder.ts` (**§4.4**). Khi chuông kêu, **`usePushNotifications`** có thể đẩy bản ghi vào **`notificationStore`** (`addIncomingNotification`) nên user vẫn thấy trong list — **fetch** sau đó merge server + local (`NotificationStore.fetchNotifications`).

### 4.8 Profile

- **Luồng**: khi tab focus → load profile nếu cần (`useProfileLoadOnFocus`). Xem → “Edit Profile” → các field local → Save → `profileStore.updateProfile`. Sign out / delete account → `useProfileSession` xóa storage + reset store + `navigation.reset` về `Login`.  
- **Mở code**: `ProfileScreen.tsx` tổng hợp hooks; logic lưu trong `useProfileEditForm` + `ProfileStore.updateProfile`.

---

## 5. Thư viện chính (nhắc một lần, chi tiết theo màn ở §4)

| Thư viện | Vai trò trong project này |
|-----------|---------------------------|
| Expo + React Native | Nền tảng app |
| `@react-navigation/native` + `native-stack` + `bottom-tabs` | Stack auth + tab chính; `CompositeScreenProps` cho màn vừa tab vừa mở stack con |
| `mobx` + `mobx-state-tree` + `mobx-react-lite` | Store có kiểu (MST), action bất đồng bộ `flow`, UI bọc `observer` |
| `apisauce` | HTTP client, response kiểu `ok` / `problem` / `data` |
| `@shopify/flash-list` (gián tiếp qua `ListView`) | List nhanh trên iOS LTR |
| `react-native` `FlatList` | Dùng trong `ListView` khi Android hoặc RTL (ổn định layout) |
| `date-fns` / util `formatDate` | Hiển thị due date, “time ago” |
| `expo-image-picker` | Chọn ảnh avatar (`useAvatarImagePicker`) |
| `expo-notifications` + util push | Đăng ký token sau login (`syncExpoPushTokenWithServer` trong `completeAuthSession`) |
| `@react-native-async-storage/async-storage` | Token + persist (qua `app/utils/storage`) |
| `react-native-toast-message` | Toast toàn app (`app/app.tsx`) |

---

## 6. Đoạn code tham chiếu (trích từ repo — khi demo có thể đối chiếu)

**Khai báo stack + params:**

```25:58:app/navigators/AppNavigator.tsx
export type AppStackParamList = {
  Login: undefined
  SignUp: undefined
  MainTabs: NavigatorScreenParams<TabParamList> | undefined
  NewTodo: undefined
  TodoDetail: { id: string }
  NewCategory: undefined
  EditCategory: { categoryData: Category }
  EditTodo: { todoData: EditTodoRouteData }
  NotificationDetail: { notificationData: Notification }
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      <Stack.Screen name="Login" component={Screens.LoginScreen} />
      <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="NewTodo" component={Screens.NewTodoScreen} />
      <Stack.Screen name="TodoDetail" component={Screens.TodoDetailScreen} />
      <Stack.Screen name="NewCategory" component={Screens.NewCategoryScreen} />
      <Stack.Screen name="EditCategory" component={Screens.EditCategoryScreen} />
      <Stack.Screen name="EditTodo" component={Screens.EditTodoScreen} />
      <Stack.Screen name="NotificationDetail" component={Screens.NotificationDetailScreen} />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
})
```

**Sau đăng nhập — một chỗ xử lý session:**

```16:38:app/utils/completeAuthSession.ts
export async function completeAuthSession<S extends keyof AppStackParamList>(
  stores: CompleteAuthSessionStores,
  navigation: NativeStackNavigationProp<AppStackParamList, S>,
  accessToken: string | undefined,
) {
  stores.profileStore.clearProfile()
  await stores.notificationStore.resetForAuthChange()
  await stores.todoStore.resetForAuthChange()
  stores.categoryStore.resetForAuthChange?.()

  if (accessToken) {
    stores.authenticationStore.setProp("authToken", accessToken)
    await saveString("accessToken", accessToken)
    syncExpoPushTokenWithServer(accessToken).catch(() => undefined)
    stores.todoStore.loadIfNeeded().catch(() => undefined)
    ;(stores.categoryStore.loadIfNeeded?.() ?? Promise.resolve()).catch(() => undefined)
  }

  navigation.navigate("MainTabs")
}
```

**ListView = FlashList hoặc FlatList tùy platform/RTL:**

```27:47:app/components/ListView.tsx
const ListViewComponent = forwardRef(
  <T,>(props: ListViewProps<T>, ref: React.ForwardedRef<ListViewRef<T>>) => {
    const { style: _style, ...baseProps } = props as ListViewProps<T> & { style?: unknown }

    const useRNFlatList = isRTL || Platform.OS === "android"
    if (useRNFlatList) {
      const { estimatedItemSize: _estimatedItemSize, ...flatListProps } = baseProps
      return (
        <FlatList
          {...(flatListProps as FlatListProps<T>)}
          ref={ref as React.ForwardedRef<FlatList<T>>}
        />
      )
    }

    return (
      <FlashList
        {...(baseProps as FlashListProps<T>)}
        ref={ref as React.ForwardedRef<FlashList<T>>}
      />
    )
  },
)
```

---

## 7. Checklist trước khi demo

- [ ] Mở sẵn hai tab IDE: `AppNavigator.tsx` + màn đang nói (vd `TodoScreen.tsx`).  
- [ ] Chuẩn bị tài khoản demo (trên `LoginScreen` có gợi ý `demo@todoit.app / password123`).  
- [ ] Nhớ câu: **“params truyền qua navigation là snapshot; store là nguồn truth cho list todo.”** — tránh nhầm khi sếp hỏi tại sao `EditTodo` nhận `todoData` mà không fetch lại.

---

## 8. Từ điển nhanh & phân biệt thuật ngữ (sếp hay hỏi)

| Thuật ngữ | Giải thích ngắn (nói với sếp) |
|-----------|------------------------------|
| **React / component** | Khối UI tái sử dụng; input là **props**, trạng thái cục bộ là **useState**. |
| **`observer(...)`** | Hàm bọc component: khi **MobX observable** (trong store) đổi, màn hình **tự vẽ lại** phần liên quan. Không phải “observer pattern” UML — đây là API của `mobx-react-lite`. |
| **`useStores()`** | Hook lấy **RootStore** (context): `todoStore`, `categoryStore`, … Giống “redux `useSelector` + dispatch gộp” nhưng object là MST. |
| **MobX-State-Tree (MST)** | **Model** có field + **actions** (hàm đổi state) + **views** (computed). `flow(function*` là action **async** (thay cho async/await trong store). |
| **Optimistic UI** | Cập nhật UI **trước** khi server trả lời (vd tạo todo: thêm bản ghi `temp-…` ngay); nếu API fail thì **rollback** (xóa temp / khôi phục list). |
| **React Navigation — Stack vs Tab** | **Stack**: xếp màn như ngăn xếp (push/pop). **Tab**: chuyển nhanh 4 khu vực chính. Màn như `TodoDetail` là **stack phía trên** tab. |
| **`route.params`** | Dữ liệu **truyền khi điều hướng** (vd `TodoDetail` cần `id`). Khác **global store**: params chỉ cho màn đích, không tự đồng bộ khi store đổi (trừ khi màn tự subscribe store). |
| **`CompositeScreenProps`** | TypeScript gộp kiểu props: màn vừa thuộc **tab** vừa có quyền `navigation.navigate` tới **stack** cha (`NewTodo`, `TodoDetail`, …). |
| **`apisauce` / `response.ok`** | `ok === true` nghĩa là HTTP 2xx; vẫn cần kiểm tra `response.data?.success` theo contract backend. |
| **`ListView` vs `FlashList`** | App **không gọi FlashList trực tiếp** ở màn; dùng `ListView` — bên trong chọn FlashList hoặc FlatList (xem §6). |
| **`completeAuthSession`** | **Một cổng** sau login/signup: tránh rải logic reset store / lưu token ở nhiều màn. |
| **Custom hook (`useProfileEditForm`, …)** | Gom logic dài ra khỏi JSX: dễ test, dễ chỉ cho sếp từng file một chức năng. |

**So sánh nhanh (nếu sếp từng nghe Redux):**

| | Redux Toolkit (thường gặp) | Cách project này (MST + MobX) |
|---|---------------------------|-------------------------------|
| State tập trung | `store` + `slice` | `RootStore` + các `*Store` MST |
| Cập nhật UI | `useSelector` / connect | `observer` + đọc trực tiếp `todoStore.items` |
| Async | `createAsyncThunk` / saga | MST `flow` hoặc `async` trong action |

---

## 9. Đánh giá “đã xong / hoàn thiện chưa?” (theo yêu cầu + góp ý mentor)

### 9.1 Kết luận ngắn

**App đã đủ lõi để demo nghiệp vụ:** đăng nhập/đăng ký, token + reset session, CRUD Todo/Category, danh sách & chi tiết notification, profile cơ bản, push/reminder có luồng Toast + điều hướng tab Notifications, TypeScript `bun compile` hiện **pass**, ESLint (không `--fix`) **pass** trên phạm vi đã cấu hình.

**Chưa gọi là “hoàn thiện 100% theo bộ yêu cầu + góp ý”** vì còn lệch phiên bản công nghệ, i18n/English UI, vài tính năng “có UI nhưng chưa trọn pipeline”, design token so khớp mẫu, và vài hạng mục vận hành (build store, semver) chưa thấy đóng trong repo.

Dưới đây là **ma trận** + **checklist việc nên làm** (copy sang báo cáo cho sếp được).

---

### 9.2 Đối chiếu `YEU_CAU_DU_AN.md` (yêu cầu công ty)

| Yêu cầu (tóm tắt) | Trạng thái trong repo | Ghi chú |
|-------------------|-------------------------|---------|
| Ignite boilerplate + Expo **dev build** (không Expo Go) | **Phần lớn đạt** | Có `expo-dev-client`, script `start:dev`, EAS profile trong `package.json`. |
| **Expo SDK 52** | **Chưa khớp** | `package.json`: `expo` ~**50** — cần nâng SDK theo đúng spec nếu bài bắt buộc SDK 52. |
| **Bun** làm package manager | **Một phần** | Đã dùng `bun`/`bunx` cho nhiều script; script `lint` vẫn gọi `npm run format` sau eslint — có thể thống nhất `bun run format`. |
| **Node 24.14.1 + fnm** | **Không kiểm chứng trong repo** | Nên có `.node-version` / `.nvmrc` + ghi README để đồng bộ máy thực tập. |
| dotenv / biến môi trường | **Một phần** | Có `dotenv` dependency và `EXPO_PUBLIC_*` trong `app.config.ts`; cần rà soát **toàn bộ** secret/base URL đều đi env, không hardcode. |
| Auth + lưu token | **Đạt** | `completeAuthSession`, `AsyncStorage`, MST `authenticationStore`. |
| CRUD REST | **Đạt** (Todo, Category; notification chủ yếu đọc/ghi qua API trong store) | Rà lại với contract backend nếu có endpoint còn thiếu. |
| Push notification **3 trường hợp** (foreground Toast; background/kill tap → màn danh sách TB) | **Đạt phần lớn** | `usePushNotifications.ts`: foreground → `Toast.show` sau khi ghi notification; `addNotificationResponseReceivedListener` + `getLastNotificationResponseAsync` → `navigateToNotificationsTab()`. Cần **test thật** trên Android+iOS với payload server. |
| Chụp/chọn ảnh | **Một phần** | `expo-image-picker` dùng cho **avatar**; form Todo có khối “Image” nhưng **chưa** là luồng upload/chọn ảnh thật cho todo (`DEFAULT_TODO_IMAGE_URL` trong `TodoFormScreen`). |
| UI responsive | **Tương đối** | Cần soát thêm máy nhỏ / tablet nếu yêu cầu nghiêm. |
| Hiển thị lỗi, không crash | **Tương đối** | `Alert`, Toast, `ErrorBoundary` — nên bổ sung test tay các API fail. |
| **l10n / đa ngôn ngữ** | **Chưa đạt yêu cầu** | Có `i18n` + `en.ts` nhưng **rất ít key**; phần lớn chuỗi UI vẫn hardcode trong screen. |
| Semantic Versioning | **Chưa nhất quán** | `package.json` `version`: **0.0.1**; `app.json` expo `version`: **1.0.0** — nên thống nhất theo SemVer. |
| Build release / CH Play | **Không đánh giá được chỉ qua code** | Cần artifact EAS + checklist store (policy, ảnh chụp màn). |

---

### 9.3 Đối chiếu góp ý trong `Nguyễn Minh Thuận.docx` (phần chữ trích được)

| Góp ý mentor | Trạng thái / cần làm |
|--------------|----------------------|
| Gợi ý **fnm** + **dot-env** | fnm: thêm file phiên bản + doc; dotenv: rà soát env coverage. |
| **Vi phạm quy tắc Ignite / code lặp / không tận dụng sẵn có / clean code** | Trong bản `.txt` các mục con **không có chữ** (có thể nằm trong **ảnh** trong Word). **Bạn cần mở file `.docx` gốc** và lần lượt đánh dấu đã xử lý từng ý; có thể bổ sung vào bảng dưới khi có danh sách cụ thể. |
| **Màu phải khớp design 100%** | Cần so `app/theme` với mock Replit trong yêu cầu + color picker — chưa chứng minh trong code là đã khớp. |
| Mở app → **Login**, không phải **Welcome** | Không thấy màn `Welcome` riêng; route đầu stack là `Login`. Tuy nhiên **`persistNavigation: "dev"`** (`app/config/config.base.ts`) kết hợp restore state có thể khiến **dev** mở lại đúng màn/stack cũ (không phải Login). Nếu sếp yêu cầu “lần đầu / hết phiên luôn Login” → cần **auth guard** hoặc reset nav khi không có token. |
| Screen/component mới → dùng **Ignite generate** | Cần tự kiểm chứng từng file thêm sau boilerplate ban đầu. |
| **100% tiếng Anh** như design | **Chưa đạt**: nhiều `Alert.alert`, toast fallback, copy trong `usePushNotifications` vẫn **tiếng Việt**; cần chuyển sang English hoặc i18n key. |
| `bun compile` / `bun lint` sạch warning | **compile**: đã chạy pass. **lint**: script mặc định có `--fix` + format — nên quy ước chạy trước khi nộp bài và lưu log; ESLint không `--fix` hiện không báo lỗi trên scope đã chạy. |
| MST: ưu tiên **`getSnapshot()`** thay vì map tay | Vẫn có **`toPlainTodo`** / map thủ công — có thể refactor dần theo góp ý (cẩn trọng kiểu navigation params). |

---

### 9.4 Danh sách việc nên chỉnh để “hoàn thiện hơn” (ưu tiên gợi ý)

1. **Nâng / căn Expo SDK** theo đúng `YEU_CAU_DU_AN.md` (52) hoặc **điều chỉnh tài liệu yêu cầu** nếu công ty chấp nhận SDK 50 — tránh lệch spec khi chấm.  
2. **Auth + navigation khởi động:** khi không có `authToken` hợp lệ → luôn `reset` về `Login`; cân nhắc tắt/điều chỉnh restore navigation trong dev nếu mentor bắt “luôn vào Login”.  
3. **Ngôn ngữ UI:** chuyển toàn bộ string user-facing sang **English** hoặc **`i18n`** (Alerts, nút, subtitle, toast fallback trong `usePushNotifications`).  
4. **Todo ảnh:** hoàn thiện chọn ảnh + upload (hoặc bỏ UI giả) thay cho `DEFAULT_TODO_IMAGE_URL` + placeholder “Image selected”.  
5. **Profile ảnh:** nếu API hỗ trợ — gửi `imageUrl` / multipart trong `updateProfile`; hiện `useProfileEditForm.saveProfile` chỉ name/email/password.  
6. **Theme / design:** rà soát `colors`, spacing so với mock; mentor yêu cầu **màu trùng 100%**.  
7. **Semver & metadata:** thống nhất `package.json` ↔ `app.json` version; cập nhật changelog ngắn cho sếp.  
8. **Môi trường & onboarding dev:** `.node-version`, ghi rõ `fnm`/`bun` trong README.  
9. **Đóng các mục trong Word dạng ảnh:** mở `Nguyễn Minh Thuận.docx`, chép từng ý “Vi phạm boilerplate / code lặp / …” vào checklist dưới đây khi làm bài nộp.  

**Checklist trống để bạn điền từ Word (ảnh):**

- [ ] (Điền) Vi phạm Ignite — mục 1: …  
- [ ] (Điền) Vi phạm Ignite — mục 2: …  
- [ ] (Điền) Code lặp — …  
- [ ] (Điền) Không tận dụng component có sẵn — …  
- [ ] (Điền) Clean code — …  

---

### 9.5 Cách trả lời sếp gọn (mẫu câu)

> “Phần nghiệp vụ chính và luồng kỹ thuật đã chạy được và em đã rà compile/lint. Em vẫn đang chỉnh các hạng mục ‘đóng spec’: đồng bộ SDK/bun theo tài liệu công ty, chuẩn hóa tiếng Anh + i18n, khớp màu design, hoàn thiện ảnh todo/avatar với API, và bổ sung checklist từ file góp ý anh/chị (có phần minh họa bằng hình em sẽ đối chiếu trong Word).”

---

*Tài liệu được căn chỉnh theo code trong repo TodoIT; khi refactor tên hành động hoặc tách file, cập nhật lại cột “Chỉ vào” cho khớp.*
