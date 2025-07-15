<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { settingsStore } from '../store/settingsStore';
import { AIProviderService } from '../services/aiProviderService';
import type { AIProvider, ProviderType } from '../types/aiProvider';
import { SETTINGS_LABELS } from '@shared/i18n/labels/settings';

// Load provider types
import providerTypesData from './providerTypes.json';
const providerTypes: ProviderType[] = providerTypesData;

// Reactive state
const editingProvider = ref<string | null>(null);
const loadingModels = ref<Record<string, boolean>>({});
const modelErrors = ref<Record<string, string>>({});
const formErrors = ref<Record<string, string>>({});

// Computed
const settingsLabels = computed(() => SETTINGS_LABELS[settingsStore.locale]);

// Form data for editing
const editForm = ref({
  name: '',
  url: '',
  apiKey: '',
  selectedModel: '',
  type: ''
});

// Methods
const startEdit = (provider: AIProvider) => {
  editingProvider.value = provider.id;
  editForm.value = {
    name: provider.name,
    url: provider.url,
    apiKey: provider.apiKey,
    selectedModel: provider.selectedModel,
    type: provider.type
  };
  formErrors.value = {};
};

const cancelEdit = () => {
  editingProvider.value = null;
  editForm.value = { name: '', url: '', apiKey: '', selectedModel: '', type: '' };
  formErrors.value = {};
};

const validateForm = (): boolean => {
  formErrors.value = {};
  
  if (!editForm.value.name.trim()) {
    formErrors.value.name = settingsLabels.value.providerNameRequired;
  }
  
  if (!editForm.value.url.trim()) {
    formErrors.value.url = settingsLabels.value.urlRequired;
  } else if (!AIProviderService.validateUrl(editForm.value.url)) {
    formErrors.value.url = settingsLabels.value.invalidUrl;
  }
  
  if (!editForm.value.apiKey.trim()) {
    formErrors.value.apiKey = settingsLabels.value.apiKeyRequired;
  }
  
  return Object.keys(formErrors.value).length === 0;
};

const saveProvider = async () => {
  if (!validateForm() || !editingProvider.value) return;
  
  const updates: Partial<AIProvider> = {
    name: editForm.value.name.trim(),
    url: editForm.value.url.trim(),
    apiKey: editForm.value.apiKey.trim(),
    selectedModel: editForm.value.selectedModel,
    type: editForm.value.type
  };
  
  settingsStore.updateProvider(editingProvider.value, updates);
  cancelEdit();
};

const addProvider = (providerType: ProviderType) => {
  const newProvider = {
    name: providerType.name,
    url: providerType.url,
    apiKey: '',
    selectedModel: '',
    type: providerType.name,
    models: []
  };
  
  settingsStore.addProvider(newProvider);
  
  // Get the newly added provider and put it in edit mode
  const addedProvider = settingsStore.aiProviders[settingsStore.aiProviders.length - 1];
  if (addedProvider) {
    startEdit(addedProvider);
  }
};

const removeProvider = (providerId: string) => {
  settingsStore.removeProvider(providerId);
};

const setAsDefault = (providerId: string) => {
  settingsStore.setDefaultProvider(providerId);
};

const refreshModels = async (provider: AIProvider) => {
  if (!provider.apiKey || !provider.url) return;
  
  loadingModels.value[provider.id] = true;
  modelErrors.value[provider.id] = '';
  
  try {
    const models = await AIProviderService.fetchModels(provider.url, provider.apiKey);
    settingsStore.updateProvider(provider.id, { models });
    
    // If no model is selected and we have models, select the first one
    if (!provider.selectedModel && models.length > 0) {
      settingsStore.updateProvider(provider.id, { selectedModel: models[0].id });
    }
  } catch (error) {
    modelErrors.value[provider.id] = settingsLabels.value.errorLoadingModels;
    console.error('Error fetching models:', error);
  } finally {
    loadingModels.value[provider.id] = false;
  }
};

const updateSelectedModel = (providerId: string, modelId: string) => {
  settingsStore.updateProvider(providerId, { selectedModel: modelId });
};

// Debounce timer for auto-refresh
let debounceTimer: NodeJS.Timeout | null = null;

// Auto-refresh models when API key or URL changes
const handleApiKeyChange = async () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(async () => {
    if (editForm.value.apiKey.trim() && editForm.value.url.trim() && editingProvider.value) {
      const provider = settingsStore.aiProviders.find(p => p.id === editingProvider.value);
      if (provider) {
        // Update the provider with the new API key first
        settingsStore.updateProvider(editingProvider.value, { 
          apiKey: editForm.value.apiKey.trim(),
          url: editForm.value.url.trim()
        });
        
        // Then refresh models
        await refreshModels({
          ...provider,
          apiKey: editForm.value.apiKey.trim(),
          url: editForm.value.url.trim()
        });
      }
    }
  }, 1000); // Wait 1 second after user stops typing
};

