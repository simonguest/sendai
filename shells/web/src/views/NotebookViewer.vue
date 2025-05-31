<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { settingsStore } from "../store/settingsStore";
import { NOTEBOOK_LABELS } from "@shared/types";

const route = useRoute();
const router = useRouter();

// Get notebook labels based on current locale
const notebookLabels = computed(() => NOTEBOOK_LABELS[settingsStore.locale]);

// Get notebook ID from route params
const notebookId = computed(() => route.params.id as string);

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
        <h1 class="text-h4">{{ notebookLabels.notebookViewer }}</h1>
      </div>

      <!-- Placeholder content -->
      <v-card class="pa-6">
        <div class="text-center">
          <v-icon icon="mdi-notebook" size="64" color="primary" class="mb-4"></v-icon>
          <h2 class="text-h5 mb-2">Notebook goes here.</h2>
          <p class="text-body-1 text-medium-emphasis mb-4">
            Notebook ID: {{ notebookId }}
          </p>
          <p class="text-body-2 text-medium-emphasis">
            This is a placeholder for the notebook viewer. The actual notebook content will be integrated here in the future.
          </p>
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
