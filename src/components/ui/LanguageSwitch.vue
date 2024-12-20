<script setup lang="ts">
import { useLanguage } from '../../stores/useLanguage';

const { currentLanguage, toggleLanguage } = useLanguage();
</script>

<template>
  <button class="lang-switch" @click="toggleLanguage" :title="currentLanguage === 'en' ? '切换到中文' : 'Switch to English'">
    <span class="lang-icon">{{ currentLanguage === 'en' ? '🇨🇳' : '🇺🇸' }}</span>
  </button>
</template>

<style scoped>
.lang-switch {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-switch:hover {
  transform: scale(1.1);
}

.lang-icon {
  font-size: 1.5rem;
  line-height: 1;
}
</style>