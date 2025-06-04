import type { Locale } from '../types';

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
