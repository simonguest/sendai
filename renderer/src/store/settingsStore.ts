import { reactive } from "vue";

export type Locale = "en-US" | "hi-IN" | "ja-JP";

export const settingsStore = reactive({
  locale: "en-US" as Locale,
  setLocale(locale: Locale) {
    this.locale = locale;
  }
});
