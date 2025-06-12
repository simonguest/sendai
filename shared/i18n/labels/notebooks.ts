import type { Locale } from '../types';

export const NOTEBOOK_LABELS: Record<Locale, {
  title: string;
  addNotebook: string;
  blank: string;
  fromTemplate: string;
  fromFile: string;
  fromUrl: string;
  delete: string;
  lastEdited: string;
  back: string;
  notebookViewer: string;
  // Save status labels
  saved: string;
  saving: string;
  saveError: string;
  // Loading and error states
  loadingNotebook: string;
  failedToLoad: string;
  backToNotebooks: string;
  untitledNotebook: string;
  // Time formatting
  justNow: string;
  hoursAgo: string;
  hourAgo: string;
  daysAgo: string;
  dayAgo: string;
  // URL import labels
  urlDialogTitle: string;
  urlDialogLabel: string;
  urlDialogOpen: string;
  urlDialogCancel: string;
  urlDialogError: string;
  urlDialogErrorMessage: string;
  urlDialogInvalidUrl: string;
}> = {
  'en-US': {
    title: 'Notebooks',
    addNotebook: 'Add',
    blank: 'Blank',
    fromTemplate: 'From template',
    fromFile: 'From File',
    fromUrl: 'From URL',
    delete: 'Delete',
    lastEdited: 'Last edited',
    back: 'Back',
    notebookViewer: 'Notebook Viewer',
    // Save status labels
    saved: 'Saved',
    saving: 'Saving...',
    saveError: 'Save Error',
    // Loading and error states
    loadingNotebook: 'Loading notebook...',
    failedToLoad: 'Failed to load notebook',
    backToNotebooks: 'Back to Notebooks',
    untitledNotebook: 'Untitled Notebook',
    // Time formatting
    justNow: 'Just now',
    hoursAgo: 'hours ago',
    hourAgo: 'hour ago',
    daysAgo: 'days ago',
    dayAgo: 'day ago',
    // URL import labels
    urlDialogTitle: 'Import from URL',
    urlDialogLabel: 'Enter notebook URL',
    urlDialogOpen: 'Open',
    urlDialogCancel: 'Close',
    urlDialogError: 'Error',
    urlDialogErrorMessage: 'Failed to fetch notebook from URL',
    urlDialogInvalidUrl: 'Please enter a valid URL (must start with http:// or https://)'
  },
  'ja-JP': {
    title: 'ノートブック',
    addNotebook: '追加',
    blank: '空白',
    fromTemplate: 'テンプレートから',
    fromFile: 'ファイルから',
    fromUrl: 'URLから',
    delete: '削除',
    lastEdited: '最終編集',
    back: '戻る',
    notebookViewer: 'ノートブックビューア',
    // Save status labels
    saved: '保存済み',
    saving: '保存中...',
    saveError: '保存エラー',
    // Loading and error states
    loadingNotebook: 'ノートブックを読み込み中...',
    failedToLoad: 'ノートブックの読み込みに失敗しました',
    backToNotebooks: 'ノートブックに戻る',
    untitledNotebook: '無題のノートブック',
    // Time formatting
    justNow: 'たった今',
    hoursAgo: '時間前',
    hourAgo: '時間前',
    daysAgo: '日前',
    dayAgo: '日前',
    // URL import labels
    urlDialogTitle: 'URLからインポート',
    urlDialogLabel: 'ノートブックのURLを入力',
    urlDialogOpen: '開く',
    urlDialogCancel: '閉じる',
    urlDialogError: 'エラー',
    urlDialogErrorMessage: 'URLからノートブックを取得できませんでした',
    urlDialogInvalidUrl: '有効なURLを入力してください（http://またはhttps://で始まる必要があります）'
  },
  'hi-IN': {
    title: 'नोटबुक',
    addNotebook: 'जोड़ें',
    blank: 'खाली',
    fromTemplate: 'टेम्प्लेट से',
    fromFile: 'फ़ाइल से',
    fromUrl: 'URL से',
    delete: 'हटाएं',
    lastEdited: 'अंतिम संपादन',
    back: 'वापस',
    notebookViewer: 'नोटबुक व्यूअर',
    // Save status labels
    saved: 'सहेजा गया',
    saving: 'सहेज रहे हैं...',
    saveError: 'सहेजने में त्रुटि',
    // Loading and error states
    loadingNotebook: 'नोटबुक लोड हो रहा है...',
    failedToLoad: 'नोटबुक लोड करने में विफल',
    backToNotebooks: 'नोटबुक पर वापस जाएं',
    untitledNotebook: 'बिना शीर्षक नोटबुक',
    // Time formatting
    justNow: 'अभी',
    hoursAgo: 'घंटे पहले',
    hourAgo: 'घंटा पहले',
    daysAgo: 'दिन पहले',
    dayAgo: 'दिन पहले',
    // URL import labels
    urlDialogTitle: 'URL से आयात करें',
    urlDialogLabel: 'नोटबुक URL दर्ज करें',
    urlDialogOpen: 'खोलें',
    urlDialogCancel: 'बंद करें',
    urlDialogError: 'त्रुटि',
    urlDialogErrorMessage: 'URL से नोटबुक प्राप्त करने में विफल',
    urlDialogInvalidUrl: 'कृपया एक वैध URL दर्ज करें (http:// या https:// से शुरू होना चाहिए)'
  },
  'fa-IR': {
    title: 'دفترچه‌ها',
    addNotebook: 'افزودن',
    blank: 'خالی',
    fromTemplate: 'از قالب',
    fromFile: 'از فایل',
    fromUrl: 'از URL',
    delete: 'حذف',
    lastEdited: 'آخرین ویرایش',
    back: 'بازگشت',
    notebookViewer: 'نمایشگر دفترچه',
    // Save status labels
    saved: 'ذخیره شد',
    saving: 'در حال ذخیره...',
    saveError: 'خطا در ذخیره',
    // Loading and error states
    loadingNotebook: 'در حال بارگذاری دفترچه...',
    failedToLoad: 'بارگذاری دفترچه ناموفق بود',
    backToNotebooks: 'بازگشت به دفترچه‌ها',
    untitledNotebook: 'دفترچه بدون عنوان',
    // Time formatting
    justNow: 'همین الان',
    hoursAgo: 'ساعت پیش',
    hourAgo: 'ساعت پیش',
    daysAgo: 'روز پیش',
    dayAgo: 'روز پیش',
    // URL import labels
    urlDialogTitle: 'وارد کردن از URL',
    urlDialogLabel: 'URL دفترچه را وارد کنید',
    urlDialogOpen: 'باز کردن',
    urlDialogCancel: 'بستن',
    urlDialogError: 'خطا',
    urlDialogErrorMessage: 'دریافت دفترچه از URL ناموفق بود',
    urlDialogInvalidUrl: 'لطفاً یک URL معتبر وارد کنید (باید با http:// یا https:// شروع شود)'
  }
} as const;
