<script setup lang="ts">
import { notebookStore } from "@renderer/store/notebookStore";
import type { Notebook } from "@shared/schemas/notebook";
import { onMounted, watch, computed } from "vue";
import { Theme, Locale, RENDERER_LABELS } from "@shared/types";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import VideoCell from "./celltypes/video";
import ChatCell from "./celltypes/chat";
import PyodideProvider from "./pyodide/PyodideProvider.vue";
import InputDialog from "./components/InputDialog.vue";
import { pyodideStore } from "./store/pyodideStore";

const props = defineProps<{
  id: string;
  initialNotebook: Notebook;
  theme: Theme;
  locale: Locale;
  editMode: boolean;
}>();

// Get renderer labels based on current locale
const rendererLabels = computed(() => RENDERER_LABELS[props.locale]);

onMounted(() => {
  // Load the initial notebook
  notebookStore.loadNotebook(props.initialNotebook);
});

watch(
  () => props.initialNotebook,
  newNotebook => {
    notebookStore.loadNotebook(newNotebook);
  }
);
</script>

<template>
  <PyodideProvider :notebookId="id" :locale="props.locale">
    <div class="renderer-container">
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
          :editMode="props.editMode"
        />
        <CodeCell
          v-if="cell.cell_type === 'code'"
          :cell="cell"
          :theme="props.theme"
          :locale="props.locale"
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
    </div>
    <InputDialog :locale="props.locale" />
  </PyodideProvider>
</template>

<style>
@import "@renderer/styles.css";
@import "@renderer/icons.min.css";

.renderer-container {
  padding-left: 8px;
  padding-right: 8px;
}

@media (width < 600px) {
  .renderer-container {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
