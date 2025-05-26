<script setup lang="ts">
import { ref } from "vue";
import { settingsStore, Theme, Locale } from "@renderer/store/settingsStore";

const currentTheme = ref(settingsStore.theme);
const currentLocale = ref(settingsStore.locale);

const themes = [
  { title: 'Light', value: 'light' as Theme },
  { title: 'Dark', value: 'dark' as Theme }
];

const locales = [
  { title: 'English (US)', value: 'en-US' as Locale },
  { title: 'Español', value: 'es-ES' as Locale },
  { title: 'Français', value: 'fr-FR' as Locale }
];

const updateTheme = (theme: Theme) => {
  settingsStore.setTheme(theme);
  currentTheme.value = theme;
};

const updateLocale = (locale: Locale) => {
  settingsStore.setLocale(locale);
  currentLocale.value = locale;
};
</script>

<template>
  <div class="settings-view">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">Settings</h1>
          
          <v-card class="mb-4">
            <v-card-title>Appearance</v-card-title>
            <v-card-text>
              <v-select
                v-model="currentTheme"
                :items="themes"
                label="Theme"
                item-title="title"
                item-value="value"
                @update:model-value="updateTheme"
              ></v-select>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Language</v-card-title>
            <v-card-text>
              <v-select
                v-model="currentLocale"
                :items="locales"
                label="Language"
                item-title="title"
                item-value="value"
                @update:model-value="updateLocale"
              ></v-select>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title>About</v-card-title>
            <v-card-text>
              <p class="text-body-1">
                K12 Notebook - Web Shell
              </p>
              <p class="text-body-2 text-medium-emphasis">
                Version 0.1.0
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.settings-view {
  height: 100%;
  width: 100%;
  padding: 16px;
}
</style>
