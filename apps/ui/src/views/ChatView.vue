<script setup lang="ts">
import { ref } from 'vue';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const messages = ref<Message[]>([]);
const input = ref('');
</script>

<template>
  <div class="chat">
    <header class="chat__header">
      <span class="chat__title">Alfons</span>
    </header>

    <div class="chat__messages">
      <div v-if="messages.length === 0" class="chat__empty">
        Schreib eine Nachricht um das Gespräch zu starten.
      </div>

      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="chat__message"
        :class="msg.role === 'user' ? 'chat__message--user' : 'chat__message--assistant'"
      >
        <span class="chat__bubble">{{ msg.text }}</span>
      </div>
    </div>

    <form class="chat__input-bar" @submit.prevent>
      <textarea
        v-model="input"
        class="chat__input"
        placeholder="Nachricht schreiben…"
        rows="1"
      />
      <button class="chat__send" type="submit" :disabled="!input.trim()">
        Senden
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 720px;
  margin: 0 auto;

  &__header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #fff;
  }

  &__title {
    font-weight: 600;
    font-size: 1.1rem;
  }

  &__messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: #f9fafb;
  }

  &__empty {
    text-align: center;
    color: #9ca3af;
    margin: auto;
  }

  &__message {
    display: flex;

    &--user {
      justify-content: flex-end;

      .chat__bubble {
        background: #2563eb;
        color: #fff;
      }
    }

    &--assistant {
      justify-content: flex-start;

      .chat__bubble {
        background: #fff;
        color: #111827;
        border: 1px solid #e5e7eb;
      }
    }
  }

  &__bubble {
    max-width: 75%;
    padding: 0.6rem 1rem;
    border-radius: 1rem;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__input-bar {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    background: #fff;
  }

  &__input {
    flex: 1;
    resize: none;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.6rem 0.875rem;
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.5;
    outline: none;

    &:focus {
      border-color: #2563eb;
    }
  }

  &__send {
    padding: 0.6rem 1.25rem;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    font-size: 0.95rem;
    cursor: pointer;
    white-space: nowrap;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background: #1d4ed8;
    }
  }
}
</style>
