<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

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
    const { type, interruptBuffer } = event.data;

    switch (type) {
      case "initialized":
        console.log("PyodideProvider: Pyodide is initialized");
        pyodideStore.setWorkerStatus("ready");
        // if (interruptBuffer) {
        //   interruptBufferRef.current = new Int32Array(interruptBuffer);
        //   console.log("Interrupt buffer is supported");
        //   // Interrupt is supported on this machine/configuration
        //   dispatch(interruptSupported());
        // }
        // dispatch(setWorkerStatus("ready"));
        break;
    }
  };
});

onUnmounted(async () => {
  console.log("PyodideProvider: Terminating worker.");
  worker.terminate();
});
</script>

<template>
  <slot />
</template>
