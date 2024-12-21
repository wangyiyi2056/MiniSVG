<script setup lang="ts">
  import { ref } from "vue";
  import Header from "./components/layout/Header.vue";
  import SvgUploader from "./components/SvgUploader.vue";
  import SvgOptimizer from "./components/SvgOptimizer.vue";
  import About from "./components/About.vue";
  import { useLanguage } from "./stores/useLanguage";

  const { t } = useLanguage();
  const optimizerRef = ref<InstanceType<typeof SvgOptimizer>>();
  const showAbout = ref(false);

  const handleFilesAdded = async (files: File[]) => {
    for (const file of files) {
      const content = await file.text();
      optimizerRef.value?.optimizeSvg(content, file.name);
    }
  };

  const handleSvgPasted = (content: string) => {
    optimizerRef.value?.optimizeSvg(content, "pasted-svg.svg");
  };

  const toggleAbout = () => {
    showAbout.value = !showAbout.value;
  };
</script>

<template>
  <div class="container">
    <Header @show-about="toggleAbout" />

    <main>
      <h1 class="main-title">{{ t("title") }}</h1>
      <p class="description">{{ t("description") }}</p>

      <About v-if="showAbout" />
      <template v-else>
        <SvgUploader
          @files-added="handleFilesAdded"
          @svg-pasted="handleSvgPasted"
        />
        <SvgOptimizer ref="optimizerRef" />
      </template>
    </main>

    <div class="footer-decoration"></div>
  </div>
</template>

<style>
  :root {
    --bg-primary: #f8f9fa; /* 浅灰色背景 */
    --accent-color: #2c3e50; /* 深蓝灰色主题色 */
    --text-primary: #2c3e50;
    --border-color: #e9ecef;
  }

  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  }
</style>
