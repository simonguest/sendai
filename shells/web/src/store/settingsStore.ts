import { reactive } from "vue";
import { Theme, DEFAULT_THEME, Locale, DEFAULT_LOCALE} from "@shared/types";
import type { AIProvider } from "../types/aiProvider";
import { AIProviderService } from "../services/aiProviderService";

const loadAIProviders = (): AIProvider[] => {
  const stored = localStorage.getItem('aiProviders');
  return stored ? JSON.parse(stored) : [];
};

const saveAIProviders = (providers: AIProvider[]) => {
  localStorage.setItem('aiProviders', JSON.stringify(providers));
};

export const settingsStore = reactive({
  theme: (localStorage.getItem('theme') as Theme) || DEFAULT_THEME,
  locale: (localStorage.getItem('locale') as Locale) || DEFAULT_LOCALE,
  aiProviders: loadAIProviders(),
  
  setTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem('theme', theme);
  },
  
  setLocale(locale: Locale) {
    this.locale = locale;
    localStorage.setItem('locale', locale);
  },
  
  addProvider(provider: Omit<AIProvider, 'id' | 'isDefault'>) {
    const newProvider: AIProvider = {
      ...provider,
      id: AIProviderService.generateId(),
      isDefault: this.aiProviders.length === 0, // First provider becomes default
    };
    
    this.aiProviders.push(newProvider);
    saveAIProviders(this.aiProviders);
  },
  
  removeProvider(providerId: string) {
    const providerIndex = this.aiProviders.findIndex(p => p.id === providerId);
    if (providerIndex === -1) return;
    
    const wasDefault = this.aiProviders[providerIndex].isDefault;
    this.aiProviders.splice(providerIndex, 1);
    
    // If we removed the default provider, make the first remaining provider default
    if (wasDefault && this.aiProviders.length > 0) {
      this.aiProviders[0].isDefault = true;
    }
    
    saveAIProviders(this.aiProviders);
  },
  
  updateProvider(providerId: string, updates: Partial<AIProvider>) {
    const provider = this.aiProviders.find(p => p.id === providerId);
    if (provider) {
      Object.assign(provider, updates);
      saveAIProviders(this.aiProviders);
    }
  },
  
  setDefaultProvider(providerId: string) {
    // Remove default from all providers
    this.aiProviders.forEach(p => p.isDefault = false);
    
    // Set the specified provider as default
    const provider = this.aiProviders.find(p => p.id === providerId);
    if (provider) {
      provider.isDefault = true;
      saveAIProviders(this.aiProviders);
    }
  },
  
  getDefaultProvider(): AIProvider | undefined {
    return this.aiProviders.find(p => p.isDefault);
  }
});
