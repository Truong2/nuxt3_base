# Vuetify Design System

Foundation: `config/vuetify.ts` (Vuetify theme/defaults) và `src/packages/design-system/src/assets/css/tokens.css` (CSS primitive → semantic → component tokens).

| Component    | Props / model                                                           | Slots             |
| ------------ | ----------------------------------------------------------------------- | ----------------- |
| DsButton     | tone, variant, loading, disabled, type; thuộc tính Vuetify được forward | default           |
| DsInput      | string v-model, label, errorMessages, type, disabled                    | —                 |
| DsDialog     | boolean v-model, title, busy                                            | default, actions  |
| DsPageHeader | title, description, eyebrow                                             | default (actions) |

Keyboard/focus do Vuetify primitives đảm nhiệm; app thêm focus-visible outline và accessible labels cho icon buttons. DsDialog busy ngăn đóng khi đang submit. Không claim WCAG audit hoặc visual regression đầy đủ; cần kiểm tra theo UI thực khi đưa vào sản phẩm.

Dùng VDataTable trực tiếp ở Country vì chỉ có một table consumer; tránh wrapper vô nghĩa khóa toàn bộ API slot của Vuetify. Khi nhiều domain chia sẻ pagination/filter/empty-state contract mới trích DsDataTable. Không đưa schema nghiệp vụ vào design-system.

Trang `/design-system` là catalogue ban đầu. Storybook và Figma synchronization chưa cấu hình.

Tham khảo tích hợp: https://nuxt.vuetifyjs.com/guide/ . Base pin Vuetify 3 + module 0.19.5; không tự nâng major theo latest.
