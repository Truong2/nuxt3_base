import { defineNuxtConfig } from 'nuxt/config'
import { fileURLToPath } from 'node:url'
export default defineNuxtConfig({
  srcDir: './src',
  css: [
    fileURLToPath(new URL('./src/assets/css/main.css', import.meta.url)),
    '@mdi/font/css/materialdesignicons.css',
  ],
})
