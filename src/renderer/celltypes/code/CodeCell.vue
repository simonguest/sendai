<script setup lang="ts">
import CodeControls from "./CodeControls.vue";
import CodeEditor from "./CodeEditor.vue";
import CodeOutputs from "./CodeOutputs.vue";
import type { Cell, Output } from "@schemas/notebook";

defineProps<{
  cell: Cell;
}>();
</script>

<template>
  <CodeControls />
  <CodeEditor :source="cell.source" />
  <CodeOutputs :outputs="cell.outputs as Output[]" />
</template>
