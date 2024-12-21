<script setup lang="ts">
  import LanguageSwitch from "../ui/LanguageSwitch.vue";
  import { useLanguage } from "../../stores/useLanguage";

  const { t } = useLanguage();

  const links = [
    {
      href: "https://github.com/wangyiyi2056/MiniSVG",
      icon: "⌨️",
      label: "GitHub",
    },
  ];

  defineEmits(["show-about"]);
</script>

<template>
  <header class="header">
    <div class="logo">
      <span>🎨</span>
      <span>Mini SVG</span>
    </div>
    <nav class="nav-links">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        class="nav-link"
        target="_blank"
      >
        <span class="link-icon">{{ link.icon }}</span>
        <span class="link-text">{{ link.label }}</span>
      </a>
      <a href="#" class="nav-link" @click.prevent="$emit('show-about')">
        <span class="link-icon">ℹ️</span>
        <span class="link-text">{{ t("about") }}</span>
      </a>
      <LanguageSwitch />
    </nav>
  </header>
</template>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 6px;
    text-decoration: none;
    color: var(--text-primary);
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