const handleUrlChange = async () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(async () => {
    if (editForm.value.apiKey.trim() && editForm.value.url.trim() && editingProvider.value) {
      const provider = settingsStore.aiProviders.find(p => p.id === editingProvider.value);
      if (provider) {
        // Update the provider with the new URL first
        settingsStore.updateProvider(editingProvider.value, { 
          apiKey: editForm.value.apiKey.trim(),
          url: editForm.value.url.trim()
        });
        
        // Then refresh models
        await refreshModels({
          ...provider,
          apiKey: editForm.value.apiKey.trim(),
          url: editForm.value.url.trim()
        });
      }
    }
  }, 1000); // Wait 1 second after user stops typing
};

onMounted(() => {
  // Auto-refresh models for providers that have API keys but no models
  settingsStore.aiProviders.forEach(provider => {
    if (provider.apiKey && provider.url && (!provider.models || provider.models.length === 0)) {
      refreshModels(provider);
    }
  });
});
</script>

<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex justify-space-between align-center">
      {{ settingsLabels.aiProviders }}
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            variant="outlined"
            v-bind="props"
            prepend-icon="mdi-plus"
          >
            {{ settingsLabels.add }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="providerType in providerTypes"
            :key="providerType.name"
            @click="addProvider(providerType)"
          >
            <v-list-item-title>{{ providerType.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>

    <v-card-text>
      <div v-if="settingsStore.aiProviders.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-robot-outline</v-icon>
        <p class="text-body-1 text-medium-emphasis">{{ settingsLabels.noProviders }}</p>
      </div>

      <div v-else class="provider-list">
        <v-card
          v-for="provider in settingsStore.aiProviders"
          :key="provider.id"
          class="mb-3"
          :variant="provider.isDefault ? 'tonal' : 'outlined'"
        >
          <v-card-text>
            <!-- Default provider indicator and Set Default button -->
            <div class="d-flex align-center gap-2 mb-2">
              <v-chip
                v-if="provider.isDefault"
                color="primary"
                size="small"
              >
                {{ settingsLabels.defaultProvider }}
              </v-chip>
              
              <v-btn
                v-if="!provider.isDefault"
                size="small"
                variant="outlined"
                @click="setAsDefault(provider.id)"
              >
                {{ settingsLabels.setDefault }}
              </v-btn>
            </div>

            <!-- View mode -->
            <div v-if="editingProvider !== provider.id">
              <div class="d-flex justify-space-between align-start mb-3">
                <div class="flex-grow-1">
                  <h3 class="text-h6">{{ provider.name }}</h3>
                  <p class="text-body-2 text-medium-emphasis">{{ provider.url }}</p>
                  <p class="text-body-2" v-if="provider.selectedModel">
                    Model: {{ provider.selectedModel }}
                  </p>
                </div>
                
                <div class="d-flex gap-2 flex-shrink-0">
                  <v-btn
                    size="small"
                    variant="outlined"
                    icon="mdi-pencil"
                    @click="startEdit(provider)"
                  ></v-btn>
                  
                  <v-btn
                    size="small"
                    variant="outlined"
                    color="error"
                    icon="mdi-delete"
                    @click="removeProvider(provider.id)"
                  ></v-btn>
                </div>
              </div>
            </div>

            <!-- Edit mode -->
            <div v-else>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editForm.name"
                    :label="settingsLabels.providerName"
                    :error-messages="formErrors.name"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="editForm.url"
                    :label="settingsLabels.providerUrl"
                    :error-messages="formErrors.url"
                    variant="outlined"
                    density="compact"
                    @update:model-value="handleUrlChange"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="editForm.apiKey"
                    :label="settingsLabels.apiKey"
                    :error-messages="formErrors.apiKey"
                    type="password"
                    variant="outlined"
                    density="compact"
                    @update:model-value="handleApiKeyChange"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="4">
                  <div class="d-flex gap-2">
                    <v-select
                      v-model="editForm.selectedModel"
                      :items="provider.models || []"
                      item-title="id"
                      item-value="id"
                      :label="settingsLabels.models"
                      variant="outlined"
                      density="compact"
                      :loading="loadingModels[provider.id]"
                      :disabled="!provider.models || provider.models.length === 0"
                      @update:model-value="updateSelectedModel(provider.id, $event)"
                    ></v-select>
                    
                    <v-btn
                      icon="mdi-refresh"
                      size="small"
                      variant="outlined"
                      :loading="loadingModels[provider.id]"
                      :disabled="!editForm.apiKey || !editForm.url"
                      @click="refreshModels(provider)"
                    ></v-btn>
                  </div>
                  
                  <div v-if="modelErrors[provider.id]" class="text-error text-caption mt-1">
                    {{ modelErrors[provider.id] }}
                  </div>
                </v-col>
              </v-row>
              
              <div class="d-flex justify-end gap-2 mt-3">
                <v-btn
                  variant="outlined"
                  @click="cancelEdit"
                >
                  {{ settingsLabels.cancelEdit }}
                </v-btn>
                
                <v-btn
                  color="primary"
                  @click="saveProvider"
                >
                  {{ settingsLabels.saveProvider }}
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.provider-list {
  max-height: 600px;
  overflow-y: auto;
}

.gap-2 {
  gap: 8px;
}
</style>
