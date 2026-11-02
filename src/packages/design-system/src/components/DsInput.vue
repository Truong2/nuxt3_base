<script setup lang="ts">
defineProps<{
  label: string
  errorMessages?: string[]
  type?: string
  disabled?: boolean
}>()
const model = defineModel<string>({ default: '' })
</script>
<template>
  <v-text-field
    v-model="model"
    :label="label"
    :error-messages="errorMessages"
    :type="type || 'text'"
    :disabled="disabled"
  />
</template>
