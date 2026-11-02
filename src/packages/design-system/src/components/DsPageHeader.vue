<script setup lang="ts">
defineProps<{ title: string; description?: string; eyebrow?: string }>()
</script>
<template>
  <div class="d-flex flex-wrap align-end justify-space-between ga-4 mb-8">
    <div>
      <div class="eyebrow mb-3">{{ eyebrow || 'Workspace' }}</div>
      <h1 class="page-heading mb-3">{{ title }}</h1>
      <p class="text-muted">{{ description }}</p>
    </div>
    <div class="d-flex ga-2"><slot /></div>
  </div>
</template>
