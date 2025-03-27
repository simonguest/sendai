<script setup lang="ts">
import { notebookStore } from "@store/notebookStore";
import type { Notebook } from "@schemas/notebook";
import { onMounted, watch } from "vue";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import PyodideProvider from "./pyodide/PyodideProvider.vue";

const props = defineProps<{
  id: string;
  notebook: Notebook;
}>();

onMounted(() => {
  notebookStore.loadNotebook(props.notebook);
});

watch(
  () => props.notebook,
  newNotebook => {
    notebookStore.loadNotebook(newNotebook);
  }
);
</script>

<template>
  <PyodideProvider :notebookId="id">
    <div class="renderer-container">
      <div v-for="cell in notebook.cells">
        <MarkdownCell v-if="cell.cell_type === 'markdown'" :source="cell.source" />
        <CodeCell v-if="cell.cell_type === 'code'" :cell="cell" />
      </div>
    </div>
  </PyodideProvider>
</template>

<style>
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
