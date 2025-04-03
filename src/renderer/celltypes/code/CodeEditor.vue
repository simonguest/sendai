<script setup lang="ts">
import { onMounted } from "vue";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";

import { notebookStore } from "@/renderer/store/notebookStore";
import { defaultTheme } from "./CodeEditorThemes";

const props = defineProps<{
  source: string[] | undefined;
  id: string;
}>();

onMounted(() => {
  const startState = EditorState.create({
    doc: props.source?.join(""),
    extensions: [
      basicSetup,
      python(),
      defaultTheme,
      EditorView.lineWrapping,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          const newSource = update.state.doc.toString();
          notebookStore.setCellSource(
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
  <div id="code-editor-container2">
    <div :id="`code-editor-${props.id}`" />
  </div>
</template>

<style>
.CodeMirror {
  font-family: Arial, monospace;
  font-size: 16px;
}
</style>
