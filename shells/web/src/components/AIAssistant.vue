<script setup lang="ts">
import { ref, computed, nextTick, onMounted, toRaw, onUpdated, watch } from "vue";
import { marked } from "marked";

import { OpenAI } from "openai";
import {
  Agent,
  Runner,
  AgentInputItem,
  UserMessageItem,
  AssistantMessageItem,
  OpenAIChatCompletionsModel,
} from "@openai/agents";

import { settingsStore } from "../store/settingsStore";

// Props
const props = defineProps<{
  expanded: boolean;
}>();

// Open AI state
let client: OpenAI;
let agent: Agent;
let runner: Runner;

// Reactive state
const messages = ref<AgentInputItem[]>([]);
const newMessage = ref("");
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement>();
const messageInput = ref<HTMLElement>();

// Preset questions
const presetQuestions = [
  "What are the key concepts covered in this lesson?",
  "Does this lesson meet standards?",
  "Localize this lesson into my language",
  "How can I improve this lesson?",
  "Make this lesson suitable for a K-5 class",
];

// Type guards for message types
const isUserMessage = (message: AgentInputItem): message is UserMessageItem => {
  return "role" in message && message.role === "user";
};

const isAssistantMessage = (message: AgentInputItem): message is AssistantMessageItem => {
  return "role" in message && message.role === "assistant";
};

// Helper functions to extract text content
const getAssistantTextContent = (message: AssistantMessageItem): string => {
  const textContent = message.content.find(item => item.type === "output_text");
  return textContent?.text || "";
};

const getUserTextContent = (message: UserMessageItem): string => {
  if (typeof message.content === "string") {
    return message.content;
  }
  // Handle array content - find first text item
  const textContent = message.content.find(item => item.type === "input_text");
  return textContent?.text || "";
};

// Computed
const hasMessages = computed(() => messages.value.length > 0);
const messageCount = computed(() => messages.value.length);

// Watches
watch(() => props.expanded, (expanded) => {
  if (expanded) {
    focusInput();
  }
});

// Methods
const renderMarkdown = (content: string): string => {
  try {
    const result = marked(content, {
      breaks: true,
      gfm: true,
    });
    return typeof result === "string" ? result : content;
  } catch (err) {
    console.error("Failed to render markdown:", err);
    return content;
  }
};

const scrollToBottom = async (): Promise<void> => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const focusInput = async (): Promise<void> => {
  await nextTick();
  if (messageInput.value) {
    // Focus the actual input element within the v-text-field
    const inputElement =
      (messageInput.value as any).$el?.querySelector("input") ||
      (messageInput.value as any).$el?.querySelector("textarea");
    if (inputElement) {
      inputElement.focus();
    }
  }
};

const sendMessage = async (): Promise<void> => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const userMessage: UserMessageItem = {
    role: "user" as const,
    content: newMessage.value.trim(),
  };
  const messageHistory = toRaw(messages.value).concat(userMessage);

  // Clear input and immediately update UI with user message
  newMessage.value = "";
  messages.value = messageHistory;

  // Scroll to bottom to show the new user message
  await scrollToBottom();

  // Run the agent
  isLoading.value = true;
  const result = await runner.run(agent, messageHistory);
  isLoading.value = false;

  // Update with the full conversation history including assistant response
  messages.value = result.history;

  // Scroll to bottom to show the assistant response
  await scrollToBottom();

  // Restore focus to the input field after assistant responds
  await focusInput();
};

const usePresetQuestion = (question: string): void => {
  newMessage.value = question;
  sendMessage();
};

const clearChat = (): void => {
  messages.value = [];
};

const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

onMounted(() => {
  // Initialize the OpenAI client and agent
  client = new OpenAI({
    baseURL: settingsStore.getDefaultProvider()?.url,
    apiKey: settingsStore.getDefaultProvider()?.apiKey,
    dangerouslyAllowBrowser: true,
  });

  agent = new Agent({
    name: "Lesson Assistant",
    instructions: "You are a helpful assistant to assist with lesson content and improvements.",
    model: new OpenAIChatCompletionsModel(
      client,
      settingsStore.getDefaultProvider()?.selectedModel || "gpt-4o-mini"
    ),
  });

  // Create a new runner for messages
  runner = new Runner();
});
</script>

