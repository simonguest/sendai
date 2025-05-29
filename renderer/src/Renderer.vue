<script setup lang="ts">
import { notebookStore } from "@renderer/store/notebookStore";
import type { Notebook } from "@renderer/schemas/notebook";
import { onMounted, watch } from "vue";
import { useTheme } from "vuetify";
import { Theme } from "@shared/types";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import PyodideProvider from "./pyodide/PyodideProvider.vue";
import { pyodideStore } from "./store/pyodideStore";

const props = defineProps<{
  id: string;
  initialNotebook: Notebook;
  theme: Theme;
}>();

onMounted(() => {
  // Set the correct theme
  const theme = useTheme();
  theme.global.name.value = props.theme || "dark";

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
  <PyodideProvider :notebookId="id">
    <div class="renderer-container">
      <v-expand-transition>
        <v-alert
          v-if="pyodideStore.workerStatus == 'initializing'"
          text="The notebook is starting up..."
          type="info"
          variant="tonal"
          density="compact"
        ></v-alert>
      </v-expand-transition>
      <v-expand-transition>
        <v-alert
          v-if="pyodideStore.workerStatus == 'error'"
          :text="`The notebook could not be started because of an error: ${pyodideStore.fatalErrorTrace}`"
          type="error"
          variant="tonal"
          density="compact"
        ></v-alert>
      </v-expand-transition>
      <div v-for="cell in notebookStore.content.cells">
        <MarkdownCell v-if="cell.cell_type === 'markdown'" :source="cell.source" :metadata="cell.metadata" />
        <CodeCell v-if="cell.cell_type === 'code'" :cell="cell" :theme="props.theme" />
      </div>
    </div>
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
