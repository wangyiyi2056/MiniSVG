<script setup lang="ts">
defineProps<{
  name: string;
  size?: string;
}>();
</script>

<template>
  <span class="icon" :style="{ fontSize: size || '3rem' }">
    {{ name }}
  </span>
</template>

<style scoped>
.icon {
  display: inline-block;
  line-height: 1;
}
</style>