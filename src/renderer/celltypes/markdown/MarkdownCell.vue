<script setup lang="ts">
import { marked } from "marked";

defineProps<{
  source: string[] | undefined;
}>();

const toMarkdown = (source: string[] | undefined) => {
  if (!source) return "";
  return marked.parse(source.join(""));
};
</script>

<template>
  <div v-html="toMarkdown(source)" class="markdown-cell"></div>
</template>

<style>
.markdown-cell {
  padding-bottom: 10px;
}
</style>