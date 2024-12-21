<script setup lang="ts">
  import { useLanguage } from "../../stores/useLanguage";

  const { t } = useLanguage();

  interface Props {
    modelValue: boolean;
    file?: {
      name: string;
      original: string;
      optimized: string;
    } | null;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
  }>();

  const getFileSize = (content: string) => {
    return (new Blob([content]).size / 1024).toFixed(2);
  };
</script>

<template>
  <div v-if="modelValue" class="preview-modal">
    <div class="preview-content">
      <div class="preview-header">
        <h3>{{ file?.name }}</h3>
        <button class="close-button" @click="emit('update:modelValue', false)">
          ✕
        </button>
      </div>

      <div class="preview-comparison">
        <div class="preview-section">
          <h4>{{ t("original") }}</h4>
          <div class="svg-preview" v-if="file" v-html="file.original"></div>
          <div class="size-info" v-if="file">
            {{ getFileSize(file.original) }}KB
          </div>
        </div>

        <div class="preview-section">
          <h4>{{ t("optimized") }}</h4>
          <div class="svg-preview" v-if="file" v-html="file.optimized"></div>
          <div class="size-info" v-if="file">
            {{ getFileSize(file.optimized) }}KB
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .preview-content {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    overflow-y: auto;
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .preview-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .close-button {
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    color: var(--text-primary);
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .close-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .preview-comparison {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .preview-section h4 {
    margin: 0 0 1rem;
    color: var(--text-primary);
  }

  .svg-preview {
    border: 1px solid #eee;
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }

  .svg-preview :deep(svg) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }

  .size-info {
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }
</style>
