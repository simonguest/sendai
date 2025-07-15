<script setup lang="ts">
import { notebookStore } from "@renderer/store/notebookStore";
import type { Notebook } from "@shared/schemas/notebook";
import { onMounted, watch } from "vue";
import { Theme, Locale } from "@shared/types";

import Editor from "./Editor.vue";
import Viewer from "./Viewer.vue";
import PyodideProvider from "./pyodide/PyodideProvider.vue";

const props = defineProps<{
  id: string;
  initialNotebook: Notebook;
  theme: Theme;
  locale: Locale;
  editMode: boolean;
}>();

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
  <PyodideProvider :notebookId="id" :locale="locale">
    <Editor
      v-if="editMode"
      :id="id"
      :theme="theme"
      :locale="locale"
    />
    <Viewer
      v-else
      :id="id"
      :theme="theme"
      :locale="locale"
    />
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
