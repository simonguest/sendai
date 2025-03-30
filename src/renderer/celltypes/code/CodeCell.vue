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
  <div class="code-container">
    <div class="code-control-column">
      <CodeControls />
    </div>
    <div class="code-editor-column">
      <div class="code-editor-container">
        <CodeEditor :source="cell.source" :id="cell.id"/>
      </div>
      <div class="code-outputs-container">
        <CodeOutputs :outputs="cell.outputs" />
      </div>
    </div>
  </div>
</template>

<style>
.code-container {
  display: flex;
}

.code-control-column {
  width: 50px;
}

.code-editor-column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.code-editor-container,
.code-outputs-container {
  flex: 1;
}

@media (width < 600px) {
  .code-container {
    flex-direction: column;
    height: auto;
  }
  
  .code-control-column {
    width: 100%; 
    height: auto;
  }
  
  .code-editor-column {
    width: 100%;
  }
}
</style>
