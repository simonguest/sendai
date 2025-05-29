// Theme constants and types
export const THEME_OPTIONS = ['light', 'dark'] as const;
export type Theme = typeof THEME_OPTIONS[number];
export const DEFAULT_THEME: Theme = 'dark';
export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark'
} as const;

// Locale constants and types
export const LOCALE_OPTIONS = ['en-US', 'ja-JP', 'hi-IN'] as const;
export type Locale = typeof LOCALE_OPTIONS[number];
export const DEFAULT_LOCALE: Locale = 'en-US';
export const LOCALE_LABELS: Record<Locale, string> = {
  'en-US': 'English (US)',
  'ja-JP': '日本語',
  'hi-IN': 'हिन्दी'
} as const;
