<script setup lang="ts">
import { notebookStore } from "@renderer/store/notebookStore";
import type { Notebook } from "@shared/schemas/notebook";
import { onMounted, watch, computed, ref, nextTick } from "vue";
import { useTheme } from "vuetify";
import { Theme, Locale, RENDERER_LABELS } from "@shared/types";

import MarkdownCell from "./celltypes/markdown";
import CodeCell from "./celltypes/code";
import PyodideProvider from "./pyodide/PyodideProvider.vue";
import { pyodideStore } from "./store/pyodideStore";

const props = defineProps<{
  id: string;
  initialNotebook: Notebook;
  theme: Theme;
  locale: Locale;
}>();

// Get renderer labels based on current locale
const rendererLabels = computed(() => RENDERER_LABELS[props.locale]);

// Dialog state
const userInput = ref<string>("");
const inputFieldRef = ref();
const showDialog = computed({
  get: () => pyodideStore.inputStatus === "waiting",
  set: (value: boolean) => {
    if (!value) {
      pyodideStore.inputStatus = "idle";
    }
  }
});

// Dialog methods
const submitInput = () => {
  pyodideStore.submitUserInput(userInput.value);
  userInput.value = "";
};

const cancelInput = () => {
  pyodideStore.submitUserInput(""); // Send an empty string as per the Jupyter specification
  userInput.value = "";
};

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

// Auto-focus input field when dialog opens
watch(
  () => showDialog.value,
  async (isOpen) => {
    if (isOpen) {
      await nextTick();
      inputFieldRef.value?.focus();
    }
  }
);

// Handle keyboard events
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    submitInput();
  } else if (event.key === "Escape") {
    event.preventDefault();
    cancelInput();
  }
};
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
        />
        <CodeCell
          v-if="cell.cell_type === 'code'"
          :cell="cell"
          :theme="props.theme"
          :locale="props.locale"
        />
      </div>
    </div>
    <v-dialog v-model="showDialog" max-width="400px" persistent @keydown="handleKeydown">
      <v-card>
        <v-card-title>{{ pyodideStore.inputPrompt || "Enter Input" }}</v-card-title>
        <v-card-text>
          <v-text-field
            ref="inputFieldRef"
            v-model="userInput"
            label="Input"
            variant="outlined"
            density="compact"
            @keydown="handleKeydown"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="cancelInput"> Cancel </v-btn>
          <v-btn color="primary" variant="text" @click="submitInput"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
