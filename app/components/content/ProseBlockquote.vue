<script lang="ts">
import type { TwitterWindow } from '~/types'

declare const window: TwitterWindow
</script>

<script setup lang="ts">
const attrs = useAttrs()
const isTwitterEmbed = computed(() => {
  const classes = attrs.class || ''
  return typeof classes === 'string' && classes.includes('twitter-tweet')
});

// Twitterスクリプトをロード（クライアント側のみ）
onMounted(() => {
  if (isTwitterEmbed.value) {
    // スクリプトがまだロードされていない場合のみ追加
    if (!document.querySelector('script[src*="platform.twitter.com"]')) {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      document.head.appendChild(script)

      script.onload = () => {
        if (window.twttr?.widgets) {
          window.twttr.widgets.load()
        }
      }
    }
    else if (window.twttr?.widgets) {
      // スクリプトがすでにロード済みの場合
      window.twttr.widgets.load()
    }
  }
})
</script>

<template>
  <div class="blockquote-wrapper">
    <ClientOnly v-if="isTwitterEmbed">
      <blockquote v-bind="$attrs">
        <slot />
      </blockquote>
      <template #fallback>
        <blockquote v-bind="$attrs">
          <slot />
        </blockquote>
      </template>
    </ClientOnly>
    <blockquote v-else v-bind="$attrs">
      <slot />
    </blockquote>
  </div>
</template>

<style scoped>
.blockquote-wrapper {
  width: 100%;
}
</style>

<style scoped>
@reference "tailwindcss";

blockquote {
  @apply relative my-4 py-4 px-12 pl-4 rounded-sm border-solid border-l-4 border-cyan-400/40 dark:border-l-4 dark:border-gray-700/40 text-left;
  font-family: 'Hiragino Sans', 'メイリオ', Meiryo, sans-serif;
}

blockquote cite::before {
  content: '—';
}

blockquote::before,
blockquote::after {
  @apply absolute text-gray-400 text-[6.25rem] leading-none;
}

blockquote::before {
  @apply -top-[0.3rem] left-0;
}

blockquote::after {
  @apply -bottom-[3.7rem] right-0;
}
</style>
