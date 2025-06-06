<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { settingsStore } from "../store/settingsStore";
import { NOTEBOOK_LABELS } from "@shared/types";
import NotebookCard from "../components/NotebookCard.vue";

import { listNotebooks, loadBlankNotebook, saveNotebook, deleteNotebook as deleteNotebookFromStorage, importNotebookFromFile, type NotebookInfo } from "../storage/notebookStorage";

// Get notebook labels based on current locale
const notebookLabels = computed(() => NOTEBOOK_LABELS[settingsStore.locale]);

// Initialize notebooks as empty array
const notebooks = ref<NotebookInfo[]>([]);

onMounted(async () => {
  try {
    const notebookList = await listNotebooks();
    notebooks.value = notebookList;
  } catch (error) {
    console.error('Failed to load notebooks:', error);
  }
});

// Delete notebook handler
const deleteNotebook = async (notebookId: string) => {
  try {
    // Delete from storage first
    await deleteNotebookFromStorage(notebookId);
    
    // Only remove from UI if storage deletion succeeded
    const index = notebooks.value.findIndex(nb => nb.id === notebookId);
    if (index > -1) {
      notebooks.value.splice(index, 1);
    }
    
    console.log('Notebook deleted successfully:', notebookId);
  } catch (error) {
    console.error('Failed to delete notebook:', error);
    // Note: Could add user notification here in the future
  }
};

// Add notebook menu handlers
const createBlankNotebook = async () => {
  try {
    console.log("Create blank notebook");
    const notebook = await loadBlankNotebook();
    const id = crypto.randomUUID();
    await saveNotebook(id, notebook);
    console.log('Created notebook with id:', id);
    
    // Refresh the notebooks list
    const notebookList = await listNotebooks();
    notebooks.value = notebookList;
    
    //TODO: redirect the user to the new route
  } catch (error) {
    console.error('Failed to create blank notebook:', error);
  }
};

const importNotebook = async () => {
  try {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ipynb';
    input.style.display = 'none';
    
    // Handle file selection
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        console.log('No file selected');
        return;
      }
      
      try {
        // Use the storage function to import the notebook
        const id = await importNotebookFromFile(file);        
        console.log('Notebook imported successfully:', id);
        
        // Refresh the notebooks list
        const notebookList = await listNotebooks();
        notebooks.value = notebookList;
        
      } catch (importError) {
        console.error('Failed to import notebook:', importError);
        alert(`Failed to import notebook: ${importError instanceof Error ? importError.message : 'Unknown error'}`);
      }
    };
    
    // Trigger file selection
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
    
  } catch (error) {
    console.error('Failed to import notebook:', error);
    alert('Failed to import notebook. Please try again.');
  }
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
  padding: 16px;
}

/* RTL-aware title alignment */
html[dir="rtl"] .notebook-title {
  text-align: right;
}

html[dir="ltr"] .notebook-title {
  text-align: left;
}
</style>
