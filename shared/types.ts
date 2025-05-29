// Theme constants and types
export const THEME_OPTIONS = ['light', 'dark'] as const;
export type Theme = typeof THEME_OPTIONS[number];
export const DEFAULT_THEME: Theme = 'dark';
export const THEME_LABELS: Record<Locale, Record<Theme, string>> = {
  'en-US': {
    light: 'Light',
    dark: 'Dark'
  },
  'ja-JP': {
    light: 'ライト',
    dark: 'ダーク'
  },
  'hi-IN': {
    light: 'हल्का',
    dark: 'गहरा'
  },
  'fa-IR': {
    light: 'روشن',
    dark: 'تیره'
  }
} as const;

// Text direction types
export type TextDirection = 'ltr' | 'rtl';

// Locale constants and types
export const LOCALE_OPTIONS = ['en-US', 'ja-JP', 'hi-IN', 'fa-IR'] as const;
export type Locale = typeof LOCALE_OPTIONS[number];
export const DEFAULT_LOCALE: Locale = 'en-US';

// Locale metadata with direction information
export const LOCALE_METADATA: Record<Locale, {
  direction: TextDirection;
  name: string;
}> = {
  'en-US': { direction: 'ltr', name: 'English (US)' },
  'ja-JP': { direction: 'ltr', name: '日本語' },
  'hi-IN': { direction: 'ltr', name: 'हिन्दी' },
  'fa-IR': { direction: 'rtl', name: 'فارسی' }
} as const;

// Legacy locale labels for backward compatibility
export const LOCALE_LABELS: Record<Locale, string> = {
  'en-US': 'English (US)',
  'ja-JP': '日本語',
  'hi-IN': 'हिन्दी',
  'fa-IR': 'فارسی'
} as const;

// Navigation translations
export const NAV_LABELS: Record<Locale, { notebooks: string; curriculum: string; settings: string }> = {
  'en-US': {
    notebooks: 'Notebooks',
    curriculum: 'Curriculum',
    settings: 'Settings'
  },
  'ja-JP': {
    notebooks: 'ノートブック',
    curriculum: 'カリキュラム',
    settings: '設定'
  },
  'hi-IN': {
    notebooks: 'नोटबुक',
    curriculum: 'पाठ्यक्रम',
    settings: 'सेटिंग्स'
  },
  'fa-IR': {
    notebooks: 'دفترچه‌ها',
    curriculum: 'برنامه درسی',
    settings: 'تنظیمات'
  }
} as const;

// Settings page translations
export const SETTINGS_LABELS: Record<Locale, {
  title: string;
  appearance: string;
  language: string;
  about: string;
  theme: string;
  version: string;
  appName: string;
}> = {
  'en-US': {
    title: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    about: 'About',
    theme: 'Theme',
    version: 'Version',
    appName: 'K12 Notebook - Web Shell'
  },
  'ja-JP': {
    title: '設定',
    appearance: '外観',
    language: '言語',
    about: 'について',
    theme: 'テーマ',
    version: 'バージョン',
    appName: 'K12ノートブック - ウェブシェル'
  },
  'hi-IN': {
    title: 'सेटिंग्स',
    appearance: 'दिखावट',
    language: 'भाषा',
    about: 'के बारे में',
    theme: 'थीम',
    version: 'संस्करण',
    appName: 'K12 नोटबुक - वेब शेल'
  },
  'fa-IR': {
    title: 'تنظیمات',
    appearance: 'ظاهر',
    language: 'زبان',
    about: 'درباره',
    theme: 'تم',
    version: 'نسخه',
    appName: 'دفترچه K12 - پوسته وب'
  }
} as const;
