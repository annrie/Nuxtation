<script setup lang="ts">
import type { NuxtError } from '#app'
import { clearError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const is404 = computed(() => props.error?.statusCode === 404)

const heading = computed(() => (is404.value ? 'ページが見つかりません' : 'エラーが発生しました'))
const description = computed(() =>
  is404.value
    ? 'お探しのページは存在しないか、移動または削除された可能性があります。'
    : props.error?.message || '予期しないエラーが発生しました。しばらくしてから再度お試しください。',
)

useHead({
  title: computed(() => (is404.value ? '404 - ページが見つかりません' : 'エラー')),
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="error-page">
    <div class="error-content">
      <p class="error-code">
        {{ error?.statusCode || 'Error' }}
      </p>
      <h1 class="error-title">
        {{ heading }}
      </h1>
      <p class="error-message">
        {{ description }}
      </p>
      <button type="button" class="home-button" @click="goHome">
        <Icon name="lucide:arrow-left" class="button-icon" />
        <span>ホームに戻る</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.error-page {
  @apply min-h-[60vh] flex items-center justify-center px-6 py-16;
}

.error-content {
  @apply max-w-lg text-center;
}

.error-code {
  @apply text-7xl font-extrabold leading-none tracking-tight;
  color: var(--color-link-light);
}

.dark .error-code {
  color: var(--color-link-dark);
}

.error-title {
  @apply mt-4 text-2xl font-bold;
  color: #0f172a;
}

.dark .error-title {
  color: #f9fafc;
}

.error-message {
  @apply mt-4 text-base leading-relaxed;
  color: rgba(55, 65, 81, 0.85);
}

.dark .error-message {
  color: rgba(226, 232, 240, 0.8);
}

.home-button {
  @apply inline-flex items-center gap-2 mt-8 rounded-full px-6 py-3 text-base font-semibold text-white no-underline cursor-pointer border-0 outline-none;
  background: linear-gradient(to bottom right, var(--color-button-light), var(--color-button-hover-light));
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.home-button:hover {
  @apply -translate-y-0.5;
}

.home-button:focus-visible {
  @apply outline outline-2 outline-offset-2;
  outline-color: var(--color-link-light);
}

.dark .home-button:focus-visible {
  outline-color: var(--color-link-dark);
}

.button-icon {
  @apply text-xl;
}
</style>
