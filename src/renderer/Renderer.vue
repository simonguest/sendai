<script setup lang="ts">
  import { store } from "@store/store"
  import type { Notebook } from "@schemas/notebook"
  import { onMounted, watch } from "vue"

  // Define props
  const props = defineProps<{
    notebook: Notebook
  }>()

  // Store the notebook in the store when the component is mounted
  onMounted(() => {
    store.loadNotebook(props.notebook)
  })

  // Watch for changes to the notebook prop and update the store
  watch(() => props.notebook, (newNotebook) => {
    store.loadNotebook(newNotebook)
  })
</script>

<template>
  <div>
    <p>{{ notebook.cells[0].source }}</p>
  </div>
</template>
