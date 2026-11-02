<script setup lang="ts">
import { useIdentity } from '@org/identity/composables'
import { useCountryRepository } from '../../composables/useCountryRepository'
import type { Country, CountryInput } from '../../schemas/country.schema'
import CountryForm from '../../components/CountryForm.vue'
const repo = useCountryRepository()
const { can } = useIdentity()
const { data, status, error, refresh } = await useAsyncData(
  'country:list',
  () => repo.list(),
)
const route = useRoute()
const router = useRouter()
const search = computed({
  get: () => String(route.query.q || ''),
  set: (q: string) => {
    void router.replace({ query: { ...route.query, q: q || undefined } })
  },
})
const rows = computed(() =>
  (data.value ?? []).filter((x) =>
    `${x.name} ${x.code} ${x.region}`
      .toLowerCase()
      .includes(search.value.toLowerCase()),
  ),
)
const dialog = ref(false)
const selected = ref<Country | null>(null)
const deleting = ref<Country | null>(null)
const busy = ref(false)
const failure = ref('')
const toast = ref('')
function open(item: Country | null = null) {
  selected.value = item
  failure.value = ''
  dialog.value = true
}
function confirmDelete(item: Country) {
  deleting.value = item
  failure.value = ''
}
async function save(input: CountryInput) {
  busy.value = true
  failure.value = ''
  try {
    if (selected.value) await repo.update(selected.value.id, input)
    else await repo.create(input)
    dialog.value = false
    toast.value = 'Đã lưu quốc gia'
    await refresh()
  } catch (e) {
    failure.value = e instanceof Error ? e.message : 'Không lưu được'
  } finally {
    busy.value = false
  }
}
async function remove() {
  if (!deleting.value) return
  busy.value = true
  failure.value = ''
  try {
    await repo.remove(deleting.value.id)
    deleting.value = null
    toast.value = 'Đã xóa quốc gia'
    await refresh()
  } catch (e) {
    failure.value = e instanceof Error ? e.message : 'Không xóa được'
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <DsPageHeader
    title="Quốc gia"
    description="Quản lý danh mục quốc gia dùng chung trong hệ thống."
    eyebrow="Danh mục / Country"
  >
    <DsButton
      v-if="can('country:write')"
      prepend-icon="mdi-plus"
      @click="open()"
    >
      Thêm quốc gia
    </DsButton>
  </DsPageHeader>
  <v-row class="mb-6">
    <v-col cols="12" sm="4">
      <v-card class="pa-5">
        <p class="text-muted mb-2">Tổng quốc gia</p>
        <div class="stat-number">{{ data?.length ?? 0 }}</div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card class="pa-5">
        <p class="text-muted mb-2">Đang hoạt động</p>
        <div class="stat-number text-success">
          {{ data?.filter((x) => x.active).length ?? 0 }}
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4">
      <v-card class="pa-5">
        <p class="text-muted mb-2">Quyền của bạn</p>
        <div class="text-h6 mt-4">
          {{ can('country:write') ? 'Quản trị danh mục' : 'Chỉ xem' }}
        </div>
      </v-card>
    </v-col>
  </v-row>
  <v-alert v-if="error" type="error" class="mb-4">
    Không tải được danh sách.
    <v-btn variant="text" @click="refresh()">Thử lại</v-btn>
  </v-alert>
  <v-card>
    <div class="pa-5 d-flex flex-wrap align-center justify-space-between ga-4">
      <h2 class="text-subtitle-1 font-weight-bold">
        Danh sách quốc gia
        <span class="text-muted">({{ rows.length }})</span>
      </h2>
      <v-text-field
        v-model="search"
        label="Tìm quốc gia"
        prepend-inner-icon="mdi-magnify"
        hide-details
        style="max-width: 320px"
        clearable
        @click:clear="search = ''"
      />
    </div>
    <v-progress-linear
      v-if="status === 'pending'"
      indeterminate
      color="primary"
    />
    <v-data-table
      :items="rows"
      :headers="[
        { title: 'Mã', key: 'code' },
        { title: 'Quốc gia', key: 'name' },
        { title: 'Khu vực', key: 'region' },
        { title: 'Trạng thái', key: 'active' },
        { title: 'Thao tác', key: 'actions', sortable: false },
      ]"
      :items-per-page="10"
      no-data-text="Chưa có quốc gia phù hợp"
      items-per-page-text="Số dòng"
    >
      <template #item.code="{ item }">
        <v-chip size="small" label>{{ item.code }}</v-chip>
      </template>
      <template #item.active="{ item }">
        <v-chip
          size="small"
          :color="item.active ? 'success' : 'secondary'"
          variant="tonal"
        >
          {{ item.active ? 'Hoạt động' : 'Tạm dừng' }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <template v-if="can('country:write')">
          <v-btn
            icon="mdi-pencil-outline"
            size="small"
            variant="text"
            :aria-label="`Sửa ${item.name}`"
            @click="open(item)"
          />
          <v-btn
            icon="mdi-trash-can-outline"
            size="small"
            variant="text"
            color="error"
            :aria-label="`Xóa ${item.name}`"
            @click="confirmDelete(item)"
          />
        </template>
        <span v-else class="text-muted">—</span>
      </template>
    </v-data-table>
  </v-card>
  <DsDialog
    v-model="dialog"
    :title="selected ? 'Sửa quốc gia' : 'Thêm quốc gia'"
    :busy="busy"
  >
    <v-alert v-if="failure" type="error" class="mb-4">{{ failure }}</v-alert>
    <CountryForm
      v-if="dialog"
      :key="selected?.id || 'new'"
      :country="selected"
      :busy="busy"
      @submit="save"
    />
    <template #actions>
      <DsButton variant="text" :disabled="busy" @click="dialog = false">
        Hủy
      </DsButton>
      <DsButton type="submit" form="country-form" :loading="busy">
        Lưu quốc gia
      </DsButton>
    </template>
  </DsDialog>
  <DsDialog
    :model-value="!!deleting"
    title="Xóa quốc gia?"
    :busy="busy"
    @update:model-value="!$event && (deleting = null)"
  >
    <v-alert v-if="failure" type="error" class="mb-4">{{ failure }}</v-alert>
    <p>Bạn muốn xóa {{ deleting?.name }}? Thao tác này không thể hoàn tác.</p>
    <template #actions>
      <DsButton variant="text" :disabled="busy" @click="deleting = null">
        Hủy
      </DsButton>
      <DsButton tone="error" :loading="busy" @click="remove">
        Xác nhận xóa
      </DsButton>
    </template>
  </DsDialog>
  <v-snackbar
    :model-value="!!toast"
    :timeout="3000"
    @update:model-value="!$event && (toast = '')"
  >
    {{ toast }}
  </v-snackbar>
</template>
