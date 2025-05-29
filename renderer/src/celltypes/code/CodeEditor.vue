<script setup lang="ts">
import { onMounted } from "vue";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";

import { notebookStore } from "@renderer/store/notebookStore";

import { basicLight } from "./themes/basicLight";
import { materialDark } from "./themes/materialDark";

import { Theme } from "@shared/types";

const props = defineProps<{
  source: string[] | undefined;
  metadata: any;
  id: string;
  theme: Theme;
}>();

onMounted(() => {
  // Figure out the right theme to use
  let theme = basicLight; // default
  switch (props.theme){
    case "dark":
      theme = materialDark;
      break;
  }

  const startState = EditorState.create({
    doc: props.source?.join(""),
    extensions: [
      basicSetup,
      python(),
      theme,
      EditorView.lineWrapping,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const newSource = update.state.doc.toString();
          notebookStore.setSource(
            props.id,
            newSource.includes("\n") ? newSource.split("\n") : [newSource]
          );
        }
      }),
    ],
  });
  new EditorView({
    state: startState,
    parent: document.getElementById("code-editor-" + props.id) as HTMLElement,
  });
});
</script>

<template>
  <div :id="`code-editor-${props.id}`" />
</template>
