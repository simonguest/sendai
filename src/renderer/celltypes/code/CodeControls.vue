<script setup lang="ts">
import { pyodideStore, WorkerStatus } from "@/renderer/store/pyodideStore";
import { defineProps } from "vue";

const props = defineProps<{
  id: string;
}>();

const runCode = () => {
  pyodideStore.executeCell(props.id);
}
</script>

<template>
  <button
    class="play-button"
    @click="runCode"
    :class="{ 'play-button-ready': pyodideStore.workerStatus === 'ready' }"
    :disabled="pyodideStore.workerStatus !== 'ready'"
    aria-label="Run code"
  ></button>
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
