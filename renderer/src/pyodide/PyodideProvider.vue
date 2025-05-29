<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";

import { notebookStore } from "@renderer/store/notebookStore";
import { pyodideStore } from "@renderer/store/pyodideStore";
import { Locale } from "@shared/types";

const props = defineProps<{ notebookId: string, locale: Locale }>();
let worker: Worker;

onMounted(async () => {
  console.log("PyodideProvider: Starting new worker for " + props.notebookId);
  worker = new Worker(new URL("@renderer/pyodide/PyodideWorker.ts", import.meta.url), {
    type: "module",
  });
  worker.postMessage({
    type: "initialize",
  });

  worker.onmessage = async (event: MessageEvent<any>) => {
    const { type, text, result, error, interruptBuffer } = event.data;

    switch (type) {
      case "initialized":
        console.log("PyodideProvider: Pyodide is initialized");
        pyodideStore.setWorkerStatus("ready");
        if (interruptBuffer) {
          pyodideStore.setInterruptBuffer(new Int32Array(interruptBuffer));
          console.log("PyodideProvider: Set Interrupt Buffer");
        }
        break;
      case "stdout":
        if (pyodideStore.runningCellId) {
          notebookStore.addStdout(pyodideStore.runningCellId, text);
        }
        break;
      case "execute_result":
        if (pyodideStore.runningCellId) {
          if (result) {
            // result will be null if the code didn't return any result
            notebookStore.setResult(pyodideStore.runningCellId, result);
          }
        }
        break;
      case "execute_completed":
        pyodideStore.executionCompleted();
        break;
      case "error":
        if (pyodideStore.runningCellId) {
          notebookStore.setError(pyodideStore.runningCellId, error);
        }
        pyodideStore.executionCompleted();
        break;
      case "fatal":
        pyodideStore.setFatalError(error);
        break;
    }
  };
});

onUnmounted(async () => {
  console.log("PyodideProvider: Terminating worker.");
  pyodideStore.setWorkerStatus("terminating");
  worker.terminate();
});

watch(
  () => pyodideStore.executionStatus,
  newExecutionStatus => {
    if (newExecutionStatus === "queued" && pyodideStore.runningCellId != null) {
      // Grab the source from the notebook
      const code = notebookStore.getLocalizedSource(pyodideStore.runningCellId, props.locale);
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
