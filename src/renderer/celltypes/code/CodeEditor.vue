<script setup lang="ts">
import { onMounted } from "vue";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { python } from "@codemirror/lang-python";

const props = defineProps<{
  source: string[] | undefined;
  id: string;
}>();

onMounted(() => {
  const startState = EditorState.create({
    doc: props.source?.join(""),
    extensions: [basicSetup, python()],
  });
  const view = new EditorView({
    state: startState,
    parent: document.getElementById("code-editor-" + props.id) as HTMLElement,
  });
});
</script>

<template>
  <div id="code-editor-container">
    <div :id="`code-editor-${props.id}`" />
  </div>
</template>

<style>
.code-editor-container {
  width: 300px;
}
</style>
