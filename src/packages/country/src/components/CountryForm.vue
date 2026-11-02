<script setup lang="ts">
import {
  countryInputSchema,
  type CountryInput,
  type Country,
} from '../schemas/country.schema'
const props = defineProps<{ country?: Country | null; busy: boolean }>()
const emit = defineEmits<{ submit: [value: CountryInput] }>()
const form = reactive<CountryInput>({
  code: props.country?.code ?? '',
  name: props.country?.name ?? '',
  region: props.country?.region ?? 'Asia',
  active: props.country?.active ?? true,
})
const fields = ref<Record<string, string[] | undefined>>({})
function submit() {
  const parsed = countryInputSchema.safeParse(form)
  if (!parsed.success) {
    fields.value = parsed.error.flatten().fieldErrors
    return
  }
  fields.value = {}
  emit('submit', parsed.data)
}
</script>
<template>
  <form id="country-form" @submit.prevent="submit">
    <DsInput
      v-model="form.code"
      label="Mã quốc gia (2 chữ cái)"
      :error-messages="fields.code"
      :disabled="busy"
    />
    <DsInput
      v-model="form.name"
      label="Tên quốc gia"
      :error-messages="fields.name"
      :disabled="busy"
    />
    <v-select
      v-model="form.region"
      label="Khu vực"
      :items="['Asia', 'Europe', 'Americas', 'Africa', 'Oceania']"
      :disabled="busy"
    />
    <v-switch
      v-model="form.active"
      label="Đang hoạt động"
      color="primary"
      hide-details
      :disabled="busy"
    />
  </form>
</template>
