<script setup lang="ts">
import { ref } from 'vue';
import Header from './components/layout/Header.vue';
import SvgUploader from './components/SvgUploader.vue';
import SvgOptimizer from './components/SvgOptimizer.vue';
import { useLanguage } from './stores/useLanguage';

const { t } = useLanguage();
const optimizerRef = ref<InstanceType<typeof SvgOptimizer>>();

const handleFilesAdded = async (files: File[]) => {
  for (const file of files) {
    const content = await file.text();
    optimizerRef.value?.optimizeSvg(content, file.name);
  }
};

const handleSvgPasted = (content: string) => {
  optimizerRef.value?.optimizeSvg(content, 'pasted-svg.svg');
};
</script>

<template>
  <div class="container">
    <Header />

    <main>
      <h1 class="main-title">{{ t('title') }}</h1>
      <p class="description">{{ t('description') }}</p>
      
      <SvgUploader
        @files-added="handleFilesAdded"
        @svg-pasted="handleSvgPasted"
      />
      
      <SvgOptimizer ref="optimizerRef" />
    </main>

    <div class="footer-decoration"></div>
  </div>
</template>