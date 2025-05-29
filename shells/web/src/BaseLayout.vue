<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useTheme } from "vuetify";
import { settingsStore } from "./store/settingsStore";
import { NAV_LABELS, LOCALE_METADATA } from "@shared/types";

const router = useRouter();
const route = useRoute();

// Map routes to tab indices
const routeToTab = {
  '/notebooks': 0,
  '/curriculum': 1,
  '/settings': 2
};

const tabToRoute = {
  0: '/notebooks',
  1: '/curriculum',
  2: '/settings'
};

// Compute active tab based on current route
const activeTab = computed({
  get: () => routeToTab[route.path as keyof typeof routeToTab] ?? 0,
  set: (value: number) => {
    const targetRoute = tabToRoute[value as keyof typeof tabToRoute];
    if (targetRoute && route.path !== targetRoute) {
      router.push(targetRoute);
    }
  }
});

// Initialize theme
const theme = useTheme();

// Get navigation labels based on current locale
const navLabels = computed(() => NAV_LABELS[settingsStore.locale]);

// Get current text direction
const currentDirection = computed(() => LOCALE_METADATA[settingsStore.locale].direction);

// Get current locale for HTML lang attribute
const currentLocale = computed(() => settingsStore.locale);

// Watch for direction and locale changes
watch([currentDirection, currentLocale], ([direction, locale]) => {
  document.documentElement.dir = direction;
  document.documentElement.lang = locale;
}, { immediate: true });

onMounted(() => {
  // Set the initial theme from the store
  theme.global.name.value = settingsStore.theme;
  // Set initial direction and locale
  document.documentElement.dir = currentDirection.value;
  document.documentElement.lang = currentLocale.value;
});
</script>

<template>
  <v-app>
    <v-main>
      <!-- Main content area with router view -->
      <div class="content-container">
        <router-view />
      </div>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-model="activeTab"
      color="primary"
      grow
      :class="{ 'rtl-navigation': currentDirection === 'rtl' }"
    >
      <v-btn value="0">
        <v-icon>mdi-notebook</v-icon>
        <span>{{ navLabels.notebooks }}</span>
      </v-btn>

      <v-btn value="1">
        <v-icon>mdi-school</v-icon>
        <span>{{ navLabels.curriculum }}</span>
      </v-btn>

      <v-btn value="2">
        <v-icon>mdi-cog</v-icon>
        <span>{{ navLabels.settings }}</span>
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

/* RTL-specific styles */
.rtl-navigation {
  direction: rtl;
}

/* Ensure proper text alignment in RTL */
.rtl-navigation .v-btn {
  text-align: center;
}
</style>
