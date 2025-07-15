import type { Locale } from '../types';

export const SETTINGS_LABELS: Record<Locale, {
  title: string;
  appearance: string;
  language: string;
  about: string;
  theme: string;
  version: string;
  appName: string;
  aiProviders: string;
  add: string;
  providerName: string;
  providerUrl: string;
  apiKey: string;
  models: string;
  refreshModels: string;
  defaultProvider: string;
  removeProvider: string;
  editProvider: string;
  saveProvider: string;
  cancelEdit: string;
  noProviders: string;
  loadingModels: string;
  errorLoadingModels: string;
  invalidUrl: string;
  providerNameRequired: string;
  apiKeyRequired: string;
  urlRequired: string;
  setDefault: string;
}> = {
  'en-US': {
    title: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    about: 'About',
    theme: 'Theme',
    version: 'Version',
    appName: 'K12 Notebook - Web Shell',
    aiProviders: 'AI Providers',
    add: 'Add',
    providerName: 'Provider Name',
    providerUrl: 'Provider URL',
    apiKey: 'API Key',
    models: 'Models',
    refreshModels: 'Refresh Models',
    defaultProvider: 'Default Provider',
    removeProvider: 'Remove Provider',
    editProvider: 'Edit Provider',
    saveProvider: 'Save Provider',
    cancelEdit: 'Cancel',
    noProviders: 'No AI providers configured',
    loadingModels: 'Loading models...',
    errorLoadingModels: 'Error loading models',
    invalidUrl: 'Invalid URL format',
    providerNameRequired: 'Provider name is required',
    apiKeyRequired: 'API key is required',
    urlRequired: 'URL is required',
    setDefault: 'Set Default'
  },
  'ja-JP': {
    title: '設定',
    appearance: '外観',
    language: '言語',
    about: 'について',
    theme: 'テーマ',
    version: 'バージョン',
    appName: 'K12ノートブック - ウェブシェル',
    aiProviders: 'AIプロバイダー',
    add: '追加',
    providerName: 'プロバイダー名',
    providerUrl: 'プロバイダーURL',
    apiKey: 'APIキー',
    models: 'モデル',
    refreshModels: 'モデルを更新',
    defaultProvider: 'デフォルトプロバイダー',
    removeProvider: 'プロバイダーを削除',
    editProvider: 'プロバイダーを編集',
    saveProvider: 'プロバイダーを保存',
    cancelEdit: 'キャンセル',
    noProviders: 'AIプロバイダーが設定されていません',
    loadingModels: 'モデルを読み込み中...',
    errorLoadingModels: 'モデルの読み込みエラー',
    invalidUrl: '無効なURL形式',
    providerNameRequired: 'プロバイダー名は必須です',
    apiKeyRequired: 'APIキーは必須です',
    urlRequired: 'URLは必須です',
    setDefault: 'デフォルトに設定'
  },
  'hi-IN': {
    title: 'सेटिंग्स',
    appearance: 'दिखावट',
    language: 'भाषा',
    about: 'के बारे में',
    theme: 'थीम',
    version: 'संस्करण',
    appName: 'K12 नोटबुक - वेब शेल',
    aiProviders: 'AI प्रदाता',
    add: 'जोड़ें',
    providerName: 'प्रदाता का नाम',
    providerUrl: 'प्रदाता URL',
    apiKey: 'API की',
    models: 'मॉडल',
    refreshModels: 'मॉडल रीफ्रेश करें',
    defaultProvider: 'डिफ़ॉल्ट प्रदाता',
    removeProvider: 'प्रदाता हटाएं',
    editProvider: 'प्रदाता संपादित करें',
    saveProvider: 'प्रदाता सहेजें',
    cancelEdit: 'रद्द करें',
    noProviders: 'कोई AI प्रदाता कॉन्फ़िगर नहीं',
    loadingModels: 'मॉडल लोड हो रहे हैं...',
    errorLoadingModels: 'मॉडल लोड करने में त्रुटि',
    invalidUrl: 'अमान्य URL प्रारूप',
    providerNameRequired: 'प्रदाता का नाम आवश्यक है',
    apiKeyRequired: 'API की आवश्यक है',
    urlRequired: 'URL आवश्यक है',
    setDefault: 'डिफ़ॉल्ट सेट करें'
  },
  'fa-IR': {
    title: 'تنظیمات',
    appearance: 'ظاهر',
    language: 'زبان',
    about: 'درباره',
    theme: 'تم',
    version: 'نسخه',
    appName: 'دفترچه K12 - پوسته وب',
    aiProviders: 'ارائه‌دهندگان هوش مصنوعی',
    add: 'افزودن',
    providerName: 'نام ارائه‌دهنده',
    providerUrl: 'آدرس ارائه‌دهنده',
    apiKey: 'کلید API',
    models: 'مدل‌ها',
    refreshModels: 'بروزرسانی مدل‌ها',
    defaultProvider: 'ارائه‌دهنده پیش‌فرض',
    removeProvider: 'حذف ارائه‌دهنده',
    editProvider: 'ویرایش ارائه‌دهنده',
    saveProvider: 'ذخیره ارائه‌دهنده',
    cancelEdit: 'لغو',
    noProviders: 'هیچ ارائه‌دهنده هوش مصنوعی پیکربندی نشده',
    loadingModels: 'در حال بارگذاری مدل‌ها...',
    errorLoadingModels: 'خطا در بارگذاری مدل‌ها',
    invalidUrl: 'فرمت آدرس نامعتبر',
    providerNameRequired: 'نام ارائه‌دهنده الزامی است',
    apiKeyRequired: 'کلید API الزامی است',
    urlRequired: 'آدرس الزامی است',
    setDefault: 'تنظیم به عنوان پیش‌فرض'
  }
} as const;
