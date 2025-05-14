<script setup lang="ts">
defineProps<{
  stdout: string;
}>();
</script>

<template>
  <textarea v-if="stdout" class="output-console" readonly>{{ stdout }}</textarea>
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
  max-height: calc(10em + 20px);
  overflow-y: auto;
  resize: none;
}
</style>
