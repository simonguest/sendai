<script setup lang="ts">
import { ref, watch } from "vue";
import CodeControls from "./CodeControls.vue";
import CodeEditor from "./CodeEditor.vue";
import Console from "./Console.vue";
import Error from "./Error.vue";
import Result from "./Result.vue";

import type { Cell } from "@/renderer/schemas/notebook";
import { notebookStore, OutputType } from "@/renderer/store/notebookStore";

const props = defineProps<{
  cell: Cell;
}>();

let outputTypes: OutputType[] = [];
outputTypes = notebookStore.getOutputTypes(props.cell.id);

const getDefaultTab = () => {
  if (outputTypes.indexOf("result") !== -1) return "result";
  if (outputTypes.indexOf("stdout") !== -1) return "stdout";
  if (outputTypes.indexOf("error") !== -1) return "error";
};

const outputTab = ref("result");

watch(
  () => props.cell.outputs,
  () => {
    // Get available output types for the cell and reset the tabs
    outputTypes = notebookStore.getOutputTypes(props.cell.id);
    outputTab.value = "none";
    outputTab.value = getDefaultTab() || outputTab.value;
  },
  { deep: true }
);
</script>

<template>
  <v-card
    max-width="800"
    variant="elevated"
    elevation="2"
    color="surface-light"
    class="mb-2 pt-2 pb-2 ma-auto rounded-lg"
  >
    <v-card-text>
      <CodeEditor :source="cell.source" :id="cell.id" />
    </v-card-text>
    <v-card-actions class="pl-4 pr-4 d-flex justify-space-between">
      <CodeControls :id="cell.id" />
      <v-tabs v-model="outputTab" class="ml-auto">
        <v-tab
          value="result"
          v-if="outputTypes.indexOf('result') !== -1"
          icon
          size="32"
          rounded="lg"
          min-width="48"
          ><v-icon icon="mdi-monitor"
        /></v-tab>
        <v-tab
          value="stdout"
          v-if="outputTypes.indexOf('stdout') !== -1"
          icon
          size="32"
          min-width="48"
          rounded="lg"
          ><v-icon icon="mdi-console"
        /></v-tab>
        <v-tab
          value="error"
          v-if="outputTypes.indexOf('error') !== -1"
          icon
          size="32"
          min-width="48"
          rounded="lg"
          ><v-icon icon="mdi-alert-circle-outline"
        /></v-tab>
      </v-tabs>
    </v-card-actions>

    <v-card-text>
      <v-tabs-window v-model="outputTab" direction="vertical">
        <v-tabs-window-item value="result">
          <Result :value="notebookStore.getResult(cell.id)" />
        </v-tabs-window-item>

        <v-tabs-window-item value="stdout" direction="vertical">
          <Console :stdout="notebookStore.getStdout(cell.id)" />
        </v-tabs-window-item>

        <v-tabs-window-item value="error" direction="vertical">
          <Error :stderr="notebookStore.getError(cell.id)" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </v-card>
</template>
