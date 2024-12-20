<script setup lang="ts">
import LanguageSwitch from '../ui/LanguageSwitch.vue';
import { useLanguage } from '../../stores/useLanguage';

const { t } = useLanguage();

const links = [
  { href: 'https://twitter.com', icon: '𝕏', label: 'Twitter' },
  { href: 'https://github.com', icon: '⌨️', label: 'GitHub' },
  { href: '#about', icon: 'ℹ️', label: t('about') }
];
</script>

<template>
  <header class="header">
    <div class="logo">
      <span>🎨</span>
      <span>SVG Factory</span>
    </div>
    <nav class="nav-links">
      <a v-for="link in links" 
         :key="link.href" 
         :href="link.href" 
         class="nav-link"
         target="_blank">
         <span class="link-icon">{{ link.icon }}</span>
         <span class="link-text">{{ link.label }}</span>
      </a>
      <LanguageSwitch />
    </nav>
  </header>
</template>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.link-icon {
  font-size: 1.2rem;
}

.link-text {
  font-size: 0.9rem;
}
</style>