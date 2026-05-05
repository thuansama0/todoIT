# Phan tich gop y tu file `Nguyen Minh Thuan.docx` so voi du an `todoIT`

## Nguon tham chieu
- Tai lieu goc: `/Users/thuannguyen/Downloads/Nguyễn Minh Thuận.docx`
- Luu y: file `.docx` co mot so muc chi tiet (co the dang bang/anh) khong trich xuat duoc day du bang text.

## Tong hop doi chieu

### 1) "Environment variable" cho thong tin can an
- **Trang thai:** Da lam mot phan, dang dung dung huong.
- **Bang chung trong project:**
  - `app/config/index.ts` doc `process.env.EXPO_PUBLIC_API_URL`.
  - `app.config.ts` doc `process.env.EXPO_PUBLIC_EAS_PROJECT_ID` de nap vao `expo.extra.eas.projectId`.
  - `.env` dang co:
    - `EXPO_PUBLIC_API_URL`
    - `EXPO_PUBLIC_EAS_PROJECT_ID`
  - Da co `.env.example` de chia se schema bien moi truong.
- **Nhan xet:** Muc nay da duoc xu ly tot so voi gop y.

### 2) "Khi mo app vao Login luon, khong vao Welcome"
- **Trang thai:** Chua dat theo gop y.
- **Bang chung trong project:**
  - `app/navigators/AppNavigator.tsx` khai bao `Welcome` truoc `Login`, nen luong mac dinh vao `Welcome`.
- **De xuat:** Dat `Login` thanh screen dau tien (hoac dung `initialRouteName="Login"` cho stack).

### 3) "Ngon ngu 100% tieng Anh nhu design"
- **Trang thai:** Chua dat theo gop y.
- **Bang chung trong project:**
  - `app/utils/usePushNotifications.ts` co nhieu chuoi tieng Viet: `"Nhac viec: ..."`, `"Thong bao moi"`, `"Con it phut nua den lich cua ban"`.
  - `app/utils/todoReminder.ts` co chuoi tieng Viet tuong tu.
  - `app.json` permissions message cua `expo-image-picker` dang la tieng Viet.
- **De xuat:** Chuyen tat ca chuoi sang i18n va dat ban dich English lam mac dinh.

### 4) "Sua tat ca error & warning khi chay bun compile, bun lint"
- **Ket qua chay thuc te:**
  - `bun compile`: **PASS** (khong loi TypeScript).
  - `bun lint`: **FAIL** (17 errors, 12 warnings).
- **Nhom loi chinh khi lint:**
  - `no-void` (su dung `void`).
  - `@typescript-eslint/no-empty-function` (callback rong).
  - `react-native/no-inline-styles`, `react-native/no-color-literals`.
  - `reactotron/no-tron-in-production`.
  - `prefer-const`.
  - `@typescript-eslint/no-non-null-assertion` (warning).
- **Nhan xet:** Muc nay chua dat yeu cau.

### 5) "Su dung Ignite Boilerplate dung cach / tranh code lap / clean code"
- **Trang thai:** Chua danh gia duoc day du.
- **Ly do:** Phan text trich tu `.docx` khong hien ro cac vi tri code cu the cho cac muc:
  - "Vi pham quy tac Ignite Boilerplate"
  - "Code lap chuc nang"
  - "Khong tan dung nhung gi da co"
  - "Vi pham clean code"
- **Nhan xet:** Can ban co text/day du screenshot cua cac muc nay de doi chieu chi tiet theo tung file.

## Danh sach uu tien tiep theo (de khop gop y)
1. Doi luong khoi dong app tu `Welcome` sang `Login`.
2. Chuan hoa ngon ngu UI/notification sang English va dua chuoi vao i18n.
3. Don dep toan bo lint errors/warnings de `bun lint` pass.
4. Neu can review "Ignite rules / clean code", cung cap ban gop y day du (co vi tri file/doan code).
