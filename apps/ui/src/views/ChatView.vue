<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {
  chatControllerGetHistory,
  chatControllerSendMessage,
} from '@bot-friends-jow/api-client';
import type { ChatHistoryDto } from '@bot-friends-jow/api-client';

const userId = ref('');
const messages = ref<ChatHistoryDto[]>([]);
const input = ref('');
const loading = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  const stored = localStorage.getItem('userId');
  if (stored) {
    userId.value = stored;
  } else {
    const newId = crypto.randomUUID();
    localStorage.setItem('userId', newId);
    userId.value = newId;
  }

  const res = await chatControllerGetHistory(userId.value);
  if (res.status === 200) {
    messages.value = res.data;
    await scrollToBottom();
  }
});

async function scrollToBottom() {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || loading.value) return;

  messages.value.push({
    role: 'user',
    message: text,
    timestamp: new Date().toISOString(),
  });
  input.value = '';
  loading.value = true;
  await scrollToBottom();

  try {
    const res = await chatControllerSendMessage({
      message: text,
      userId: userId.value,
    });
    if (res.status === 200) {
      messages.value.push({
        role: 'assistant',
        message: res.data.message,
        timestamp: new Date().toISOString(),
      });
    } else if (res.status === 422) {
      messages.value.push({
        role: 'assistant',
        message: 'Dateneingabe fehlehaft.',
        timestamp: new Date().toISOString(),
      })
    } else {
      messages.value.push({
        role: 'assistant',
        message: 'Fehler beim verarbeiten der Nachricht.',
        timestamp: new Date().toISOString(),
      });
    }
  } catch {
    messages.value.push({
      role: 'assistant',
      message: 'Fehler beim verarbeiten der Nachricht.',
      timestamp: new Date().toISOString(),
    });
  } finally {
    loading.value = false;
    await scrollToBottom();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
</script>

<template>
  <div class="chat-wrapper">
    <div class="chat">
      <header class="chat__header">
        <span class="chat__header-icon">🤖</span>
        <span class="chat__title">BotFriends Chat</span>
      </header>

      <div
        ref="messagesContainer"
        class="chat__messages"
      >
        <div
          v-if="messages.length === 0"
          class="chat__empty"
        >
          Schreib eine Nachricht um das Gespräch zu starten.
        </div>

        <div
          v-for="(msg, i) in messages"
          :key="i"
          class="chat__message"
          :class="
            msg.role === 'user'
              ? 'chat__message--user'
              : 'chat__message--assistant'
          "
        >
          <div
            v-if="msg.role === 'user'"
            class="chat__avatar chat__avatar--user"
          >
            👤
          </div>
          <div
            v-else
            class="chat__avatar chat__avatar--bot"
          >
            🤖
          </div>
          <span class="chat__bubble">{{ msg.message }}</span>
        </div>

        <div
          v-if="loading"
          class="chat__message chat__message--assistant"
        >
          <div class="chat__avatar chat__avatar--bot">
            🤖
          </div>
          <span class="chat__bubble chat__bubble--loading">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </span>
        </div>
      </div>

      <form
        class="chat__input-bar"
        @submit.prevent="sendMessage"
      >
        <textarea
          v-model="input"
          class="chat__input"
          placeholder="Nachricht schreiben…"
          rows="1"
          @keydown="handleKeydown"
        />
        <button
          class="chat__send"
          type="submit"
          :disabled="loading || !input.trim()"
        >
          Senden
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped src="./ChatView.scss" />
