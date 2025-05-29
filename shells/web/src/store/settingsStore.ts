import { reactive } from "vue";
import { Theme, DEFAULT_THEME } from "@shared/types";

export type Locale = "en-US" | "hi-IN" | "ja-JP";

export const settingsStore = reactive({
  theme: (localStorage.getItem('theme') as Theme) || DEFAULT_THEME,
  locale: (localStorage.getItem('locale') as Locale) || "en-US" as Locale,
  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  },
  setLocale(locale: Locale) {
    this.locale = locale;
    localStorage.setItem('locale', locale);
  }
});
