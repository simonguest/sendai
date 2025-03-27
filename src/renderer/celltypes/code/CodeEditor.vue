<script setup lang="ts">
  defineProps<{
    source: string[] | undefined
  }>()
</script>

<template>
  {{ source }}
</template>