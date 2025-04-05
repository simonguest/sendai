<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";

import { notebookStore } from "@renderer/store/notebookStore";
import { pyodideStore, WorkerStatus } from "@renderer/store/pyodideStore";

const props = defineProps<{ notebookId: string }>();
let worker: Worker;

onMounted(async () => {
  console.log("PyodideProvider: Starting new worker for " + props.notebookId);
  worker = new Worker(new URL("./pyodideWorker.ts", import.meta.url), {
    type: "module",
  });
  worker.postMessage({
    type: "initialize",
  });

  worker.onmessage = async (event: MessageEvent<any>) => {
    const { type, text, result, interruptBuffer } = event.data;

    switch (type) {
      case "initialized":
        console.log("PyodideProvider: Pyodide is initialized");
        pyodideStore.setWorkerStatus("ready");
        if (interruptBuffer) {
          pyodideStore.setInterruptBuffer(new Int32Array(interruptBuffer));
          console.log("PyodideProvider: Set Interrupt Buffer");
        }
        break;
      case "result":
        if (pyodideStore.runningCellId) {
          if (result) { // result will be null if the code didn't return any result
            notebookStore.setExecutionResult(pyodideStore.runningCellId, result);
          }
        }
        pyodideStore.setWorkerStatus("ready");
        pyodideStore.executionCompleted();
        break;
      case "stdout":
        if (pyodideStore.runningCellId) {
          notebookStore.addStdOut(pyodideStore.runningCellId, text);
        }
        break;
    }
  };
});

onUnmounted(async () => {
  console.log("PyodideProvider: Terminating worker.");
  worker.terminate();
});

watch(
  () => pyodideStore.executionStatus,
  newExecutionStatus => {
    if (newExecutionStatus === "queued" && pyodideStore.runningCellId != null) {
      // Grab the source from the notebook
      const code = notebookStore.getCellSource(pyodideStore.runningCellId);
      worker.postMessage({
        type: "run",
        cellId: pyodideStore.runningCellId,
        code: code?.join(""),
      });
    }
  }
);
</script>

<template>
  <slot />
</template>
