import type { Locale } from '../types';

export const RENDERER_LABELS: Record<Locale, {
  notebookStarting: string;
  notebookStartError: string;
  inputDialogTitle: string;
  inputDialogLabel: string;
  inputDialogCancel: string;
  inputDialogSubmit: string;
}> = {
  'en-US': {
    notebookStarting: 'The notebook is starting up...',
    notebookStartError: 'The notebook could not be started because of an error:',
    inputDialogTitle: 'Enter Input',
    inputDialogLabel: 'Input',
    inputDialogCancel: 'Cancel',
    inputDialogSubmit: 'Submit'
  },
  'ja-JP': {
    notebookStarting: 'ノートブックを起動中...',
    notebookStartError: 'エラーのためノートブックを起動できませんでした:',
    inputDialogTitle: '入力してください',
    inputDialogLabel: '入力',
    inputDialogCancel: 'キャンセル',
    inputDialogSubmit: '送信'
  },
  'hi-IN': {
    notebookStarting: 'नोटबुक शुरू हो रहा है...',
    notebookStartError: 'त्रुटि के कारण नोटबुक शुरू नहीं हो सका:',
    inputDialogTitle: 'इनपुट दर्ज करें',
    inputDialogLabel: 'इनपुट',
    inputDialogCancel: 'रद्द करें',
    inputDialogSubmit: 'जमा करें'
  },
  'fa-IR': {
    notebookStarting: 'دفترچه در حال راه‌اندازی است...',
    notebookStartError: 'دفترچه به دلیل خطا راه‌اندازی نشد:',
    inputDialogTitle: 'ورودی را وارد کنید',
    inputDialogLabel: 'ورودی',
    inputDialogCancel: 'لغو',
    inputDialogSubmit: 'ارسال'
  }
} as const;
