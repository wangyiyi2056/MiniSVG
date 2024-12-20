<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
}>();
</script>

<template>
  <button :class="['button', variant || 'primary']">
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
  border: none;
}

.button.primary {
  background-color: var(--accent-color);
  color: white;
}

.button:hover {
  opacity: 0.9;
}
</style>