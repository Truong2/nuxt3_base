# ADR 0001 — Vuetify và phạm vi base

Accepted for this starter.

Giữ quyết định pnpm Workspace + Domain-oriented Modular Monolith + Nuxt Layers từ ARCHITECTURE.md. Thay gợi ý Nuxt UI/Tailwind bằng Vuetify 3 theo yêu cầu người dùng. Root sở hữu modules/config/auth policy/BFF. UI tokens và primitives thuộc design-system.

Country là vertical slice có schema/repository/UI/BFF/demo/test. Contract, Billing, Reporting là extension shells; chưa có SRS nên không tự đặt nghiệp vụ. Identity cung cấp demo và adapter backend theo contract rõ ràng; chưa phải enterprise IAM hoàn chỉnh.

Không dùng Nx, microfrontends, event bus hay repository class cho mọi endpoint. Chưa thêm Storybook, visual regression, deployment workflow, audit logs, real DB, distributed session/revocation. Đây là các việc sau khi dự án chọn backend/infra và SRS.
