<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps<{ notebookId: string }>();

onMounted(async () => {
  console.log("TODO: New worker for " + props.notebookId);
});
</script>

<template>
  <slot />
</template>