<template>
  <div class="ai-assistant">
    <!-- Header -->
    <div class="assistant-header">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="mdi-creation" class="me-2" color="primary" />
          <h3 class="text-h7">Lesson Assistant</h3>
        </div>
        <v-btn
          v-if="hasMessages"
          icon="mdi-broom"
          size="small"
          variant="text"
          color="warning"
          @click="clearChat"
          :disabled="isLoading"
        >
          <v-icon>mdi-broom</v-icon>
          <v-tooltip activator="parent" location="bottom">Clear Chat</v-tooltip>
        </v-btn>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-wrapper"
        :class="{
          user: isUserMessage(message),
          assistant: isAssistantMessage(message),
        }"
      >
        <div
          class="message-bubble"
          :class="{
            user: isUserMessage(message),
            assistant: isAssistantMessage(message),
          }"
        >
          <div class="message-role">
            {{
              isUserMessage(message) ? "user" : isAssistantMessage(message) ? "assistant" : "system"
            }}
          </div>
          <div
            v-if="isAssistantMessage(message)"
            class="message-content markdown-content"
            v-html="renderMarkdown(getAssistantTextContent(message))"
          ></div>
          <div v-else-if="isUserMessage(message)" class="message-content">
            {{ getUserTextContent(message) }}
          </div>
          <div v-else class="message-content">
            {{ JSON.stringify(message) }}
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div v-if="isLoading" class="message-wrapper assistant">
        <div class="message-bubble assistant">
          <div class="message-role">assistant</div>
          <div class="message-content">
            <v-progress-circular size="16" width="2" indeterminate class="me-2" />
            Thinking...
          </div>
        </div>
      </div>
    </div>

    <!-- Preset Questions -->
    <div v-if="!hasMessages || messageCount === 1" class="preset-questions">
      <div class="text-caption text-medium-emphasis mb-2">Quick questions:</div>
      <div class="preset-chips">
        <v-chip
          v-for="question in presetQuestions"
          :key="question"
          size="small"
          variant="outlined"
          class="ma-1"
          @click="usePresetQuestion(question)"
          :disabled="isLoading"
        >
          {{ question }}
        </v-chip>
      </div>
    </div>

    <!-- Input Area -->
    <div class="chat-input-area">
      <v-text-field
        ref="messageInput"
        v-model="newMessage"
        placeholder="Ask me anything about this lesson..."
        variant="outlined"
        density="compact"
        hide-details
        :disabled="isLoading"
        @keypress="handleKeyPress"
        class="chat-input"
      >
        <template #append-inner>
          <v-btn
            icon="mdi-send"
            size="small"
            color="primary"
            variant="text"
            :disabled="!newMessage.trim() || isLoading"
            @click="sendMessage"
          />
        </template>
      </v-text-field>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.assistant-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  margin-bottom: 16px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  margin-bottom: 16px;
  min-height: 200px;
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
  max-width: 85%;
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

/* Markdown content styling */
.markdown-content {
  white-space: normal;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 0.5em 0 0.3em 0;
  font-weight: 600;
}

.markdown-content :deep(p) {
  margin: 0.5em 0;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}

.markdown-content :deep(li) {
  margin: 0.2em 0;
}

.markdown-content :deep(code) {
  background-color: rgba(var(--v-theme-surface-variant), 0.7);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 0.85em;
}

.markdown-content :deep(pre) {
  background-color: rgba(var(--v-theme-surface-variant), 0.7);
  padding: 0.8em;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-content :deep(blockquote) {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.5);
  padding-left: 1em;
  margin: 0.5em 0;
  font-style: italic;
}

.markdown-content :deep(strong) {
  font-weight: 600;
}

.markdown-content :deep(em) {
  font-style: italic;
}

.preset-questions {
  margin-bottom: 16px;
  padding: 12px;
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
}

.preset-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chat-input-area {
  margin-bottom: 8px;
}

.chat-input {
  width: 100%;
}

.chat-actions {
  display: flex;
  justify-content: center;
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

/* RTL support */
html[dir="rtl"] .message-wrapper.user {
  justify-content: flex-start;
}

html[dir="rtl"] .message-wrapper.assistant {
  justify-content: flex-end;
}

html[dir="rtl"] .message-bubble.user {
  border-bottom-right-radius: 16px;
  border-bottom-left-radius: 4px;
}

html[dir="rtl"] .message-bubble.assistant {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 4px;
}

html[dir="rtl"] .markdown-content :deep(ul),
html[dir="rtl"] .markdown-content :deep(ol) {
  padding-right: 1.5em;
  padding-left: 0;
}

html[dir="rtl"] .markdown-content :deep(blockquote) {
  border-left: none;
  border-right: 3px solid rgba(var(--v-theme-primary), 0.5);
  padding-left: 0;
  padding-right: 1em;
}
</style>
