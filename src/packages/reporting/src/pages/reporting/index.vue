<template>
  <DsPageHeader
    title="Báo cáo"
    description="Module đã được lắp ghép qua Nuxt Layers."
  />
  <v-card class="pa-10 text-center">
    <v-icon icon="mdi-puzzle-outline" color="primary" size="56" class="mb-5" />
    <h2 class="mb-3">Sẵn sàng phát triển nghiệp vụ</h2>
    <p class="text-muted mb-6">
      Đây là khung module reporting. Chưa có API hoặc dữ liệu nghiệp vụ.
    </p>
    <DsButton to="/countries" variant="outlined">
      Xem module Country mẫu
    </DsButton>
  </v-card>
</template>
