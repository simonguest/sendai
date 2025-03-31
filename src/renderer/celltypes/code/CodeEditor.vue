<script setup lang="ts">
import { onMounted } from "vue";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";

import { defaultTheme } from "./CodeEditorThemes";

const props = defineProps<{
  source: string[] | undefined;
  id: string;
}>();

onMounted(() => {
  const startState = EditorState.create({
    doc: props.source?.join(""),
    extensions: [basicSetup, python(), defaultTheme, EditorView.lineWrapping],
  });
  const view = new EditorView({
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
