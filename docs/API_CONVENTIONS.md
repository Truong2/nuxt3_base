# API conventions

## Authentication

`POST /auth/login` phía backend nhận `{ email, password }`, trả `{ user: { id, name, email, permissions: string[] }, accessToken }`. BFF `POST /api/auth/login` kiểm tra Zod và tạo cookie session, chỉ trả `{ user }`.

`GET /api/auth/session` trả `{ user: User | null, demo: boolean }`. `POST /api/auth/logout` xóa cookie. Backend production phải có rate limit, xác thực, lưu trữ mật khẩu an toàn, refresh/revocation theo dự án. Adapter hiện không triển khai refresh token.

## Country

| BFF                                 | Backend                 | Permission    |
| ----------------------------------- | ----------------------- | ------------- |
| GET /api/backend/countries          | GET /countries          | country:read  |
| POST /api/backend/countries         | POST /countries         | country:write |
| PUT /api/backend/countries/:uuid    | PUT /countries/:uuid    | country:write |
| DELETE /api/backend/countries/:uuid | DELETE /countries/:uuid | country:write |

Input: `{ code: 'VN', name: 'Việt Nam', region: 'Asia', active: true }`. Code 2 chữ cái, normalize uppercase. Region: Asia/Europe/Americas/Africa/Oceania. Output country thêm `id` UUID.

Response thành công: `{ success: true, data: ... }`. GET trả array, POST/PUT trả country, DELETE trả `{ id }`. Lỗi dùng HTTP status và `{ message, data?: { errors } }`. UI chuẩn hóa qua ApiClientError. BFF hiện thay message lỗi backend bằng thông báo an toàn, không chuyển raw body backend ra browser.

Mọi mutation từ browser cần same-origin `Origin`. Client API trực tiếp cũng phải gửi header này. Chỉ forward bearer và correlation ID tới HTTPS upstream cố định; không forward cookie browser hoặc arbitrary URL. Không cache session/API responses.

Pagination/filter hiện chạy client trên danh sách nhỏ. Khi dữ liệu lớn, đổi list schema thành `{ items, total, page, pageSize }`, validate query BFF, chuyển sang VDataTableServer.
