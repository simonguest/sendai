<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Notebook } from "@/renderer/schemas/notebook";

import Renderer from "@renderer/Renderer.vue";

const notebook = ref<Notebook | null>(null);
const id = "test"

onMounted(async () => {
  try {
    const response = await fetch("/samples/hello_world.ipynb");
    const contents = await response.text();
    notebook.value = JSON.parse(contents);
    console.log("Notebook loaded");
  } catch (error) {
    console.error("Error loading notebook:", error);
  }
});
</script>

<template>
  <Renderer v-if="notebook" :initial-notebook="notebook" :id="id"/>
</template>