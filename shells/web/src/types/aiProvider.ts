export interface AIProvider {
  id: string;
  name: string;
  url: string;
  apiKey: string;
  selectedModel: string;
  isDefault: boolean;
  type: string;
  models?: AIModel[];
}

export interface AIModel {
  id: string;
  object: string;
  created?: number;
  owned_by?: string;
}

export interface AIModelsResponse {
  data: AIModel[];
  object: string;
}

export interface ProviderType {
  name: string;
  url: string;
}
