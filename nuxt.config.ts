import { applicationLayers } from './config/nuxt/layers'
import { applicationModules } from './config/nuxt/modules'
import { routeRules } from './config/nuxt/route-rules'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: './src',
  serverDir: './server',
  extends: applicationLayers,
  modules: applicationModules,
  routeRules,
  devtools: { enabled: false },
  runtimeConfig: {
    apiBaseUrl: '',
    sessionPassword: '',
    demoMode: false,
    appOrigin: 'http://localhost:3000',
    public: { apiPrefix: '/api/backend' },
  },
  typescript: { strict: true },
  app: {
    head: {
      title: 'Atlas · Modular Workspace',
      htmlAttrs: { lang: 'vi' },
      meta: [
        {
          name: 'description',
          content: 'Nuxt 3 + Vuetify modular workspace starter',
        },
      ],
    },
  },
  vuetify: {
    moduleOptions: { prefixComposables: true },
    vuetifyOptions: './config/vuetify.ts',
  },
})
