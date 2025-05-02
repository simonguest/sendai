<script setup lang="ts">
import type { Output } from "@/renderer/schemas/notebook";
import type { SelectedOutput } from "./CodeCell.vue";

import Console from "./outputs/Console.vue";
import { notebookStore } from "@/renderer/store/notebookStore";

const props = defineProps<{
  id: string;
  outputs: Output[] | undefined;
  selectedOutput: SelectedOutput;
}>();

</script>

<template>
  <Console :stdout="notebookStore.getStdout(props.id)" v-if="selectedOutput === 'stdout'" />
  <Console :stdout="notebookStore.getError(props.id)" v-if="selectedOutput === 'error'" />
</template>
