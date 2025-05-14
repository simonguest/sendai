import { reactive } from "vue";

export type Theme = "light" | "dark";

export const settingsStore = reactive({
  theme: "dark" as Theme,
  setTheme(theme: Theme) {
    this.theme = theme;
  },
});
