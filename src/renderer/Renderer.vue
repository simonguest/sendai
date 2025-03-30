<script setup lang="ts">
import { notebookStore } from "@renderer/store/notebookStore";
import type { Notebook } from "@renderer/schemas/notebook";
import { onMounted, watch } from "vue";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import PyodideProvider from "./pyodide/PyodideProvider.vue";

const props = defineProps<{
  id: string;
  initialNotebook: Notebook;
}>();

onMounted(() => {
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
      <div v-for="cell in notebookStore.content.cells">
        <MarkdownCell v-if="cell.cell_type === 'markdown'" :source="cell.source" />
        <CodeCell v-if="cell.cell_type === 'code'" :cell="cell"/>
      </div>
    </div>
  </PyodideProvider>
</template>

<style>
@import "@renderer/styles.css";

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
