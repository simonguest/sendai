<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { settingsStore } from "../store/settingsStore";
import { notebookStore } from "@renderer/store/notebookStore";
import { NOTEBOOK_LABELS } from "@shared/types";
import { LOCALE_METADATA } from "@shared/i18n/locales";
import { getNotebook } from "../storage/notebookStorage";
import { useNotebookAutoSave } from "../composables/useNotebookAutoSave";
import type { Notebook } from "@shared/schemas/notebook";
import Renderer from "@renderer/Renderer.vue";
import AIAssistant from "../components/AIAssistant.vue";

const route = useRoute();
const router = useRouter();

const notebookLabels = computed(() => NOTEBOOK_LABELS[settingsStore.locale]);
const isRTL = computed(() => LOCALE_METADATA[settingsStore.locale].direction === "rtl");

const notebookId = computed(() => route.params.id as string);

const notebook = ref<Notebook | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// State for edit mode, resources panel, and AI assistant
const editMode = ref(false);
const showResources = ref(false);
const showAIAssistant = ref(false);

const { saveStatus, stopWatcher } = useNotebookAutoSave(notebookId.value);

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    notebook.value = await getNotebook(notebookId.value);
  } catch (err) {
    console.error("Failed to load notebook:", err);
    error.value = err instanceof Error ? err.message : "Failed to load notebook";
  } finally {
    loading.value = false;
  }
});

const goBack = () => {
  router.push("/notebooks");
};

// Handler functions for the new buttons
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const toggleAIAssistant = () => {
  showAIAssistant.value = !showAIAssistant.value;
};

const toggleResources = () => {
  showResources.value = !showResources.value;
};

onUnmounted(() => {
  // Clear the notebook store and stop watching for auto-save changes
  notebookStore.clear();
  stopWatcher();
});
</script>

<template>
  <div class="notebook">
    <v-container fluid class="pa-4">
      <!-- Header with back button and save status -->
      <div class="d-flex align-center mb-6 notebook-header">
        <div class="d-flex align-center flex-grow-1">
          <v-btn
            :icon="isRTL ? 'mdi-arrow-right' : 'mdi-arrow-left'"
            variant="text"
            @click="goBack"
            :class="isRTL ? 'ms-3' : 'me-3'"
          ></v-btn>
          <h1 class="text-h4 notebook-title">
            {{ notebook?.metadata?.title || notebookLabels.untitledNotebook }}
          </h1>
        </div>

        <!-- Save status indicator -->
        <v-chip
          v-if="saveStatus !== 'idle'"
          :color="saveStatus === 'saved' ? 'success' : saveStatus === 'saving' ? 'info' : 'error'"
          size="small"
          variant="tonal"
        >
          <v-icon
            :icon="
              saveStatus === 'saved'
                ? 'mdi-check'
                : saveStatus === 'saving'
                ? 'mdi-loading'
                : 'mdi-alert'
            "
            :class="{ 'mdi-spin': saveStatus === 'saving' }"
            size="small"
            class="me-1"
          ></v-icon>
          {{
            saveStatus === "saved"
              ? notebookLabels.saved
              : saveStatus === "saving"
              ? notebookLabels.saving
              : notebookLabels.saveError
          }}
        </v-chip>

        <!-- Edit, AI Assistant, and Resources buttons -->
        <div class="d-flex align-center" :class="isRTL ? 'ms-3' : 'me-3'">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            size="small"
            :color="editMode ? 'primary' : 'default'"
            @click="toggleEditMode"
            class="me-2"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="bottom"> Edit Notebook </v-tooltip>
          </v-btn>

          <v-btn
            icon="mdi-assistant"
            variant="text"
            size="small"
            :color="showAIAssistant ? 'primary' : 'default'"
            @click="toggleAIAssistant"
            class="me-2"
          >
            <v-icon>mdi-creation</v-icon>
            <v-tooltip activator="parent" location="bottom"> Lesson Assistant </v-tooltip>
          </v-btn>

          <v-btn
            icon="mdi-paperclip"
            variant="text"
            size="small"
            :color="showResources ? 'primary' : 'default'"
            @click="toggleResources"
          >
            <v-icon>mdi-paperclip</v-icon>
            <v-tooltip activator="parent" location="bottom"> Resources </v-tooltip>
          </v-btn>
        </div>
      </div>

      <!-- Notebook Renderer -->
      <Renderer
        v-if="notebook && !loading && !error"
        :initial-notebook="notebook"
        :id="notebookId"
        :theme="settingsStore.theme"
        :locale="settingsStore.locale"
        :editMode="editMode"
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

    <!-- AI Assistant Navigation Drawer -->
    <v-navigation-drawer
      v-model="showAIAssistant"
      location="end"
      :width="400"
      :temporary="false"
      class="ai-assistant-drawer"
    >
      <AIAssistant :expanded="showAIAssistant"/>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.notebook {
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* RTL-aware header layout */
.notebook-header {
  flex-direction: row;
}

html[dir="rtl"] .notebook-header {
  flex-direction: row-reverse;
}

/* RTL-aware title alignment */
html[dir="rtl"] .notebook-title {
  text-align: right;
}

html[dir="ltr"] .notebook-title {
  text-align: left;
}

/* RTL-aware back button positioning */
html[dir="rtl"] .notebook .v-btn {
  margin-left: 12px;
  margin-right: 0;
}

html[dir="ltr"] .notebook .v-btn {
  margin-right: 12px;
  margin-left: 0;
}

/* AI Assistant Drawer Styling */
.ai-assistant-drawer {
  height: 100vh;
  z-index: 1000;
}

/* RTL support for navigation drawer */
html[dir="rtl"] .ai-assistant-drawer {
  left: 0;
  right: auto;
}

html[dir="ltr"] .ai-assistant-drawer {
  right: 0;
  left: auto;
}

/* Responsive drawer width */
@media (max-width: 768px) {
  .ai-assistant-drawer {
    width: 320px !important;
  }
}

@media (max-width: 480px) {
  .ai-assistant-drawer {
    width: 280px !important;
  }
}
</style>
