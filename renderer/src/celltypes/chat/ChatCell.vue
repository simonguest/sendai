<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { Cell } from '@shared/schemas/notebook';
import type { Locale } from '@shared/types';
import { notebookStore } from '@renderer/store/notebookStore';
import type { ChatConfig, ChatMessage } from './types';

const props = defineProps<{
  cell: Cell;
  locale: Locale;
}>();

const error = ref<string | null>(null);
const chatConfig = ref<ChatConfig | null>(null);
const newMessage = ref<string>('');

/**
 * Parse the JSON configuration from the cell source
 */
const parseChatConfig = (): void => {
  try {
    const source = notebookStore.getLocalizedSource(props.cell.id, props.locale);
    if (!source || source.length === 0) {
      throw new Error('No chat configuration found');
    }
    
    const jsonString = source.join('').trim();
    const config = JSON.parse(jsonString) as ChatConfig;
    
    if (!config.url) {
      throw new Error('Chat URL is required');
    }
    
    if (!config.model) {
      throw new Error('Model name is required');
    }
    
    if (!config.messages || !Array.isArray(config.messages)) {
      throw new Error('Messages array is required');
    }
    
    chatConfig.value = {
      temperature: 0.7,
      max_tokens: -1,
      stream: false,
      ...config
    };
    
    error.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Invalid chat configuration';
    chatConfig.value = null;
  }
};

/**
 * Get messages for display (excluding system messages from chat bubbles)
 */
const displayMessages = computed(() => {
  if (!chatConfig.value) return [];
  return chatConfig.value.messages.filter(msg => msg.role !== 'system');
});

/**
 * Get system message if present
 */
const systemMessage = computed(() => {
  if (!chatConfig.value) return null;
  return chatConfig.value.messages.find(msg => msg.role === 'system');
});

/**
 * Handle sending a new message
 */
const sendMessage = (): void => {
  if (!newMessage.value.trim() || !chatConfig.value) return;
  
  // For now, just add the user message to the display
  // In the future, this would trigger the AI API call
  const userMessage: ChatMessage = {
    role: 'user',
    content: newMessage.value.trim()
  };
  
  chatConfig.value.messages.push(userMessage);
  newMessage.value = '';
  
  // TODO: Implement actual AI API call here
  // For now, we're just focusing on UI and parsing as requested
};

/**
 * Handle Enter key in text input
 */
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

onMounted(() => {
  parseChatConfig();
});
</script>

<template>
  <v-card variant="text" max-width="800" class="pt-2 pb-2 ma-auto">
    <v-card-text>
      <!-- Error State -->
      <v-alert 
        v-if="error" 
        type="error" 
        variant="tonal"
        :text="error"
        class="mb-4"
      />
      
      <!-- Chat Interface -->
      <div v-else-if="chatConfig" class="chat-container">
        <!-- System Message Display -->
        <v-alert
          v-if="systemMessage"
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <div class="text-caption text-grey-darken-1 mb-1">System Message:</div>
          <div class="text-body-2">{{ systemMessage.content }}</div>
        </v-alert>
        
        <!-- Chat Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <div
            v-for="(message, index) in displayMessages"
            :key="index"
            class="message-wrapper"
            :class="message.role"
          >
            <div class="message-bubble" :class="message.role">
              <div class="message-role">{{ message.role }}</div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="displayMessages.length === 0" class="empty-chat">
            <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-chat-outline</v-icon>
            <p class="text-body-2 text-grey">Start a conversation...</p>
          </div>
        </div>
        
        <!-- Input Area -->
        <div class="chat-input-area">
          <v-text-field
            v-model="newMessage"
            placeholder="Type your message..."
            variant="outlined"
            density="comfortable"
            hide-details
            @keypress="handleKeyPress"
            class="chat-input"
          >
            <template #append-inner>
              <v-btn
                icon="mdi-send"
                size="small"
                color="primary"
                variant="text"
                :disabled="!newMessage.trim()"
                @click="sendMessage"
              />
            </template>
          </v-text-field>
        </div>
        
        <!-- Configuration Info -->
        <div class="chat-config-info mt-3">
          <v-chip size="small" variant="outlined" class="mr-2">
            <v-icon start>mdi-server</v-icon>
            {{ chatConfig.model }}
          </v-chip>
          <v-chip size="small" variant="outlined" class="mr-2">
            <v-icon start>mdi-thermometer</v-icon>
            T: {{ chatConfig.temperature }}
          </v-chip>
          <v-chip size="small" variant="outlined">
            <v-icon start>mdi-counter</v-icon>
            Max: {{ chatConfig.max_tokens === -1 ? '∞' : chatConfig.max_tokens }}
          </v-chip>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-else class="text-center pa-4">
        <v-progress-circular indeterminate color="primary" />
        <p class="mt-2 text-body-2">Loading chat...</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 100%;
}

.chat-messages {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  padding: 16px 0;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 8px;
  margin-bottom: 16px;
  background-color: rgba(var(--v-theme-surface), 0.5);
}

.message-wrapper {
  margin-bottom: 12px;
  display: flex;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.assistant {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 16px;
  position: relative;
}

.message-bubble.user {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-bottom-right-radius: 4px;
}

.message-bubble.assistant {
  background-color: rgba(var(--v-theme-surface-variant), 1);
  color: rgb(var(--v-theme-on-surface-variant));
  border-bottom-left-radius: 4px;
}

.message-role {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.message-content {
  font-size: 0.875rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  text-align: center;
}

.chat-input-area {
  margin-bottom: 8px;
}

.chat-input {
  width: 100%;
}

.chat-config-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-on-surface-variant), 0.3);
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-on-surface-variant), 0.5);
}

/* Responsive design */
@media (max-width: 600px) {
  .message-bubble {
    max-width: 85%;
  }
  
  .chat-config-info {
    justify-content: center;
  }
}
</style>
