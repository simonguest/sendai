<script setup lang="ts">
import { Locale } from "@shared/types";
import { marked } from "marked";

import type { Cell } from "@shared/schemas/notebook";
import { notebookStore } from "@renderer/store/notebookStore";

const props = defineProps<{
  cell: Cell;
  locale: Locale;
  editMode: boolean;
}>();

const toMarkdown = (source: string[] | undefined) => {
  if (!source) return "";
  return marked.parse(source.join(""));
};

</script>

<template>
  <v-card variant="text" max-width="800" class="pt-2 pb-2 ma-auto">
    <v-card-text>
      <div v-html="toMarkdown(notebookStore.getLocalizedSource(cell.id, locale))"></div>
    </v-card-text>
  </v-card>
</template>