<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { settingsStore } from "../store/settingsStore";
import { notebookStore } from "@renderer/store/notebookStore";
import { NOTEBOOK_LABELS } from "@shared/types";
import { getNotebook } from "../storage/notebookStorage";
import { useNotebookAutoSave } from "../composables/useNotebookAutoSave";
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

// Auto-save functionality
const { saveStatus, lastSaved, stopWatcher } = useNotebookAutoSave(notebookId.value);

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

onUnmounted(() => {
  // Stop updates
  notebookStore.clear();
  // Clean up watcher when component unmounts
  stopWatcher();
});
</script>

<template>
  <div class="notebook-viewer">
    <v-container fluid class="pa-4">
      <!-- Header with back button and save status -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            @click="goBack"
            class="me-3"
          ></v-btn>
          <h1 class="text-h4">{{ notebook?.metadata?.title || notebookLabels.untitledNotebook }}</h1>
        </div>
        
        <!-- Save status indicator -->
        <v-chip 
          v-if="saveStatus !== 'idle'"
          :color="saveStatus === 'saved' ? 'success' : saveStatus === 'saving' ? 'info' : 'error'"
          size="small"
          variant="tonal"
        >
          <v-icon 
            :icon="saveStatus === 'saved' ? 'mdi-check' : saveStatus === 'saving' ? 'mdi-loading' : 'mdi-alert'"
            :class="{ 'mdi-spin': saveStatus === 'saving' }"
            size="small"
            class="me-1"
          ></v-icon>
          {{ saveStatus === 'saved' ? notebookLabels.saved : saveStatus === 'saving' ? notebookLabels.saving : notebookLabels.saveError }}
        </v-chip>
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
        <p>{{ notebookLabels.loadingNotebook }}</p>
      </div>
      
      <!-- Error state -->
      <v-card v-else-if="error" class="pa-6">
        <div class="text-center">
          <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4"></v-icon>
          <h2 class="text-h5 mb-2">{{ notebookLabels.failedToLoad }}</h2>
          <p class="text-body-1 text-medium-emphasis mb-4">
            {{ error }}
          </p>
          <v-btn color="primary" @click="goBack">
            {{ notebookLabels.backToNotebooks }}
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

.mdi-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
