<script setup lang="ts">
const modules = [
  {
    title: 'Quốc gia',
    description: 'CRUD hoàn chỉnh · validation · phân quyền',
    icon: 'mdi-earth',
    to: '/countries',
    ready: true,
  },
  {
    title: 'Hợp đồng',
    description: 'Khung module, chờ nghiệp vụ dự án',
    icon: 'mdi-file-document-outline',
    to: '/contracts',
    ready: false,
  },
  {
    title: 'Thanh toán',
    description: 'Khung module, chờ nghiệp vụ dự án',
    icon: 'mdi-credit-card-outline',
    to: '/billing',
    ready: false,
  },
  {
    title: 'Báo cáo',
    description: 'Khung module, chờ nghiệp vụ dự án',
    icon: 'mdi-chart-box-outline',
    to: '/reporting',
    ready: false,
  },
]
</script>
<template>
  <DsPageHeader
    title="Không gian làm việc"
    description="Nền tảng thống nhất để phát triển các nghiệp vụ của bạn."
    eyebrow="Tổng quan / Platform"
  >
    <DsButton to="/countries" append-icon="mdi-arrow-right">
      Mở module mẫu
    </DsButton>
  </DsPageHeader>
  <v-card color="primary" class="pa-8 mb-8">
    <v-row align="center">
      <v-col cols="12" md="8">
        <div class="text-overline mb-2">BUILT TO GROW</div>
        <h2 class="text-h4 font-weight-bold mb-4">
          Tách module rõ ràng.
          <br />
          Mở rộng cùng đội ngũ.
        </h2>
        <p style="opacity: 0.8">
          Workspace packages, Nuxt Layers và Design System dùng chung.
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-right">
        <v-icon
          icon="mdi-layers-triple-outline"
          size="110"
          style="opacity: 0.4"
        />
      </v-col>
    </v-row>
  </v-card>
  <v-row class="mb-6">
    <v-col
      v-for="stat in [
        { v: '08', t: 'Workspace packages' },
        { v: '06', t: 'Nuxt Layers' },
        { v: '01', t: 'CRUD module mẫu' },
      ]"
      :key="stat.t"
      cols="12"
      sm="4"
    >
      <v-card class="pa-6">
        <div class="text-muted text-body-2 mb-3">{{ stat.t }}</div>
        <div class="stat-number">{{ stat.v }}</div>
      </v-card>
    </v-col>
  </v-row>
  <div class="d-flex justify-space-between mb-5">
    <h2 class="text-h6">Các module nghiệp vụ</h2>
    <span class="text-caption text-muted">Composition manifest</span>
  </div>
  <v-row>
    <v-col v-for="item in modules" :key="item.to" cols="12" md="6">
      <v-card :to="item.to" class="pa-6">
        <div class="d-flex justify-space-between mb-5">
          <v-avatar color="primary" variant="tonal" rounded="lg">
            <v-icon :icon="item.icon" />
          </v-avatar>
          <v-chip
            :color="item.ready ? 'success' : 'secondary'"
            size="small"
            variant="tonal"
          >
            {{ item.ready ? 'Mẫu hoàn chỉnh' : 'Khung mở rộng' }}
          </v-chip>
        </div>
        <h3 class="mb-2">{{ item.title }}</h3>
        <p class="text-muted text-body-2">{{ item.description }}</p>
      </v-card>
    </v-col>
  </v-row>
</template>
