// Theme constants and types
export const THEME_OPTIONS = ['light', 'dark'] as const;
export type Theme = typeof THEME_OPTIONS[number];

// Default theme
export const DEFAULT_THEME: Theme = 'dark';

// Theme display names for UI
export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark'
} as const;
