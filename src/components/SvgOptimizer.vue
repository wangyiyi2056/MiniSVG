<script setup lang="ts">
  import { ref } from "vue";
  import { useLanguage } from "../stores/useLanguage";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  import SvgPreviewDialog from "./svg/SvgPreviewDialog.vue";

  interface WorkerMessage {
    type: "progress" | "complete" | "error";
    data: {
      filename?: string;
      name?: string;
      original?: string;
      optimized?: string;
      savings?: number;
      progress?: number;
      error?: string;
    };
  }

  interface OptimizedSvg {
    name: string;
    original: string;
    optimized: string;
    savings: number;
  }

  const { t } = useLanguage();
  const optimizedFiles = ref<OptimizedSvg[]>([]);
  const selectedFile = ref<OptimizedSvg | null>(null);
  const showPreview = ref(false);
  const processingFiles = ref(new Set<string>());
  const optimizationProgress = ref<Record<string, number>>({});

  const getOptimizationLabel = (savings: number) => {
    if (savings >= 50) return "excellent";
    if (savings >= 30) return "good";
    return "moderate";
  };

  const worker = new Worker(
    new URL("../workers/svgOptimizer.worker.ts", import.meta.url),
    { type: "module" }
  );

  worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const { type, data } = e.data;

    if (type === "progress") {
      if (data.filename && data.progress !== undefined) {
        optimizationProgress.value[data.filename] = data.progress;
      }
    } else if (type === "complete") {
      if (
        data.name &&
        data.original &&
        data.optimized &&
        data.savings !== undefined
      ) {
        optimizedFiles.value.push({
          name: data.name,
          original: data.original,
          optimized: data.optimized,
          savings: data.savings,
        });
        processingFiles.value.delete(data.name);
        delete optimizationProgress.value[data.name];
      }
    } else if (type === "error") {
      if (data.filename) {
        processingFiles.value.delete(data.filename);
        delete optimizationProgress.value[data.filename];
        console.error(`Error optimizing ${data.filename}:`, data.error);
      }
    }
  };

  const optimizeSvg = async (content: string, filename: string) => {
    if (processingFiles.value.has(filename)) return;

    processingFiles.value.add(filename);
    optimizationProgress.value[filename] = 0;

    worker.postMessage({ content, filename });
  };

  const downloadSingle = (file: OptimizedSvg) => {
    const blob = new Blob([file.optimized], { type: "image/svg+xml" });
    saveAs(blob, `optimized-${file.name}`);
  };

  const downloadAll = async () => {
    if (optimizedFiles.value.length === 0) return;

    const zip = new JSZip();
    optimizedFiles.value.forEach((file) => {
      zip.file(`optimized-${file.name}`, file.optimized);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "optimized-svgs.zip");
  };

  const togglePreview = (file: OptimizedSvg) => {
    selectedFile.value = file;
    showPreview.value = true;
  };

  const closePreview = () => {
    showPreview.value = false;
    selectedFile.value = null;
  };

  const getFileSize = (content: string) => {
    return (new Blob([content]).size / 1024).toFixed(2);
  };

  defineExpose({
    optimizeSvg,
  });
</script>

<template>
  <div class="optimizer">
    <div v-if="optimizedFiles.length > 0" class="results">
      <div class="results-header">
        <h3>{{ t("optimizationResults") }}</h3>
        <button
          class="download-all-button"
          @click="downloadAll"
          v-if="optimizedFiles.length > 1"
        >
          <span>📦</span>
          {{ t("downloadAll") }}
        </button>
      </div>

      <div class="files-list">
        <div v-for="file in optimizedFiles" :key="file.name" class="file-item">
          <div class="file-info">
            <div class="file-name">
              <span class="file-icon">📄</span>
              {{ file.name }}
            </div>
            <div class="optimization-info">
              <span
                class="optimization-label"
                :class="getOptimizationLabel(file.savings)"
              >
                {{ getOptimizationLabel(file.savings) }}
              </span>
              <span class="savings">-{{ file.savings.toFixed(1) }}%</span>
            </div>
          </div>
          <div class="file-actions">
            <button class="preview-button" @click="togglePreview(file)">
              👁️ {{ t("preview") }}
            </button>
            <button
              class="download-button"
              @click="() => downloadSingle(file)"
              title="Download"
            >
              ⬇️
            </button>
          </div>
          <div
            v-if="processingFiles.has(file.name)"
            class="optimization-progress"
          >
            <div
              class="progress-bar"
              :style="{ width: `${optimizationProgress[file.name]}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <SvgPreviewDialog v-model="showPreview" :file="selectedFile" />
  </div>
</template>

<style scoped>
  .optimizer {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .results {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    height: 450px;
    margin-bottom: 2rem;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0 1rem;
  }

  .files-list {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
    padding-bottom: 3rem;
    padding-top: 0.5rem;
  }

  .files-list::-webkit-scrollbar {
    width: 8px;
  }

  .files-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .files-list::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .files-list::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .file-item {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 8px;
    padding: 0.75rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: relative;
    height: 120px;
    border: 1px solid #eee;
    transition: all 0.2s ease;
  }

  .file-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-color: var(--accent-color);
  }

  .file-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    height: 50px;
  }

  .file-name {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .optimization-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 0.25rem;
  }

  .optimization-label {
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    background: #f8f9fa;
  }

  .savings {
    color: #22c55e;
    font-weight: 500;
  }

  .download-button {
    background: transparent;
    border: none;
    padding: 0.4rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .download-button:hover {
    background-color: #f0f0f0;
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

  .optimization-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #eee;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.3s ease;
  }

  .file-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 0.75rem;
    border-top: 1px solid #eee;
    margin-bottom: 0.25rem;
  }

  .preview-button {
    background: transparent;
    border: none;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 4px;
    transition: all 0.2s;
    color: var(--accent-color);
    border: 1px solid var(--accent-color);
  }

  .preview-button:hover {
    background-color: var(--accent-color);
    color: white;
  }
</style>
