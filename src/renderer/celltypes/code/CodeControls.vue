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
  console.log("Interrupt Requested");
};
</script>

<template>
  <button
    class="play-button"
    @click="runCode"
    :class="{
      'play-button-ready':
        pyodideStore.workerStatus === 'ready' && pyodideStore.executionStatus === 'idle',
    }"
    :disabled="pyodideStore.workerStatus !== 'ready'"
    aria-label="Run code"
  ></button>
  <button class="stop-button" @click="interruptCode">S</button>
</template>

<style>
.play-button {
  background-image: url("@renderer/icons/play_circle.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  filter: opacity(25%);
}

.play-button-ready {
  filter: opacity(100%);
  cursor: pointer;
}
</style>
