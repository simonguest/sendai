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
          :disabled="pyodideStore.executionStatus === 'idle'"
        />
        <v-btn size="32" icon="mdi-trash-can-outline" />
      </v-btn-group>
    </div>

    <div>
      <v-btn-toggle rounded="lg">
        <v-btn icon="mdi-monitor" size="32"></v-btn>
        <v-btn icon="mdi-console" size="32"></v-btn>
        <v-btn icon="mdi-alert-circle-outline" size="32"></v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>
