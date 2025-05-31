<script setup lang="ts">
import { ref, computed } from "vue";
import { settingsStore } from "../store/settingsStore";
import { NOTEBOOK_LABELS } from "@shared/types";
import NotebookCard from "../components/NotebookCard.vue";

// Get notebook labels based on current locale
const notebookLabels = computed(() => NOTEBOOK_LABELS[settingsStore.locale]);

// Sample notebook data with UUIDs
const notebooks = ref([
  {
    id: crypto.randomUUID(),
    title: "Math Basics",
    lastEdited: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    icon: "mdi-calculator"
  },
  {
    id: crypto.randomUUID(),
    title: "Python Introduction",
    lastEdited: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    icon: "mdi-language-python"
  },
  {
    id: crypto.randomUUID(),
    title: "Data Visualization",
    lastEdited: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    icon: "mdi-chart-line"
  },
  {
    id: crypto.randomUUID(),
    title: "Science Experiments",
    lastEdited: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    icon: "mdi-flask"
  },
  {
    id: crypto.randomUUID(),
    title: "Creative Writing",
    lastEdited: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: "mdi-pencil"
  }
]);

// Delete notebook handler
const deleteNotebook = (notebookId: string) => {
  const index = notebooks.value.findIndex(nb => nb.id === notebookId);
  if (index > -1) {
    notebooks.value.splice(index, 1);
  }
};

// Add notebook menu handlers (placeholders)
const createBlankNotebook = () => {
  console.log("Create blank notebook");
};

const createFromTemplate = () => {
  console.log("Create from template");
};

const importNotebook = () => {
  console.log("Import notebook");
};
</script>

<template>
  <div class="notebook-index">
    <v-container fluid class="pa-4">
      <!-- Header with title and add button -->
      <div class="d-flex justify-space-between align-center mb-6">
        <h1 class="text-h4 notebook-title">{{ notebookLabels.title }}</h1>
        
        <!-- Add Notebook Menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              v-bind="props"
              prepend-icon="mdi-plus"
            >
              {{ notebookLabels.addNotebook }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="createBlankNotebook">
              <v-list-item-title>{{ notebookLabels.blank }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="createFromTemplate">
              <v-list-item-title>{{ notebookLabels.fromTemplate }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="importNotebook">
              <v-list-item-title>{{ notebookLabels.importNotebook }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Notebook Cards Grid -->
      <v-row>
        <v-col
          v-for="notebook in notebooks"
          :key="notebook.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <NotebookCard
            :notebook="notebook"
            @delete="deleteNotebook"
          />
        </v-col>
      </v-row>

      <!-- Empty state if no notebooks -->
      <div v-if="notebooks.length === 0" class="text-center mt-8">
        <v-icon icon="mdi-notebook-outline" size="64" color="grey"></v-icon>
        <p class="text-h6 mt-4 text-medium-emphasis">No notebooks yet</p>
        <p class="text-body-2 text-medium-emphasis">Create your first notebook to get started</p>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.notebook-index {
  height: 100%;
  width: 100%;
}

/* RTL-aware title alignment */
html[dir="rtl"] .notebook-title {
  text-align: right;
}

html[dir="ltr"] .notebook-title {
  text-align: left;
}
</style>
