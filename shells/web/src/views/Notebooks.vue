<script setup lang="ts">
import { inject, ref, type Ref, onMounted } from "vue";
import type { Notebook } from "@renderer/schemas/notebook";
import Renderer from "@renderer/Renderer.vue";

import { settingsStore, Theme, Locale } from "@renderer/store/settingsStore";

// Inject notebook data from App.vue
const notebook = inject<Ref<Notebook | null>>('notebook') || ref<Notebook | null>(null);
const notebookId = inject<string>('notebookId', 'default');

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
  <div class="notebooks-view">
    <Renderer 
      v-if="notebook" 
      :initial-notebook="notebook" 
      :id="notebookId"
    />
    <div v-else class="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading notebook...</p>
    </div>
  </div>
</template>

<style scoped>
.notebooks-view {
  height: 100%;
  width: 100%;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}
</style>
