# Validation — 2026-11-02

Đã chạy trên Node 24.22.1 / pnpm 10.28.2:

| Kiểm tra                         | Kết quả                                       |
| -------------------------------- | --------------------------------------------- |
| pnpm install --frozen-lockfile   | Pass                                          |
| ESLint                           | Pass, không warning sau khi thống nhất format |
| Architectural boundaries         | Pass, 8 packages                              |
| Nuxt strict typecheck            | Pass                                          |
| Vitest                           | 18/18 pass                                    |
| Nuxt production build            | Pass, Nitro node-server                       |
| Playwright trên production build | 2/2 scenarios pass                            |

E2E bao gồm login admin/viewer, Country create/update/delete, SSR có cookie, reload giữ đăng nhập, hydration không request lặp và không báo mismatch, không lộ session secret trong HTML, viewer bị BFF từ chối ghi, anonymous 401, endpoint ngoài allowlist 404, cross-origin login 403, invalid input 422 và duplicate code 409.

Production cookie giữ Secure. Khi dùng Playwright APIRequestContext trên HTTP loopback, tests gửi cookie nhận được một cách explicit; browser navigation/reload vẫn kiểm tra cơ chế cookie thật.

Giới hạn: chưa kiểm thử backend thật, Docker runtime, deploy, accessibility audit hay visual regression toàn bộ. Dev E2E trong môi trường thực thi này bị hạn chế IPC/socket; production E2E đã chạy thành công. CI chạy production E2E. `pnpm dev` trên máy local cần kiểm tra khi onboarding; có thể dùng NITRO_NO_UNIX_SOCKET=1 nếu sandbox không hỗ trợ Unix sockets.

Dependency upstream hiện có peer warning: Nuxt 3.21.11 kéo @nuxt/cli 3.37.0 với peer @nuxt/schema 4.x trong khi app dùng schema 3.x. Không ép cài Nuxt 4; install, typecheck và production build đều qua với lockfile đã chốt. Theo dõi bản sửa upstream trước khi nâng dependency. Không coi warning này là kiểm chứng tương thích với mọi môi trường.
