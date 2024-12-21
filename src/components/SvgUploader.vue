<script setup lang="ts">
  import { ref } from "vue";
  import { useLanguage } from "../stores/useLanguage";

  const { t } = useLanguage();
  const emit = defineEmits<{
    (e: "filesAdded", files: File[]): void;
    (e: "svgPasted", content: string): void;
    (e: "uploadProgress", progress: number): void;
  }>();

  const dragActive = ref(false);
  const uploadProgress = ref(0);
  const errorMessage = ref("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      errorMessage.value = t("fileSizeError", { size: "5MB" });
      return false;
    }
    if (file.type !== "image/svg+xml") {
      errorMessage.value = t("fileTypeError");
      return false;
    }
    return true;
  };

  const handleFiles = async (files: File[]) => {
    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;

    uploadProgress.value = 0;
    const totalFiles = validFiles.length;

    for (let i = 0; i < validFiles.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 模拟上传延迟
      uploadProgress.value = ((i + 1) / totalFiles) * 100;
      emit("uploadProgress", uploadProgress.value);
    }

    emit("filesAdded", validFiles);
    uploadProgress.value = 0;
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    dragActive.value = false;

    const files = Array.from(e.dataTransfer?.files || []).filter(
      (file) => file.type === "image/svg+xml"
    );

    if (files.length > 0) {
      emit("filesAdded", files);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const text = e.clipboardData?.getData("text");
    if (text?.includes("<svg")) {
      emit("svgPasted", text);
    }
  };

  const handleFileInput = (e: Event) => {
    const files = Array.from((e.target as HTMLInputElement).files || []).filter(
      (file) => file.type === "image/svg+xml"
    );

    if (files.length > 0) {
      emit("filesAdded", files);
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
      <h3>{{ t("uploadText") }}</h3>

      <div v-if="uploadProgress > 0" class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>

      <p v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </p>

      <p class="file-limits">
        {{ t("fileLimits") }}
      </p>
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

  .progress-bar {
    width: 100%;
    height: 4px;
    background: #eee;
    border-radius: 2px;
    margin: 1rem 0;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.3s ease;
  }

  .error-message {
    color: #dc2626;
    margin-top: 1rem;
    font-size: 0.9rem;
  }

  .file-limits {
    color: #666;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
</style>
