import type { Locale, TextDirection } from './types';

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
