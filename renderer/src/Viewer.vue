<script setup lang="ts">
import { computed } from "vue";
import { Theme, Locale, RENDERER_LABELS } from "@shared/types";
import { notebookStore } from "@renderer/store/notebookStore";
import { pyodideStore } from "./store/pyodideStore";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import VideoCell from "./celltypes/video";
import ChatCell from "./celltypes/chat";
import InputDialog from "./components/InputDialog.vue";

const props = defineProps<{
  id: string;
  theme: Theme;
  locale: Locale;
}>();

// Get renderer labels based on current locale
const rendererLabels = computed(() => RENDERER_LABELS[props.locale]);
</script>

<template>
  <div class="viewer-container">
    <v-expand-transition>
      <v-alert
        v-if="pyodideStore.workerStatus == 'initializing'"
        :text="rendererLabels.notebookStarting"
        type="info"
        variant="tonal"
        density="compact"
      ></v-alert>
    </v-expand-transition>
    <v-expand-transition>
      <v-alert
        v-if="pyodideStore.workerStatus == 'error'"
        :text="`${rendererLabels.notebookStartError} ${pyodideStore.fatalErrorTrace}`"
        type="error"
        variant="tonal"
        density="compact"
      ></v-alert>
    </v-expand-transition>

    <div v-for="cell in notebookStore.content.cells">
      <MarkdownCell
        v-if="cell.cell_type === 'markdown'"
        :cell="cell"
        :metadata="cell.metadata"
        :locale="props.locale"
        :editMode="false"
      />
      <CodeCell
        v-if="cell.cell_type === 'code'"
        :cell="cell"
        :theme="props.theme"
        :locale="props.locale"
        :editMode="false"
      />
      <VideoCell
        v-if="cell.cell_type === 'raw' && cell.metadata.tags?.includes('video')"
        :cell="cell"
        :locale="props.locale"
      />
      <ChatCell
        v-if="cell.cell_type === 'raw' && cell.metadata.tags?.includes('chat')"
        :cell="cell"
        :locale="props.locale"
      />
    </div>
    
    <InputDialog :locale="props.locale" />
  </div>
</template>

<style scoped>
.viewer-container {
  padding-left: 8px;
  padding-right: 8px;
}

@media (width < 600px) {
  .viewer-container {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
