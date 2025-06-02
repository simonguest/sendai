<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { settingsStore } from "../store/settingsStore";
import { NOTEBOOK_LABELS } from "@shared/types";
import { getNotebook } from "../storage/notebookStorage";
import type { Notebook } from "@shared/schemas/notebook";
import Renderer from "@renderer/Renderer.vue";

const route = useRoute();
const router = useRouter();

// Get notebook labels based on current locale
const notebookLabels = computed(() => NOTEBOOK_LABELS[settingsStore.locale]);

// Get notebook ID from route params
const notebookId = computed(() => route.params.id as string);

// Reactive state for notebook data
const notebook = ref<Notebook | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Load notebook data when component mounts
onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    notebook.value = await getNotebook(notebookId.value);
  } catch (err) {
    console.error('Failed to load notebook:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load notebook';
  } finally {
    loading.value = false;
  }
});

// Navigate back to notebooks index
const goBack = () => {
  router.push('/notebooks');
};
</script>

<template>
  <div class="notebook-viewer">
    <v-container fluid class="pa-4">
      <!-- Header with back button -->
      <div class="d-flex align-center mb-6">
        <v-btn
          icon="mdi-arrow-left"
          variant="text"
          @click="goBack"
          class="me-3"
        ></v-btn>
        <h1 class="text-h4">{{ notebook?.metadata?.title || "Untitled Notebook" }}</h1>
      </div>

      <!-- Notebook Renderer -->
      <Renderer 
        v-if="notebook && !loading && !error" 
        :initial-notebook="notebook" 
        :id="notebookId"
        :theme="settingsStore.theme"
        :locale="settingsStore.locale"
      />
      
      <!-- Loading state -->
      <div v-else-if="loading" class="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p>Loading notebook...</p>
      </div>
      
      <!-- Error state -->
      <v-card v-else-if="error" class="pa-6">
        <div class="text-center">
          <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4"></v-icon>
          <h2 class="text-h5 mb-2">Failed to load notebook</h2>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ error }}
          </p>
          <v-btn color="primary" @click="goBack">
            Back to Notebooks
          </v-btn>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<style scoped>
.notebook-viewer {
  height: 100%;
  width: 100%;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  gap: 16px;
}

/* RTL-aware back button positioning */
html[dir="rtl"] .notebook-viewer .v-btn {
  margin-left: 12px;
  margin-right: 0;
}

html[dir="ltr"] .notebook-viewer .v-btn {
  margin-right: 12px;
  margin-left: 0;
}
</style>
