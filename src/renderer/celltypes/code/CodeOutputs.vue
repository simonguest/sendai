<script setup lang="ts">
import type { Output } from "@/renderer/schemas/notebook";
const props = defineProps<{
  outputs: Output[] | undefined;
}>();

const formatOutput = () => {
  if (props.outputs === undefined || props.outputs.length === 0) return { console: "" };

  let console = "";

  props.outputs.forEach(output => {
    if (output.output_type === "stream") {
      console += output.text?.join("") || "";
    }
  });

  return { console };
};
</script>

<template>
  <textarea class="output-console" readonly>{{ formatOutput().console }}</textarea>
</template>

<style scoped>
.output-console {
  font-family: "JetBrainsMono", monospace;
  font-size: 10pt;
  border: none;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  min-height: 60px;
  resize: vertical;
}
</style>
