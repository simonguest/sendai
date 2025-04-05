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
  <textarea class="output-console">{{ formatOutput().console }}</textarea>
</template>

<style>
.output-console {
  font-family: "JetBrainsMono", monospace;
  font-size: 10pt;
  border: none;
}
</style>
