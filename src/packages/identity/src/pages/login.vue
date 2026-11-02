<script setup lang="ts">
definePageMeta({ layout: false })
const { login, refreshSession } = useIdentity()
const { data: session } = await useAsyncData('login:session', refreshSession)
const email = ref('')
const password = ref('')
const busy = ref(false)
const error = ref('')
async function submit() {
  busy.value = true
  error.value = ''
  try {
    await login(email.value, password.value)
    clearNuxtData()
    await navigateTo('/')
  } catch {
    error.value =
      'Không đăng nhập được. Kiểm tra tài khoản hoặc cấu hình backend.'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <v-main>
    <v-container class="fill-height" style="min-height: 100vh">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <div class="eyebrow mb-5">ATLAS / WORKSPACE</div>
          <h1 class="page-heading mb-3">Chào mừng trở lại.</h1>
          <p class="text-muted mb-8">Một nền tảng. Nhiều nghiệp vụ.</p>
          <v-card class="pa-7">
            <form @submit.prevent="submit">
              <v-alert v-if="error" type="error" class="mb-5">
                {{ error }}
              </v-alert>
              <DsInput
                v-model="email"
                label="Email"
                type="email"
                autocomplete="username"
              />
              <DsInput
                v-model="password"
                label="Mật khẩu"
                type="password"
                autocomplete="current-password"
              />
              <DsButton block type="submit" :loading="busy">Đăng nhập</DsButton>
            </form>
          </v-card>
          <v-alert
            v-if="session?.demo"
            variant="tonal"
            class="mt-5"
            type="info"
          >
            <strong>Môi trường demo</strong>
            <br />
            admin@example.com / Demo@12345
            <br />
            viewer@example.com / Demo@12345
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>
