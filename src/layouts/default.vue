<script setup lang="ts">
import { useIdentity } from '@org/identity/composables'
const drawer = ref<boolean | null>(null)
const { user, logout } = useIdentity()
const logoutError = ref('')
const links = [
  { title: 'Tổng quan', to: '/', icon: 'mdi-view-dashboard-outline' },
  { title: 'Quốc gia', to: '/countries', icon: 'mdi-earth' },
  { title: 'Hợp đồng', to: '/contracts', icon: 'mdi-file-document-outline' },
  { title: 'Thanh toán', to: '/billing', icon: 'mdi-credit-card-outline' },
  { title: 'Báo cáo', to: '/reporting', icon: 'mdi-chart-box-outline' },
  { title: 'Design System', to: '/design-system', icon: 'mdi-palette-outline' },
]
async function signOut() {
  try {
    await logout()
  } catch {
    logoutError.value = 'Đăng xuất thất bại. Vui lòng thử lại.'
  }
}
</script>
<template>
  <v-navigation-drawer v-model="drawer" width="248">
    <div class="pa-7">
      <div class="d-flex align-center ga-3">
        <v-avatar color="primary" rounded="lg" size="36">
          <v-icon icon="mdi-layers-triple-outline" />
        </v-avatar>
        <strong class="text-h6">
          atlas
          <span class="text-primary">.</span>
        </strong>
      </div>
      <div class="eyebrow mt-9 mb-3">Điều hành</div>
    </div>
    <v-list class="px-3" nav color="primary">
      <v-list-item
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        :exact="item.to === '/'"
        :title="item.title"
        :prepend-icon="item.icon"
        rounded="lg"
        class="mb-2"
      />
    </v-list>
    <template #append>
      <div class="pa-5 text-caption text-muted">
        Modular workspace
        <br />
        Nuxt 3 · Vuetify 3
      </div>
    </template>
  </v-navigation-drawer>
  <v-app-bar flat border="b" height="72">
    <v-app-bar-nav-icon
      aria-label="Mở hoặc đóng menu"
      @click="drawer = !drawer"
    />
    <v-app-bar-title class="text-body-2 text-muted">
      Không gian làm việc / Nội bộ
    </v-app-bar-title>
    <v-chip size="small" variant="tonal" color="success" class="mr-5">
      Base v0.1
    </v-chip>
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          class="mr-4"
          prepend-icon="mdi-account-circle-outline"
        >
          {{ user?.name }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          title="Đăng xuất"
          prepend-icon="mdi-logout"
          @click="signOut"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
  <v-main>
    <div class="workspace">
      <v-alert v-if="logoutError" type="error" class="mb-4">
        {{ logoutError }}
      </v-alert>
      <slot />
    </div>
  </v-main>
</template>
