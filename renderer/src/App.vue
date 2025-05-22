<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Notebook } from "@renderer/schemas/notebook";

import { settingsStore, Theme, Locale } from "@renderer/store/settingsStore";

import Renderer from "@renderer/Renderer.vue";

const notebook = ref<Notebook | null>(null);
const id = "test"

onMounted(async () => {
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    // Check if sample parameter exists, otherwise use default
    const notebookFile = urlParams.has('sample') ? urlParams.get('sample') : 'hello_world.ipynb';
    // Check if theme parameter exists and apply accordingly
    if (urlParams.has('theme')) {
      const themeParam = urlParams.get('theme') || 'dark';
      settingsStore.setTheme(themeParam as Theme);
    }
    // Check if locale parameter exists and apply accordingly
    if (urlParams.has('locale')) {
      const localeParam = urlParams.get('locale') || 'en-US';
      settingsStore.setLocale(localeParam as Locale);
    }
    
    // Fetch the notebook file
    const response = await fetch(`./samples/${notebookFile}`);
    const contents = await response.text();
    notebook.value = JSON.parse(contents);
    console.log(`Notebook ${notebookFile} loaded`);
  } catch (error) {
    console.error("Error loading notebook:", error);
  }
});
</script>

<template>
  <Renderer v-if="notebook" :initial-notebook="notebook" :id="id"/>
</template>
