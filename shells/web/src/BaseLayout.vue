<script setup lang="ts">
import { ref } from "vue";
import type { Notebook } from "@renderer/schemas/notebook";
import Renderer from "@renderer/Renderer.vue";

// Define props
interface Props {
  initialNotebook: Notebook;
  id: string;
}

const props = defineProps<Props>();
const activeTab = ref(0);

const handleTabChange = (tab: number) => {
  activeTab.value = tab;
  // TODO: Handle navigation logic here when ready
  console.log(`Navigated to tab: ${tab}`);
};
</script>

<template>
  <v-app>
    <v-main>
      <!-- Main content area with the renderer -->
      <div class="content-container">
        <Renderer :initial-notebook="props.initialNotebook" :id="props.id"/>
      </div>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-model="activeTab"
      color="primary"
      grow
      @update:model-value="handleTabChange"
    >
      <v-btn value="0">
        <v-icon>mdi-notebook</v-icon>
        <span>Notebooks</span>
      </v-btn>

      <v-btn value="1">
        <v-icon>mdi-school</v-icon>
        <span>Curriculum</span>
      </v-btn>

      <v-btn value="2">
        <v-icon>mdi-cog</v-icon>
        <span>Settings</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
.content-container {
  padding-bottom: 56px; /* Space for bottom navigation */
  height: calc(100vh - 56px); /* Full height minus bottom nav */
  overflow-y: auto;
}

.v-bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
