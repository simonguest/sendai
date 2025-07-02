<script setup lang="ts">
import { Locale } from "@shared/types";
import { marked } from "marked";
import { ref, watch, computed } from "vue";

import type { Cell } from "@shared/schemas/notebook";
import { notebookStore } from "@renderer/store/notebookStore";

const props = defineProps<{
  cell: Cell;
  locale: Locale;
  editMode: boolean;
}>();

const editableContent = ref<string>("");

// Initialize editable content when entering edit mode
watch(() => props.editMode, (newEditMode) => {
  if (newEditMode) {
    const source = notebookStore.getLocalizedSource(props.cell.id, props.locale);
    editableContent.value = source ? source.join("") : "";
  }
}, { immediate: true });

const handleContentChange = (newContent: string) => {
  // Convert string back to string array format for the store
  const sourceArray = newContent.split('\n');
  notebookStore.setLocalizedSource(props.cell.id, sourceArray, props.locale);
};

const toMarkdown = (source: string[] | undefined) => {
  if (!source) return "";
  return marked.parse(source.join(""));
};

// Process source with localization and globals
const processedSource = computed(() => {
  const localizedSource = notebookStore.getLocalizedSource(props.cell.id, props.locale) || [];
  return notebookStore.parseGlobals(localizedSource, props.locale);
});

</script>

<template>
  <v-card variant="text" max-width="800" class="pt-2 pb-2 ma-auto">
    <v-card-text>
      <!-- Read Mode: Display rendered markdown -->
      <div 
        v-if="!editMode" 
        v-html="toMarkdown(processedSource)"
      ></div>
      
      <!-- Edit Mode: Display textarea for editing -->
      <v-textarea
        v-else
        v-model="editableContent"
        @update:modelValue="handleContentChange"
        variant="outlined"
        auto-grow
        rows="3"
        hide-details
        class="markdown-editor"
      ></v-textarea>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.markdown-editor :deep(.v-field__input) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}
</style>
