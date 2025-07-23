<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';
import { marked } from 'marked';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Props
const props = defineProps<{
  notebookTitle?: string;
}>();

// Reactive state
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref<HTMLElement>();

// Preset questions
const presetQuestions = [
  "What does this notebook do?",
  "Localize this notebook into Japanese",
  "Explain the code in this notebook",
  "How can I improve this notebook?",
  "What are the key concepts covered here?"
];

// Computed
const hasMessages = computed(() => messages.value.length > 0);

// Methods
const renderMarkdown = (content: string): string => {
  try {
    const result = marked(content, {
      breaks: true,
      gfm: true
    });
    return typeof result === 'string' ? result : content;
  } catch (err) {
    console.error('Failed to render markdown:', err);
    return content;
  }
};

const scrollToBottom = async (): Promise<void> => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const addMessage = (role: 'user' | 'assistant', content: string): void => {
  const message: ChatMessage = {
    id: Date.now().toString(),
    role,
    content,
    timestamp: new Date()
  };
  messages.value.push(message);
  scrollToBottom();
};

const sendMessage = async (): Promise<void> => {
  if (!newMessage.value.trim() || isLoading.value) return;
  
  const userMessage = newMessage.value.trim();
  newMessage.value = '';
  
  // Add user message
  addMessage('user', userMessage);
  
  // Simulate AI response (stubbed for now)
  isLoading.value = true;
  
  setTimeout(() => {
    let response = '';
    
    // Generate contextual responses based on user input
    if (userMessage.toLowerCase().includes('what does') || userMessage.toLowerCase().includes('notebook do')) {
      response = `This notebook appears to be a **${props.notebookTitle || 'Jupyter-style'}** educational notebook. Based on the structure, it likely contains:

- **Interactive code cells** for hands-on learning
- **Markdown explanations** to guide students through concepts
- **Visualizations** to help illustrate key points

The notebook follows a pedagogical approach where students can:
1. Read explanations
2. Run code examples
3. Experiment with modifications
4. See immediate results

Would you like me to analyze any specific sections in more detail?`;
    } else if (userMessage.toLowerCase().includes('japanese') || userMessage.toLowerCase().includes('localize')) {
      response = `I can help you localize this notebook into Japanese! Here's what the process would involve:

## Translation Strategy:
- **Markdown text**: Translate all explanatory content
- **Code comments**: Translate inline documentation
- **Variable names**: Consider using English for compatibility
- **Output text**: Translate user-facing messages

## Key Considerations:
- Maintain technical accuracy
- Preserve code functionality
- Use appropriate Japanese technical terminology
- Consider cultural context for examples

Would you like me to start with a specific section, or would you prefer a complete translation approach?`;
    } else if (userMessage.toLowerCase().includes('explain') || userMessage.toLowerCase().includes('code')) {
      response = `I'd be happy to explain the code in this notebook! Here's what I can help with:

## Code Analysis:
- **Algorithm explanations**: Break down complex logic step-by-step
- **Function purposes**: Explain what each function does
- **Data structures**: Clarify how data is organized and manipulated
- **Best practices**: Point out good coding patterns

## Learning Support:
- Identify key programming concepts
- Suggest related topics to explore
- Provide alternative implementations
- Explain error messages if any occur

Which specific code section would you like me to focus on first?`;
    } else if (userMessage.toLowerCase().includes('improve')) {
      response = `Great question! Here are some ways to enhance this notebook:

## Content Improvements:
- **Add more examples**: Include edge cases and variations
- **Interactive exercises**: Create hands-on challenges
- **Visual aids**: Add diagrams, charts, or animations
- **Real-world applications**: Connect concepts to practical uses

## Technical Enhancements:
- **Error handling**: Add try-catch blocks for robustness
- **Performance optimization**: Suggest more efficient algorithms
- **Code documentation**: Improve comments and docstrings
- **Testing**: Add unit tests for key functions

## Pedagogical Enhancements:
- **Learning objectives**: Clearly state what students will learn
- **Prerequisites**: List required background knowledge
- **Assessment**: Add quiz questions or coding challenges
- **Resources**: Link to additional reading materials

What aspect would you like to focus on improving?`;
    } else if (userMessage.toLowerCase().includes('concepts') || userMessage.toLowerCase().includes('key')) {
      response = `Based on this notebook, here are the key concepts typically covered:

## Core Programming Concepts:
- **Variables and data types**
- **Control structures** (loops, conditionals)
- **Functions and modularity**
- **Data structures** (lists, dictionaries, etc.)

## Problem-Solving Skills:
- **Algorithmic thinking**
- **Debugging techniques**
- **Code optimization**
- **Testing and validation**

## Practical Applications:
- **Data analysis and visualization**
- **Mathematical computations**
- **Interactive programming**
- **Documentation and presentation**

## Learning Outcomes:
Students should be able to:
1. Understand the underlying logic
2. Modify and extend the code
3. Apply concepts to new problems
4. Debug and troubleshoot issues

Would you like me to elaborate on any of these concepts?`;
    } else {
      response = `I'm here to help you with this notebook! I can assist with:

- **Understanding the content** and learning objectives
- **Explaining code** and algorithms step by step
- **Suggesting improvements** and best practices
- **Localizing content** into different languages
- **Identifying key concepts** and learning outcomes

Feel free to ask specific questions about any part of the notebook, or use one of the preset questions below to get started!`;
    }
    
    addMessage('assistant', response);
    isLoading.value = false;
  }, 1000 + Math.random() * 1000); // Simulate variable response time
};

const usePresetQuestion = (question: string): void => {
  newMessage.value = question;
  sendMessage();
};

const clearChat = (): void => {
  messages.value = [];
};

const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Initialize with a welcome message
onMounted(() => {
  addMessage('assistant', `Hello! I'm your AI assistant for this notebook. I can help you understand the content, explain code, suggest improvements, and much more.

Try asking me a question or use one of the preset options below to get started!`);
});
</script>

<template>
  <div class="ai-assistant">
    <!-- Header -->
    <div class="assistant-header">
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-icon icon="mdi-assistant" class="me-2" color="primary" />
          <h3 class="text-h6">AI Assistant</h3>
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
        :class="message.role"
      >
        <div class="message-bubble" :class="message.role">
          <div class="message-role">{{ message.role }}</div>
          <div 
            v-if="message.role === 'assistant'"
            class="message-content markdown-content"
            v-html="renderMarkdown(message.content)"
          />
          <div v-else class="message-content">{{ message.content }}</div>
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
    <div v-if="!hasMessages || messages.length === 1" class="preset-questions">
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
        v-model="newMessage"
        placeholder="Ask me anything about this notebook..."
        variant="outlined"
        density="comfortable"
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
  font-family: 'Courier New', monospace;
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
  margin-bottom: 12px;
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
