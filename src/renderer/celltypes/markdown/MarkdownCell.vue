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
  <v-card variant="text" max-width="800" class="pt-2 pb-2 ma-auto">
    <v-card-text>
      <div v-html="toMarkdown(source)"></div>
    </v-card-text>
  </v-card>
</template>