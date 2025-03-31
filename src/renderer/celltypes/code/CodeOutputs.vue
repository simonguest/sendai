<script setup lang="ts">
import type { Output } from "@/renderer/schemas/notebook";
defineProps<{
  outputs: Output[] | undefined;
}>();
</script>

<template>
  <textarea class="output-console">Output</textarea>
</template>

<style>
.output-console {
  font-family: 'FiraCode', monospace;
  font-size: 10pt;
  border: none;
}
</style>
