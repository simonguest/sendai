<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Notebook } from "@schemas/notebook";

import Renderer from "@renderer/Renderer.vue";

const titleClass = ref("title");
const notebook = ref<Notebook | null>(null);

// Load the notebook file
onMounted(async () => {
  try {
    const response = await fetch("/samples/kitchen_sink.ipynb");
    const contents = await response.text();
    notebook.value = JSON.parse(contents);

    console.log("Notebook loaded:", notebook.value);
  } catch (error) {
    console.error("Error loading notebook:", error);
  }
});
</script>

<template>
  <h1 :class="titleClass">Renderer</h1>

  <!-- Pass the notebook to the Renderer component -->
  <Renderer v-if="notebook" :notebook="notebook" />
</template>

<style>
.title {
  color: red;
}
</style>
