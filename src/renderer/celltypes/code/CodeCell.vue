<script setup lang="ts">
import CodeControls from "./CodeControls.vue";
import CodeEditor from "./CodeEditor.vue";
import CodeOutputs from "./CodeOutputs.vue";
import type { Cell, Output } from "@/renderer/schemas/notebook";

defineProps<{
  cell: Cell;
}>();
</script>

<template>
  <div class="code-cell">
    <div class="code-control-column">
      <CodeControls :id="cell.id"/>
    </div>
    <div class="code-editor-column">
      <CodeEditor :source="cell.source" :id="cell.id" />
      <CodeOutputs :outputs="cell.outputs" />
    </div>
  </div>
</template>

<style>
.code-cell {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
}

.code-control-column {
  width: 30px;
}

.code-editor-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (width < 600px) {
  .code-cell {
    flex-direction: column;
    height: auto;
  }

  .code-control-column {
    width: 100%;
    height: auto;
    padding-bottom: 5px;
  }

  .code-editor-column {
    width: 100%;
  }
}
</style>
