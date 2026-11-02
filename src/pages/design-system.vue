<script setup lang="ts">
const value = ref('')
const dialog = ref(false)
</script>
<template>
  <DsPageHeader
    title="Design System"
    description="Tokens và các component dùng chung trên nền Vuetify 3."
  />
  <v-row>
    <v-col cols="12" md="6">
      <v-card class="pa-6">
        <h2 class="text-h6 mb-5">Buttons</h2>
        <div class="d-flex flex-wrap ga-3">
          <DsButton>Primary</DsButton>
          <DsButton variant="outlined">Outlined</DsButton>
          <DsButton disabled>Disabled</DsButton>
          <DsButton loading>Loading</DsButton>
        </div>
        <h2 class="text-h6 my-5">Form input</h2>
        <DsInput v-model="value" label="Tên hiển thị" />
        <DsInput
          label="Trạng thái lỗi"
          :error-messages="['Thông tin bắt buộc']"
        />
        <DsButton @click="dialog = true">Mở dialog</DsButton>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="pa-6">
        <h2 class="text-h6 mb-5">Semantic colors</h2>
        <div
          v-for="color in ['primary', 'secondary', 'success', 'error']"
          :key="color"
          class="d-flex align-center ga-4 mb-4"
        >
          <v-avatar :color="color" rounded="lg" />
          <span>{{ color }}</span>
        </div>
        <v-alert type="info" variant="tonal">
          Domain sử dụng Ds* cho các primitive dùng chung.
        </v-alert>
      </v-card>
    </v-col>
  </v-row>
  <DsDialog v-model="dialog" title="Dialog mẫu">
    <p>Escape để đóng. Focus được Vuetify quản lý.</p>
    <template #actions>
      <DsButton @click="dialog = false">Đóng</DsButton>
    </template>
  </DsDialog>
</template>
