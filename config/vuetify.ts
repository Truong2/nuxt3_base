import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
export default defineVuetifyConfiguration({
  icons: { defaultSet: 'mdi' },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 0,
      style: 'text-transform:none;letter-spacing:0',
    },
    VCard: { rounded: 'xl', elevation: 0, border: true },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
    },
    VSelect: { variant: 'outlined', density: 'comfortable' },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#345BCE',
          secondary: '#64748B',
          background: '#F5F7FB',
          surface: '#FFFFFF',
          success: '#198565',
          error: '#BC3348',
          'on-surface': '#202B43',
        },
      },
      dark: {
        colors: {
          primary: '#9AB4FF',
          background: '#111827',
          surface: '#1E293B',
        },
      },
    },
  },
})
