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
  <div class="markdown-cell">
    <div v-html="toMarkdown(source)"></div>
  </div>
</template>

<style>
.markdown-cell {
  padding-bottom: 10px;
  max-width: 800px;
  margin: 0 auto;
}
</style>
