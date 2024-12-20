<script setup lang="ts">
import { ref } from 'vue';
import { useLanguage } from '../stores/useLanguage';

interface OptimizedFile {
  name: string;
  savings: number;
  originalSize: number;
  optimizedSize: number;
  content: string;
}

const { t } = useLanguage();
const optimizedFiles = ref<OptimizedFile[]>([]);

const getOptimizationLabel = (savings: number) => {
  if (savings > 70) return t('optimizationLevelBest');
  if (savings > 50) return t('optimizationLevelGood');
  if (savings > 30) return t('optimizationLevelOk');
  return t('optimizationLevelBasic');
};

const downloadSingle = (file: OptimizedFile) => {
  const blob = new Blob([file.content], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadAll = () => {
  // Implementation for downloading all files
};

defineExpose({
  optimizeSvg: async (content: string, fileName: string) => {
    try {
      // SVG optimization logic here
      const optimizedFile: OptimizedFile = {
        name: fileName,
        savings: 50, // Example value
        originalSize: content.length,
        optimizedSize: content.length * 0.5, // Example value
        content: content
      };
      optimizedFiles.value.push(optimizedFile);
    } catch (error) {
      console.error('Error optimizing SVG:', error);
    }
  }
});
</script>

<template>
  <div class="optimizer">
    <div v-if="optimizedFiles.length > 0" class="results">
      <div class="results-header">
        <h3>{{ t('optimizationResults') }}</h3>
        <button 
          class="download-all-button" 
          @click="downloadAll"
          v-if="optimizedFiles.length > 1"
        >
          <span>📦</span>
          {{ t('downloadAll') }}
        </button>
      </div>
      
      <div class="files-list">
        <div v-for="file in optimizedFiles" 
             :key="file.name" 
             class="file-item">
          <div class="file-info">
            <div class="file-name">
              <span class="file-icon">📄</span>
              {{ file.name }}
            </div>
            <div class="optimization-info">
              <span class="optimization-label" 
                    :class="getOptimizationLabel(file.savings)">
                {{ getOptimizationLabel(file.savings) }}
              </span>
              <span class="savings">-{{ file.savings.toFixed(1) }}%</span>
            </div>
          </div>
          <button 
            class="download-button" 
            @click="() => downloadSingle(file)"
            title="Download"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.optimizer {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.results {
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.optimization-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.optimization-label {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  background: #f0f0f0;
}

.savings {
  color: #22c55e;
  font-weight: 500;
}

.download-button {
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.download-button:hover {
  transform: scale(1.1);
}

.download-all-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.download-all-button:hover {
  opacity: 0.9;
}
</style>