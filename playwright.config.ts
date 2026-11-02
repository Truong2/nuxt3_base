import { defineConfig } from '@playwright/test'
export default defineConfig({
  timeout: 60000,
  testDir: './tests/e2e',
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  webServer: {
    command:
      process.env.E2E_PREVIEW === '1'
        ? 'node .output/server/index.mjs'
        : 'node node_modules/nuxt/bin/nuxt.mjs dev --host 127.0.0.1',
    url: 'http://127.0.0.1:3000/login',
    reuseExistingServer: false,
    env: {
      HOST: '127.0.0.1',
      PORT: '3000',
      NUXT_DEMO_MODE: 'true',
      NUXT_SESSION_PASSWORD: 'e2e-only-secret-not-for-deployment-0123456789',
      NUXT_APP_ORIGIN: 'http://127.0.0.1:3000',
    },
    timeout: 120000,
  },
})
