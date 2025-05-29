<script setup lang="ts">
import { Locale } from "@shared/types";
import { marked } from "marked";

const props = defineProps<{
  metadata : any,
  source: string[] | undefined;
  locale: Locale;
}>();

const toMarkdown = (source: string[] | undefined) => {
  if (!source) return "";
  return marked.parse(source.join(""));
};

const getContent = (source: string[] | undefined, metadata: any) => {
  if (metadata["i18n"]){
    if (metadata["i18n"][props.locale]){
      return metadata["i18n"][props.locale];
    }
  }
  return source;
}
</script>

<template>
  <v-card variant="text" max-width="800" class="pt-2 pb-2 ma-auto">
    <v-card-text>
      <div v-html="toMarkdown(getContent(source, metadata))"></div>
    </v-card-text>
  </v-card>
</template>