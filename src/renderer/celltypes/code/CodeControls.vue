<script setup lang="ts">
import { computed } from "vue";
import { pyodideStore } from "@/renderer/store/pyodideStore";
import { notebookStore } from "@/renderer/store/notebookStore";
import type { SelectedOutput } from "./CodeCell.vue";

const props = defineProps<{
  id: string;
  selectedOutput: SelectedOutput;
}>();

const emit = defineEmits<{
  (e: 'update:selectedOutput', value: SelectedOutput): void;
}>();

const selectedOutputValue = computed({
  get: () => props.selectedOutput,
  set: (value: SelectedOutput) => emit('update:selectedOutput', value)
});

const runCode = () => {
  notebookStore.clearOutputs(props.id);
  pyodideStore.executeCell(props.id);
};

const clearOutputs = () => {
  notebookStore.clearOutputs(props.id);
  selectedOutputValue.value = "none";
};

const interruptCode = () => {
  pyodideStore.interruptExecution();
};
</script>

<template>
  <div class="d-flex justify-space-between align-center w-100">
    <div>
      <v-btn-group rounded="lg">
        <v-btn
          size="32"
          icon="mdi-play-outline"
          @click="runCode"
          :disabled="pyodideStore.executionStatus !== 'idle'"
          aria-label="Run code"
        />
        <v-btn
          size="32"
          icon="mdi-stop"
          @click="interruptCode"
          :disabled="pyodideStore.executionStatus === 'idle' || pyodideStore.runningCellId !== id"
          aria-label="Stop code"
        />
      </v-btn-group>
      <v-btn-group rounded="lg" class="pl-4">
        <v-btn size="32" icon="mdi-broom" @click="clearOutputs" />
      </v-btn-group>
    </div>

    <div>
      <v-btn-toggle rounded="lg" mandatory v-model="selectedOutputValue">
        <v-btn icon="mdi-monitor" size="32" value="result" v-if="notebookStore.hasResult(id)"></v-btn>
        <v-btn icon="mdi-console" size="32" value="stdout" v-if="notebookStore.hasStdout(id)"></v-btn>
        <v-btn icon="mdi-alert-circle-outline" size="32" value="error" v-if="notebookStore.hasError(id)"></v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>
