import { reactive } from "vue";
import { Theme, DEFAULT_THEME, Locale, DEFAULT_LOCALE} from "@shared/types";

export const settingsStore = reactive({
  theme: (localStorage.getItem('theme') as Theme) || DEFAULT_THEME,
  locale: (localStorage.getItem('locale') as Locale) || DEFAULT_LOCALE,
  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  },
  setLocale(locale: Locale) {
    this.locale = locale;
    localStorage.setItem('locale', locale);
  }
});
