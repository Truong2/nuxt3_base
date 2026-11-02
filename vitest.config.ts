import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
  resolve: {
    alias: {
      '@org/api-core': fileURLToPath(
        new URL('./src/packages/api-core/src/index.ts', import.meta.url),
      ),
      '@org/country': fileURLToPath(
        new URL('./src/packages/country/src/public.ts', import.meta.url),
      ),
    },
  },
})
