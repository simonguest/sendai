<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Theme, Locale, RENDERER_LABELS } from "@shared/types";
import { LOCALE_METADATA } from "@shared/i18n/locales";
import { notebookStore } from "@renderer/store/notebookStore";
import { pyodideStore } from "./store/pyodideStore";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import VideoCell from "./celltypes/video";
import ChatCell from "./celltypes/chat";
import InputDialog from "./components/InputDialog.vue";
import GlobalsDialog from "./components/GlobalsDialog.vue";

const props = defineProps<{
  id: string;
  theme: Theme;
  locale: Locale;
}>();

// Locale override state for edit mode
const localeOverride = ref<Locale | "default">("default");

// Computed locale that uses override in edit mode, falls back to props.locale
const currentLocale = computed(() => {
  if (localeOverride.value && localeOverride.value !== "default") {
    return localeOverride.value as Locale;
  }
  if (localeOverride.value && localeOverride.value === "default") {
    return null;
  }
  return props.locale;
});

// Get renderer labels based on current locale
const rendererLabels = computed(() => RENDERER_LABELS[props.locale]);

// Dialog state
const showGlobalsDialog = ref(false);

// Create locale options for the dropdown
const localeOptions = computed(() => {
  const options = [{ value: "default", title: rendererLabels.value.noLanguageOverride }];

  Object.entries(LOCALE_METADATA).forEach(([locale, metadata]) => {
    options.push({
      value: locale,
      title: metadata.name,
    });
  });

  return options;
});
</script>

<template>
  <div class="editor-container">
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

    <v-expand-transition>
      <div class="d-flex align-center flex-column">
        <div class="d-flex align-center gap-2 mb-2">
          <v-select
            v-model="localeOverride"
            :items="localeOptions"
            :label="rendererLabels.languageOverride"
            density="compact"
            variant="outlined"
            style="min-width: 150px"
            hide-details
          ></v-select>
          <v-btn-group divided>
            <v-btn icon="mdi-variable" @click="showGlobalsDialog = true"></v-btn>
          </v-btn-group>
        </div>
      </div>
    </v-expand-transition>

    <div v-for="cell in notebookStore.content.cells">
      <MarkdownCell
        v-if="cell.cell_type === 'markdown'"
        :cell="cell"
        :metadata="cell.metadata"
        :locale="currentLocale"
        :editMode="true"
      />
      <CodeCell
        v-if="cell.cell_type === 'code'"
        :cell="cell"
        :theme="props.theme"
        :locale="currentLocale"
        :editMode="true"
      />
      <VideoCell
        v-if="cell.cell_type === 'raw' && cell.metadata.tags?.includes('video')"
        :cell="cell"
        :locale="currentLocale"
      />
      <ChatCell
        v-if="cell.cell_type === 'raw' && cell.metadata.tags?.includes('chat')"
        :cell="cell"
        :locale="currentLocale"
      />
    </div>
    
    <InputDialog :locale="props.locale" />
    <GlobalsDialog v-model="showGlobalsDialog" :locale="props.locale" />
  </div>
</template>

<style scoped>
.editor-container {
  padding-left: 8px;
  padding-right: 8px;
}

@media (width < 600px) {
  .editor-container {
    padding-left: 4px;
    padding-right: 4px;
  }
}
</style>
