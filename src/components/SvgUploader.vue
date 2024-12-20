<script setup lang="ts">
import { ref } from 'vue';
import { useLanguage } from '../stores/useLanguage';

const { t } = useLanguage();
const emit = defineEmits<{
  (e: 'filesAdded', files: File[]): void
  (e: 'svgPasted', content: string): void
}>();

const dragActive = ref(false);

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  dragActive.value = false;
  
  const files = Array.from(e.dataTransfer?.files || [])
    .filter(file => file.type === 'image/svg+xml');
  
  if (files.length > 0) {
    emit('filesAdded', files);
  }
};

const handlePaste = async (e: ClipboardEvent) => {
  const text = e.clipboardData?.getData('text');
  if (text?.includes('<svg')) {
    emit('svgPasted', text);
  }
};

const handleFileInput = (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
    .filter(file => file.type === 'image/svg+xml');
  
  if (files.length > 0) {
    emit('filesAdded', files);
  }
};
</script>

<template>
  <div
    class="upload-area"
    :class="{ 'drag-active': dragActive }"
    @dragenter.prevent="dragActive = true"
    @dragleave.prevent="dragActive = false"
    @dragover.prevent
    @drop="handleDrop"
    @paste="handlePaste"
  >
    <input
      type="file"
      accept=".svg"
      multiple
      @change="handleFileInput"
      class="file-input"
    />
    <div class="upload-content">
      <div class="upload-icon">✌️</div>
      <h3>{{ t('uploadText') }}</h3>
    </div>
  </div>
</template>

<style scoped>
.upload-area {
  border: 2px dashed var(--accent-color);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  margin: 2rem 0;
}

.drag-active {
  border-color: var(--accent-color);
  background-color: rgba(44, 44, 44, 0.05);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--text-color);
}
</style>