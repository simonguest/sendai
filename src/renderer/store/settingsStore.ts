import { reactive } from "vue";

export type Theme = "light" | "dark";
export type Locale = "en-US" | "hi-IN" | "ja-JP";

export const settingsStore = reactive({
  theme: "dark" as Theme,
  locale: "en-US" as Locale,
  setTheme(theme: Theme) {
    this.theme = theme;
  },
  setLocale(locale: Locale) {
    this.locale = locale;
  }
});
