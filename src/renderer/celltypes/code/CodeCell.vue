<script setup lang="ts">
import CodeControls from "./CodeControls.vue";
import CodeEditor from "./CodeEditor.vue";
import CodeOutputs from "./CodeOutputs.vue";
import type { Cell } from "@/renderer/schemas/notebook";

defineProps<{
  cell: Cell;
}>();
</script>

<template>
  <v-card max-width="800" variant="elevated" elevation="2" color="#F3F4F6E5" class="mb-2 pt-2 pb-2 ma-auto rounded-lg">
    <v-card-text>
      <CodeEditor :source="cell.source" :id="cell.id" />
    </v-card-text>
    <v-card-actions class="pl-4 pr-4">
      <CodeControls :id="cell.id"/>
    </v-card-actions>
    <v-card-text>
      <CodeOutputs :outputs="cell.outputs" />
    </v-card-text>
  </v-card>
</template>
