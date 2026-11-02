<script setup lang="ts">
withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    tone?: 'primary' | 'error' | 'secondary'
    variant?: 'flat' | 'text' | 'outlined'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  { tone: 'primary', variant: 'flat', type: 'button' },
)
</script>
<template>
  <v-btn
    :color="tone"
    :variant="variant"
    :loading="loading"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </v-btn>
</template>
