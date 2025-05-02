<script setup lang="ts">

defineProps<{
  stdout: string;
}>();

</script>

<template>
  <v-card max-width="800" variant="elevated" elevation="2" color="surface-light" class="mb-2 pt-2 pb-2 ma-auto rounded-lg">
    <textarea class="output-console" readonly>{{ stdout }}</textarea>
  </v-card>
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