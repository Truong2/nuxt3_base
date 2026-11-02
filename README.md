# nuxt3_base

Nuxt 3 + Vuetify 3 · TypeScript · pnpm Workspace · Domain-oriented Nuxt Layers.

Base triển khai từ `docs/ARCHITECTURE.md`, thay đề xuất Nuxt UI/Tailwind bằng Vuetify theo yêu cầu. Đây là starter có module mẫu, chưa phải ứng dụng nghiệp vụ hoàn chỉnh.

## Chạy local

Yêu cầu Node.js >=22.12 và pnpm 10.28.2.

```bash
npm install -g pnpm@10.28.2
pnpm install --frozen-lockfile
pnpm setup
pnpm dev
```

Mở http://localhost:3000. `pnpm setup` tạo `.env` với secret ngẫu nhiên và bật demo local; giữ nguyên `.env` nếu đã tồn tại.

| Tài khoản demo     | Mật khẩu   | Quyền                            |
| ------------------ | ---------- | -------------------------------- |
| admin@example.com  | Demo@12345 | Xem, thêm, sửa, xóa quốc gia     |
| viewer@example.com | Demo@12345 | Chỉ xem; BFF cũng kiểm tra quyền |

Dữ liệu demo lưu trong RAM, tách theo session, mất khi server restart hoặc đăng nhập lại. Không bật demo trên deployment công khai.

## Những gì đã có

- Dashboard, responsive navigation, login, Country CRUD, tìm kiếm theo URL, sắp xếp/phân trang client, xác nhận xóa, loading/error/empty states.
- Vuetify module hỗ trợ SSR; theme tập trung, semantic tokens, DsButton/DsInput/DsDialog/DsPageHeader và trang `/design-system`.
- 8 packages: api-core, shared, design-system, identity, country, contract, billing, reporting. Sáu Nuxt Layers khai báo rõ trong composition manifest.
- API client nhận fetcher theo request để SSR forward context; `useAsyncData` chuyển dữ liệu qua hydration; Zod validation và chuẩn hóa lỗi.
- Nitro BFF allowlist cố định, cookie HttpOnly mã hóa, kiểm tra Origin cho mutation, private runtime config, request ID, timeout, cấm redirect upstream.
- Unit tests, Playwright flow, lint, strict typecheck, boundary checks, CI GitHub Actions, Dockerfile.
- Contract, Billing, Reporting chỉ là trang khung; không giả lập nghiệp vụ đã hoàn thành.

## Cấu trúc

```text
config/nuxt/        # layers, modules, route rules
config/vuetify.ts   # theme, component defaults
src/pages/         # application composition
src/layouts/       # shell
src/packages/      # domain và platform packages
server/            # BFF, auth endpoints, server policy
scripts/           # setup và architectural checks
tests/unit/        # API contracts, schemas, BFF route policy
tests/e2e/         # login, SSR session, CRUD, viewer authorization
docs/              # kiến trúc gốc, ADR, hướng dẫn mở rộng
```

## Kiểm tra

```bash
pnpm check
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

E2E mặc định tự khởi động dev server riêng tại cổng 3000, không chạy đồng thời với `pnpm dev`. Để test bản production đã build: `E2E_PREVIEW=1 pnpm test:e2e` (PowerShell: `$env:E2E_PREVIEW="1"; pnpm test:e2e`). CI chạy chế độ production này. Cấu hình demo/secret test được truyền riêng, không dùng credential thật.

## Kết nối backend thật

Đặt biến môi trường trên server (production không tự đọc `.env`):

```dotenv
NUXT_DEMO_MODE=false
NUXT_API_BASE_URL=https://api.example.com
NUXT_APP_ORIGIN=https://app.example.com
NUXT_SESSION_PASSWORD=<random-secret-at-least-32-characters>
```

Backend cần đáp ứng `docs/API_CONVENTIONS.md`. Đổi adapter login khi dùng OAuth/OIDC/SSO của dự án. Token lưu trong cookie session mã hóa, không vào localStorage hay response session. Giới hạn token 1500 ký tự để tránh vượt kích thước cookie; hệ thống thực nên dùng opaque session ID và server-side session store nếu token lớn hoặc cần revoke tức thời. Backend vẫn là nơi kiểm tra quyền cuối cùng.

```bash
pnpm build
pnpm start
```

Production cần HTTPS vì cookie `Secure`; dùng reverse proxy/TLS. Backend chịu trách nhiệm rate limit, password hashing, refresh/revoke và DB/audit logs. Trước public deployment: tắt demo, cấu hình secret/origin, kiểm tra contract backend, thay CODEOWNERS comment bằng team thật. CI chưa tự deploy vì chưa chọn hạ tầng.

## Tài liệu

- [Kiến trúc gốc](docs/ARCHITECTURE.md)
- [API contracts](docs/API_CONVENTIONS.md)
- [Tạo domain mới](docs/MODULE_GUIDELINES.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Quyết định Vuetify](docs/adr/0001-vuetify-and-scope.md)
- [Kết quả kiểm tra](docs/VALIDATION.md)
