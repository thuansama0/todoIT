# Đối chiếu góp ý mentor & yêu cầu dự án — `todoIT` (bản cập nhật)

Tài liệu này **bổ sung và thay thế** các mục cũ trong `DOCX_REVIEW_COMPARISON.md` theo **code hiện tại**. Dùng kèm `README.md` (chi tiết kỹ thuật) và `DOC_DEMO_MAU.md` (kịch bản demo).

---

## Mục lục

1. [Nguồn tham chiếu](#1-nguồn-tham-chiếu)
2. [Tóm tắt trạng thái theo góp ý docx](#2-tóm-tắt-trạng-thái-theo-góp-ý-docx)
3. [Đối chiếu từng mục góp ý — chi tiết](#3-đối-chiếu-từng-mục-góp-ý--chi-tiết)
4. [Đối chiếu yêu cầu pet project (`YEU_CAU_DU_AN.md`)](#4-đối-chiếu-yêu-cầu-pet-project-yeu_cau_du_anmd)
5. [Thay đổi lớn so với README / tài liệu cũ](#5-thay-đổi-lớn-so-với-readme--tài-liệu-cũ)
6. [Map file theo chức năng (tra cứu nhanh)](#6-map-file-theo-chức-năng-tra-cứu-nhanh)
7. [Chất lượng code — compile & lint](#7-chất-lượng-code--compile--lint)
8. [Danh sách ưu tiên còn lại](#8-danh-sách-ưu-tiên-còn-lại)
9. [Ghi chú khi review với mentor](#9-ghi-chú-khi-review-với-mentor)

---

## 1. Nguồn tham chiếu

| Nguồn | Vai trò |
|--------|---------|
| File góp ý gốc (docx mentor) | Tiêu chí review ban đầu (env, Login first, English, lint, Ignite) |
| `YEU_CAU_DU_AN.md` | Yêu cầu pet project Tri Anh Solutions |
| `README.md` | Tài liệu kỹ thuật đầy đủ (kiến trúc, luồng, file) |
| Code trong `app/` | **Nguồn sự thật** khi mâu thuẫn với tài liệu cũ |

---

## 2. Tóm tắt trạng thái theo góp ý docx

| # | Góp ý (tóm tắt) | Trạng thái hiện tại | Ghi chú ngắn |
|---|-----------------|---------------------|--------------|
| 1 | Biến môi trường cho thông tin nhạy cảm / cấu hình | **Đạt** | `EXPO_PUBLIC_API_URL`, EAS env; không Cloudinary trên client |
| 2 | Mở app vào **Login**, không Welcome | **Đạt** | Stack không còn route `Welcome`; màn đầu `Login` |
| 3 | Ngôn ngữ **100% English** như design | **Một phần** | UI chính qua i18n (`en.ts`); vài chuỗi push/reminder + `app.json` permission còn tiếng Việt |
| 4 | `compile` + `lint` pass | **Một phần** | `npm run compile` pass; `npm run lint` cần chạy lại sau fix cuối (đã bỏ `console.tron` thừa ở Login) |
| 5 | Ignite / clean code / tránh lặp | **Cải thiện** | Tách hooks (`useProfileEditForm`, `completeAuthSession`, `logDev`); store API-first — cần mentor chỉ file cụ thể nếu còn góp ý |

---

## 3. Đối chiếu từng mục góp ý — chi tiết

### 3.1 Environment variables

**Yêu cầu góp ý:** Không hardcode URL/API; dùng env cho cấu hình build.

**Đã làm — nằm ở đâu:**

| Thành phần | File | Vì sao |
|------------|------|--------|
| Đọc API URL | `app/config/index.ts` | `Config.API_URL` ← `process.env.EXPO_PUBLIC_API_URL` |
| Expo extra / EAS id | `app.config.ts` | `EXPO_PUBLIC_EAS_PROJECT_ID` (optional) |
| Mẫu cho dev | `.env.example` | Hướng dẫn local + EAS; **không** commit `.env` |
| Build cloud | `eas.json` + expo.dev | `environment`: development / preview / production |

**Upload ảnh:** App **không** cần biến Cloudinary — `app/services/api/uploadApi.ts` gọi `POST /upload/image` trên backend; server trả URL.

**Cần làm khi release:** Set `EXPO_PUBLIC_API_URL` trên expo.dev **đúng environment** của profile build (xem README mục 5 & 20).

---

### 3.2 Login là màn đầu, không Welcome

**Yêu cầu góp ý:** User mở app thấy Login ngay.

**Trạng thái:** **Đạt.**

**Bằng chứng:**

- `app/navigators/AppNavigator.tsx`: khai báo stack bắt đầu bằng `Login` / `SignUp` / `MainTabs` — **không** có screen `Welcome`.
- Chỉ còn chuỗi marketing kiểu `"Welcome back"` trong `app/i18n/en.ts` (`loginScreen.title`) — đây là **copy UI**, không phải màn Welcome.

**Luồng sau login:** `app/utils/completeAuthSession.ts` → reset stores → lưu token → `MainTabs`.

---

### 3.3 Ngôn ngữ English + i18n

**Yêu cầu góp ý:** UI/notification tiếng Anh, dùng cơ chế đa ngôn ngữ.

**Trạng thái:** **Một phần — đã có nền i18n rộng.**

**Đã làm:**

| Khu vực | File | Cách dùng |
|---------|------|-----------|
| Nguồn key + type | `app/i18n/en.ts` | `Translations`, key theo màn |
| Locale | `app/i18n/i18n.ts` | `ar`, `en`, `ko`, `fr` + fallback |
| Helper | `app/i18n/translate.ts` | `translate("key")` |
| UI | Hầu hết `screens/`, `components/Text`, `TextField` | `tx`, `labelTx`, `translate` trong `Alert` |

**Clone locale:** `ar.ts`, `fr.ts`, `ko.ts` import/re-export cấu trúc `en` — hiện **nội dung giống English** (đủ type-check), có thể dịch sau.

**Chưa đạt 100% English:**

| Vị trí | Ví dụ | Đề xuất |
|--------|--------|---------|
| `app/utils/todoReminder.ts` | Title/body tiếng Việt | Thêm key `reminder.*` trong `en.ts` |
| `app/utils/usePushNotifications.ts` | Toast / notification copy | Cùng pattern i18n |
| `app.json` | Permission `expo-image-picker` message VI | Đổi sang EN hoặc plugin i18n permission |

---

### 3.4 Compile & lint

**Yêu cầu góp ý:** `bun compile` / `bun lint` không lỗi (project dùng `npm`/`bun` tương đương script trong `package.json`).

**Kết quả gần nhất (cần chạy lại sau mỗi đợt sửa):**

| Lệnh | Kết quả |
|------|---------|
| `npm run compile` (`tsc --noEmit`) | **PASS** |
| `npm run lint` | Trước đó **FAIL** 1 lỗi `reactotron/no-tron-in-production` tại `LoginScreen.tsx` — đã gỡ `console.tron` trùng với `logApisauceResponse` |

**Khuyến nghị:** Trước nộp bài / demo, chạy:

```bash
npm run compile
npm run lint
```

---

### 3.5 Ignite boilerplate, clean code, tránh lặp

**Yêu cầu góp ý (mơ hồ trong docx):** Dùng đúng pattern Ignite, không copy-paste logic, tận dụng component có sẵn.

**Cải thiện rõ trong codebase (so với bản docx cũ):**

| Chủ đề | Trước (thường gặp) | Hiện tại | File |
|--------|-------------------|----------|------|
| Sau login | Logic rải nhiều màn | Một hàm `completeAuthSession` | `app/utils/completeAuthSession.ts` |
| Profile edit + avatar | Logic dài trong screen | `useProfileEditForm`, `useAvatarImagePicker`, `useProfileSession` | `app/utils/useProfileEditForm.ts`, … |
| API logging | Rải `console.log` | `logDev.ts` + monitor `api.ts` | `app/utils/logDev.ts`, `app/services/api/api.ts` |
| Mutation UI | Optimistic temp id | **API-first** rồi mới sửa store | `TodoStore`, `CategoryStore`, `NotificationStore`, `ProfileStore` |
| Upload | Base64 / client Cloudinary | 2 bước: upload API → `PUT /user` | `uploadApi.ts`, `useProfileEditForm.ts` |
| Token | Lệch storage vs MST | `getAccessToken` + sync rehydrate | `accessToken.ts`, `app.tsx` |

**Vẫn có thể bị mentor nhắc (tùy tiêu chí):**

- Một số `Alert` / inline style cũ trong screen (rule `no-inline-styles`).
- `ProfileScreen` vẫn dài — đã tách hook nhưng UI JSX lớn.
- Todo form dùng `DEFAULT_TODO_IMAGE_URL` thay vì chọn ảnh thật.

**Cần từ mentor:** Danh sách file + dòng cụ thể nếu còn vi phạm “Ignite rules” — docx gốc không trích đủ bảng chi tiết.

---

## 4. Đối chiếu yêu cầu pet project (`YEU_CAU_DU_AN.md`)

| Yêu cầu pet project | Đáp ứng | Nơi triển khai / ghi chú |
|----------------------|---------|---------------------------|
| RESTful API | Có | `app/services/api/*Api.ts` |
| Auth + lưu token | Có | `AuthenticationStore`, `accessToken`, `completeAuthSession` |
| CRUD Todo / Category | Có | Stores + screens tương ứng |
| Push notification | Có | `usePushNotifications.ts`, `google-services.json` |
| Global state MST | Có | `app/models/` |
| Chọn/chụp ảnh | Có (profile) | `useAvatarImagePicker.ts`, `expo-image-picker` |
| Responsive UI | Một phần | `Screen`, theme; chưa audit toàn bộ tablet |
| Xử lý lỗi không crash | Có | `Alert`, kiểm tra `isMutationSuccess`, `ErrorBoundary` |
| Ignite boilerplate | Có | Cấu trúc `app/`, `components`, `navigators` |
| l10n / i18n | Có | `app/i18n/` |
| api-client | Có | `apisauce` + `fetch` upload |
| Development build | Có | `expo-dev-client`, script `start:android` |
| EAS build / gửi tester | Có | `eas.json`, profiles preview/production |
| Semantic versioning | Có | `package.json` version `0.0.1` |

**Khác biệt so với doc yêu cầu gốc (không sai, chỉ lưu ý):**

- Package manager doc ghi **bun** — repo vẫn chạy được với **npm** (`package-lock` / scripts `npm run`).
- Expo SDK trong repo có thể đã nâng so với “52” trong `YEU_CAU_DU_AN.md` — kiểm tra `package.json` khi báo cáo.

---

## 5. Thay đổi lớn so với README / tài liệu cũ

Các tài liệu viết **trước refactor** (hoặc `DOC_DEMO_MAU.md` chưa cập nhật) có thể **sai** ở các điểm sau — **ưu tiên README.md mới**:

| Chủ đề | Tài liệu / hiểu cũ | Thực tế code hiện tại |
|--------|-------------------|------------------------|
| Optimistic UI | Todo/Category cập nhật UI trước API | **API thành công** mới đổi `items` (TodoStore, …) |
| Màn đầu app | Welcome → Login | **Login** trực tiếp |
| Profile avatar | Gửi base64 hoặc Cloudinary client | **`POST /upload/image`** rồi **`PUT /user`** với `imageUrl` |
| Env Cloudinary | `EXPO_PUBLIC_CLOUDINARY_*` | **Không dùng** trên client |
| Chuỗi UI | Hardcode tiếng Việt trong screen | **`translate` / `tx`** từ `en.ts` |
| Dev debug API | `console.log` rải rác | **`logDev`** + monitor `api.ts` (chỉ `__DEV__`) |

---

## 6. Map file theo chức năng (tra cứu nhanh)

Dùng khi mentor hỏi “chức năng X nằm file nào”.

### Auth

| Việc | File |
|------|------|
| UI Login | `app/screens/LoginScreen/LoginScreen.tsx` |
| UI SignUp | `app/screens/SignUpScreen/SignUpScreen.tsx` |
| API | `app/services/api/authApi.ts` |
| Store token | `app/models/AuthenticationStore.ts` |
| Sau login | `app/utils/completeAuthSession.ts` |
| Token HTTP | `app/utils/accessToken.ts` |

### Todo

| Việc | File |
|------|------|
| List | `app/screens/TodoScreen/TodoScreen.tsx` |
| Form | `app/screens/TodoFormScreen/TodoFormScreen.tsx` |
| Store | `app/models/TodoStore.ts` |
| API | `app/services/api/todoApi.ts` |
| Reminder | `app/utils/todoReminder.ts` |

### Category

| Việc | File |
|------|------|
| List | `app/screens/CategoriesScreen/CategoriesScreen.tsx` |
| Store | `app/models/CategoryStore.ts` |
| API | `app/services/api/categoryApi.ts` |

### Notification

| Việc | File |
|------|------|
| List | `app/screens/NotificationsScreen/NotificationsScreen.tsx` |
| Store | `app/models/NotificationStore.ts` |
| Push | `app/utils/usePushNotifications.ts` |
| Local log | `app/utils/localNotificationLog.ts` |

### Profile & upload

| Việc | File |
|------|------|
| UI | `app/screens/ProfileScreen/ProfileScreen.tsx` |
| Form + save | `app/utils/useProfileEditForm.ts` |
| Chọn ảnh | `app/utils/useAvatarImagePicker.ts` |
| Upload file | `app/services/api/uploadApi.ts` |
| URI local vs remote | `app/utils/imageUri.ts` |
| Store | `app/models/ProfileStore.ts` |
| API user | `app/services/api/userApi.ts` |

### Hạ tầng

| Việc | File |
|------|------|
| Entry | `app/app.tsx` |
| Stack | `app/navigators/AppNavigator.tsx` |
| Tab | `app/navigators/TabNavigator.tsx` |
| HTTP client | `app/services/api/api.ts` |
| Config URL | `app/config/index.ts` |
| i18n | `app/i18n/*` |
| Persist MST | `app/models/helpers/setupRootStore.ts` |

---

## 7. Chất lượng code — compile & lint

**Mục đích:** Chứng minh mục góp ý #4 khi nộp bài.

```bash
cd d:\du_an_cong_viec\todoIT
npm run compile
npm run lint
```

| Kiểm tra | Ý nghĩa |
|----------|---------|
| `compile` | Toàn bộ type `app/` + test khớp API types |
| `lint` | ESLint Ignite rules + Prettier format |

Nếu lint fail: đọc file:line trong output — thường là `reactotron`, `no-void`, `no-inline-styles`.

---

## 8. Danh sách ưu tiên còn lại

Thứ tự gợi ý trước demo / review cuối:

1. **Chạy `npm run lint` và sửa hết lỗi** (nếu còn).
2. **Chuyển chuỗi tiếng Việt** trong `todoReminder.ts`, `usePushNotifications.ts`, `app.json` permissions sang `en.ts`.
3. **EAS:** xác nhận `EXPO_PUBLIC_API_URL` trên expo.dev cho bản APK demo.
4. **Test thiết bị:** login → todo CRUD → category → notification → profile đổi avatar (upload + PUT).
5. **Cập nhật `DOC_DEMO_MAU.md`** (nếu còn bước Welcome / optimistic / Cloudinary client).
6. (Tùy chọn) Dịch `vi.ts` hoặc hoàn thiện `ar/fr/ko` nếu cần đa ngôn ngữ thật.

---

## 9. Ghi chú khi review với mentor

- **Nguồn sự thật:** `README.md` (mục 8 API-first, mục 14 avatar 2 bước) + code `app/`.
- **Docx gốc** có thể chưa phản ánh refactor upload/i18n — dùng **bảng mục 2** tài liệu này làm checklist trạng thái.
- Nếu mentor yêu cầu **bằng chứng cụ thể**, trỏ trực tiếp file trong [mục 6](#6-map-file-theo-chức-năng-tra-cứu-nhanh).

---

*Cập nhật sau refactor: API-first stores, Login-first navigator, i18n `en.ts`, upload `POST /upload/image`, `logDev`, EAS environment variables.*
