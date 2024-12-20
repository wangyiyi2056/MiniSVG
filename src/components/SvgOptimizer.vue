<script setup lang="ts">
  import { ref } from "vue";
  import { useLanguage } from "../stores/useLanguage";
  import { optimize } from "svgo";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";

  interface OptimizedSvg {
    name: string;
    original: string;
    optimized: string;
    savings: number;
  }

  const { t } = useLanguage();
  const optimizedFiles = ref<OptimizedSvg[]>([]);

  const getOptimizationLabel = (savings: number) => {
    if (savings >= 50) return "excellent";
    if (savings >= 30) return "good";
    return "moderate";
  };

  const optimizeSvg = async (content: string, filename: string) => {
    try {
      const result = optimize(content, {
        multipass: true,
        plugins: [
          "removeDoctype",
          "removeXMLProcInst",
          "removeComments",
          "removeMetadata",
          "removeEditorsNSData",
          "cleanupAttrs",
          "mergeStyles",
          "inlineStyles",
          "minifyStyles",
          "removeUselessDefs",
          "cleanupNumericValues",
          "convertColors",
          "removeUnknownsAndDefaults",
          "removeNonInheritableGroupAttrs",
          "removeUselessStrokeAndFill",
          "removeViewBox",
          "cleanupEnableBackground",
          "removeHiddenElems",
          "removeEmptyText",
          "convertShapeToPath",
          "convertEllipseToCircle",
          "moveElemsAttrsToGroup",
          "moveGroupAttrsToElems",
          "collapseGroups",
          "convertPathData",
          "convertTransform",
          "removeEmptyAttrs",
          "removeEmptyContainers",
          "mergePaths",
          "removeUnusedNS",
          "sortDefsChildren",
          "removeTitle",
          "removeDesc",
        ],
      });

      const originalSize = new Blob([content]).size;
      const optimizedSize = new Blob([result.data]).size;
      const savings = ((originalSize - optimizedSize) / originalSize) * 100;

      optimizedFiles.value.push({
        name: filename,
        original: content,
        optimized: result.data,
        savings,
      });
    } catch (error) {
      console.error(`Error optimizing ${filename}:`, error);
    }
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
