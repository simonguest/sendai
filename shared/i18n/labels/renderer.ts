import type { Locale } from '../types';

export const RENDERER_LABELS: Record<Locale, {
  notebookStarting: string;
  notebookStartError: string;
}> = {
  'en-US': {
    notebookStarting: 'The notebook is starting up...',
    notebookStartError: 'The notebook could not be started because of an error:'
  },
  'ja-JP': {
    notebookStarting: 'ノートブックを起動中...',
    notebookStartError: 'エラーのためノートブックを起動できませんでした:'
  },
  'hi-IN': {
    notebookStarting: 'नोटबुक शुरू हो रहा है...',
    notebookStartError: 'त्रुटि के कारण नोटबुक शुरू नहीं हो सका:'
  },
  'fa-IR': {
    notebookStarting: 'دفترچه در حال راه‌اندازی است...',
    notebookStartError: 'دفترچه به دلیل خطا راه‌اندازی نشد:'
  }
} as const;
