<script setup lang="ts">
import { computed } from "vue";
import { pyodideStore } from "@renderer/store/pyodideStore";
import { notebookStore } from "@renderer/store/notebookStore";

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
};

const isCodeHidden = computed(() => {
  return notebookStore.hasTag(props.id, "hide_code");
});

const toggleHideCode = () => {
  notebookStore.toggleTag(props.id, "hide_code");
};
</script>

<template>
  <div>
    <div>
      <v-btn-group rounded="lg">
        <v-btn
          size="32"
          icon="mdi-play-outline"
          @click="runCode"
          :disabled="pyodideStore.executionStatus !== 'idle' || pyodideStore.workerStatus !== 'ready'"
          :loading="pyodideStore.workerStatus !== 'ready'"
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
      <v-btn-group rounded="lg" class="pl-2">
        <v-btn 
          size="32" 
          :icon="isCodeHidden ? 'mdi-eye-off' : 'mdi-eye'" 
          @click="toggleHideCode"
          :aria-label="isCodeHidden ? 'Show code' : 'Hide code'"
        />
      </v-btn-group>
    </div>
  </div>
</template>
