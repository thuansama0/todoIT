Pet Project – Todo it 

 

Tổng quan dự án 

Đây là tài liệu yêu cầu xây dựng một dự án thực hành dành cho các bạn thực tập sinh mảng app mobile sử dụng React Native của công ty Giải Pháp Công Nghệ Tri Anh Solutions 

Người phụ trách giám sát: Lâm Hoàng Quốc 

Mục tiêu 

Biết cách sử dụng Restful API 

Biết cách sử dụng các công cụ hay dùng ở phía mobile app (frontend) 

Hiểu cơ bản hệ sinh thái NodeJS 

Hiểu về khái niệm client – server áp dụng cho một service của một project 

Biết sử dụng expo development build 

Hiểu cách tổ chức code trong một project React Native với Expo 

Cách tổ chức các navigator điều hướng 

Cách tổ chức các service hỗ trợ (api client, local storage) 

Cách tổ chức giao diện UI 

Cách quản lý global state 

Biết cách dùng các hook cơ bản trong React 

Xây dựng được một app React Native sử dụng Expo với các tính năng cơ bản 

Flow authentication & save token 

Thao tác CRUD 

Push notfication 

Làm việc với Restful API trong app react native 

Tổ chức, quản lý và sử dụng global state 

Chụp hình/ Chọn hình từ thiết bị 

Tạo UI responsive để nhìn ổn trên nhiều kích thước màn hình 

Hiển thị & xử lý lỗi mà không gây crash app 

Biết cách xử dụng boilerplate ignite-cli 

Biết cách dùng các lệnh generate component, screen, navigator 

Biết cách dùng cơ chế đa ngôn ngữ l10n 

Biết cách sử dụng api-client 

Biết cách quản lý version của một app mobile theo chuẩn Semantic Versioning 2.0.0 

Chạy được app react native debug trên cả android & iOS 

Build được app release và gửi cho người khác test 

Upload app lên playstore (nếu chịu đầu tư trả phí một lần cho play console) 

Yêu cầu 

Công nghệ 

Boilerplate: ignite-cli@9.6.3 

Expo sdk: 52. Sử dụng development build chứ không phải expo go 

Package manager: bun 

NodeJS version manager: fnm 

NodeJS version: 24.14.1 

Các thư viện hỗ trợ: 

Ưu tiên sử dụng các thư viện của expo 

Nếu không có thư viện phù hợp của expo thì mới dùng của react-native 

Environment variable: dot-env 

Code convention 

Mọi biến và hàm phải viết bằng tiếng Anh 

Tên biến là danh từ 

Tên hàm là động từ 

Comment: 

Có thể viết bằng tiếng Việt hoặc tiếng Anh 

Comment chỉ nên cho biết tại sao (why) phải viết code như vậy. KHÔNG viết comment giải thích đoạn code này làm gì hoặc chạy như thế nào (what, when, who, how) 

Dùng eslint & prettier trước khi commit code 

Những đoạn code bị lặp lại nhiều lần phải tách riêng thành hàm, component hoặc screen để tái sử dụng 

Không nên để một giá trị raw trong hàm nào đó khiến khó đọc. Nên viết nó thành một constant và gọi lại 

Không sử dụng inline style 

Các công cụ hỗ trợ khác 

Postman: Test Restful API 

Reactotron: Debug app react native 

Eas: service để hỗ trợ làm việc với app expo 

Giao diện mẫu 

https://asset-manager--hoangquoc2106.replit.app/ 

Yêu cầu xử lý logic ở dưới khác: 

Xử lý được push notification cho 3 trường hợp: 

App đang active: hiển thị toast cho biết title & content của push notification 

App đang bị minize: Bấm vào notification hệ thống là mở app lên, đi vào màn hình Danh Sách Thông Báo 

App đã bị kill: Bấm vào notification hệ thống là mở app lên, đi vào màn hình Danh Sách Thông Báo 