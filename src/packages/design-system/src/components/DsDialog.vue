<script setup lang="ts">
defineProps<{ title: string; busy?: boolean }>()
const open = defineModel<boolean>({ default: false })
</script>
<template>
  <v-dialog
    v-model="open"
    max-width="560"
    :persistent="busy"
    aria-labelledby="ds-dialog-title"
  >
    <v-card>
      <v-card-title id="ds-dialog-title" class="pa-6">{{ title }}</v-card-title>
      <v-card-text><slot /></v-card-text>
      <v-card-actions class="px-6 pb-6"><slot name="actions" /></v-card-actions>
    </v-card>
  </v-dialog>
</template>
