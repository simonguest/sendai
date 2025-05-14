<script setup lang="ts">
defineProps<{
  value: any;
}>();
</script>

<template>
  <textarea class="output-console" readonly>{{
    Array.isArray(value) ? value.join("") : value
  }}</textarea>
</template>

<style scoped>
.output-console {
  font-family: "JetBrainsMono", monospace;
  font-size: 10pt;
  border: none;
  width: 100%;
  border-radius: 5px;
  padding: 10px;
  height: auto;
  max-height: 400px;
  overflow-y: auto;
  resize: none;
}
</style>
