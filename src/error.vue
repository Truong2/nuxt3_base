<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const statusCode = computed(() => props.error.statusCode || 500)
const content = computed(() => {
  switch (statusCode.value) {
    case 401:
      return {
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để tiếp tục truy cập trang này.',
        icon: 'mdi-account-lock-outline',
      }
    case 403:
      return {
        title: 'Không có quyền truy cập',
        description:
          'Tài khoản của bạn chưa được cấp quyền truy cập trang này.',
        icon: 'mdi-shield-lock-outline',
      }
    case 404:
      return {
        title: 'Không tìm thấy trang',
        description: 'Trang bạn đang tìm không tồn tại hoặc đã được chuyển đi.',
        icon: 'mdi-file-search-outline',
      }
    case 503:
      return {
        title: 'Dịch vụ tạm thời gián đoạn',
        description:
          'Hệ thống đang tạm thời không khả dụng. Vui lòng thử lại sau.',
        icon: 'mdi-server-network-off',
      }
    default:
      return {
        title: 'Đã xảy ra lỗi',
        description:
          'Không thể hoàn tất yêu cầu của bạn. Vui lòng thử lại sau.',
        icon: 'mdi-alert-circle-outline',
      }
  }
})

useHead(() => ({
  title: `${statusCode.value} · ${content.value.title} · Atlas`,
}))

function goHome() {
  return clearError({ redirect: '/' })
}

function signIn() {
  return clearError({ redirect: '/login' })
}

function retry() {
  window.location.reload()
}
</script>

<template>
  <v-app>
    <v-main class="error-page">
      <v-container class="py-12">
        <v-card class="error-card mx-auto pa-6 pa-sm-12 text-center">
          <div class="text-overline text-primary mb-8">Atlas Workspace</div>
          <v-avatar color="primary" variant="tonal" size="80" class="mb-6">
            <v-icon :icon="content.icon" size="40" aria-hidden="true" />
          </v-avatar>
          <p class="text-h2 font-weight-bold text-primary mb-4">
            {{ statusCode }}
          </p>
          <h1 class="text-h5 font-weight-bold mb-4">{{ content.title }}</h1>
          <p class="text-body-1 text-medium-emphasis mb-8">
            {{ content.description }}
          </p>
          <div class="d-flex flex-wrap justify-center ga-3">
            <v-btn
              color="primary"
              prepend-icon="mdi-home-outline"
              @click="goHome"
            >
              Về trang chủ
            </v-btn>
            <v-btn v-if="statusCode === 401" variant="outlined" @click="signIn">
              Đăng nhập
            </v-btn>
            <v-btn
              v-if="statusCode >= 500"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="retry"
            >
              Thử lại
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  min-height: 100vh;
}

.error-card {
  max-width: 600px;
}
</style>
