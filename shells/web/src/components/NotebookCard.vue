<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { settingsStore } from "../store/settingsStore";
import { NOTEBOOK_LABELS } from "@shared/types";
import type { NotebookInfo } from "../storage/notebookStorage";

interface Props {
  notebook: NotebookInfo;
}

interface Emits {
  (e: 'delete', notebookId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const router = useRouter();

// Get notebook labels based on current locale
const notebookLabels = computed(() => NOTEBOOK_LABELS[settingsStore.locale]);

// Format date for display
const formatDate = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return notebookLabels.value.justNow;
  } else if (diffInHours < 24) {
    const hourLabel = diffInHours === 1 ? notebookLabels.value.hourAgo : notebookLabels.value.hoursAgo;
    return `${diffInHours} ${hourLabel}`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    const dayLabel = diffInDays === 1 ? notebookLabels.value.dayAgo : notebookLabels.value.daysAgo;
    return `${diffInDays} ${dayLabel}`;
  }
};

// Navigate to notebook viewer
const openNotebook = () => {
  router.push(`/notebooks/${props.notebook.id}`);
};

// Delete notebook
const deleteNotebook = () => {
  emit('delete', props.notebook.id);
};
</script>

<template>
  <v-card
    class="notebook-card"
    hover
    @click="openNotebook"
  >
    <v-card-text class="pb-2">
      <!-- Ellipsis Menu - Top Right -->
      <div class="d-flex justify-end mb-2">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              v-bind="props"
              @click.stop
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="deleteNotebook">
              <v-list-item-title>{{ notebookLabels.delete }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Notebook Content -->
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-notebook-outline"
          size="large"
          color="primary"
          class="me-3"
        ></v-icon>
        <div class="flex-grow-1">
          <h3 class="text-h6 mb-1">{{ notebook.title }}</h3>
          <p class="text-caption text-medium-emphasis mb-0">
            {{ notebookLabels.lastEdited }}: {{ formatDate(notebook.lastModified || notebook.created) }}
          </p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.notebook-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 140px;
  display: flex;
  flex-direction: column;
}

.notebook-card:hover {
  transform: translateY(-2px);
}

.notebook-card .v-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 12px;
}

/* Ensure title text doesn't overflow */
.notebook-card .text-h6 {
  line-height: 1.2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
</style>
