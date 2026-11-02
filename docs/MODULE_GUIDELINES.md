# Tạo domain mới

1. Copy cấu trúc `country`, đổi tên package `@org/<domain>` và prefix component/composable/async-data keys.
2. Chỉ tạo những folder cần thiết: api, schemas, components, composables, pages; thêm application khi có orchestration nhiều bước.
3. Trong package.json khai báo mọi dependency dùng trực tiếp; export public contract từ `src/public.ts`. Không export `src/*`.
4. Thêm workspace dependency ở root, đăng ký Nuxt Layer trong `config/nuxt/layers.ts`.
5. Thêm navigation ở application shell; UI shared đi qua Ds\*, domain-specific dùng Vuetify khi phù hợp.
6. Thêm endpoint BFF allowlist và permission explicit. Không mở generic proxy tùy ý.
7. Fetch đọc dùng `useAsyncData` với repository inject `useRequestFetch`; mutations gọi repository từ event.
8. Thêm tests schema/API/UI tùy nghiệp vụ, chạy `pnpm check`, build, E2E; cập nhật owner/docs.

Không dùng alias `~` để tham chiếu nội bộ layer. Dùng relative trong cùng package; dùng `@org/name` khi qua package public API. Cross-domain import phải được khai báo dependency, không chu kỳ. Boundary checker dùng TypeScript AST; kiểm tra relative imports, aliases và exports, khai báo workspace dependencies, hướng platform, chu kỳ. Auto-import Nuxt vẫn là global integration: dùng prefix domain, review không gọi composable nội bộ domain khác. Checker không chứng minh isolation của auto-import hoặc dynamic runtime strings.

Không tạo store global cho mọi API response. Dùng ref/reactive cho local state, useAsyncData cho server state, useState request-scoped cho identity. Chưa thêm Pinia vì base chưa có state phức tạp.
