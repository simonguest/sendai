<script setup lang="ts">
import { pyodideStore } from "@/renderer/store/pyodideStore";
import { notebookStore } from "@/renderer/store/notebookStore";

const props = defineProps<{
  id: string;
}>();

const runCode = () => {
  notebookStore.clearOutputs(props.id);
  pyodideStore.executeCell(props.id);
};

const clearOutputs = () => {
  notebookStore.clearOutputs(props.id);
};

const interruptCode = () => {
  pyodideStore.interruptExecution();
  console.log("CodeControls: Interrupt Requested");
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
        />
      </v-btn-group>
      <v-btn-group rounded="lg" class="pl-4">
        <v-btn size="32" icon="mdi-broom" @click="clearOutputs" />
      </v-btn-group>
    </div>

    <div>
      <v-btn-toggle rounded="lg" mandatory>
        <v-btn icon="mdi-monitor" size="32" v-if="notebookStore.hasResult(id)"></v-btn>
        <v-btn icon="mdi-console" size="32" v-if="notebookStore.hasStdout(id)"></v-btn>
        <v-btn icon="mdi-alert-circle-outline" size="32" v-if="notebookStore.hasError(id)"></v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>
