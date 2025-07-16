<script lang="ts">
import type { TwitterWindow } from '~/types'

declare const window: TwitterWindow
</script>

<script setup lang="ts">
useHead({
  script: [
    {
      type: 'text/javascript',
      async: true,
      src: 'https://platform.twitter.com/widgets.js',
    },
  ],
})

onMounted(() => {
  if (window.twttr) {
    window.twttr.widgets.load()
  }
  else {
    window.addEventListener('load', () => {
      window.twttr.widgets.load()
    })
  }
})
</script>

<template>
  <blockquote>
    <slot />
  </blockquote>
</template>

<style lang="scss" scoped>
blockquote {
  @apply border-solid border-l-3 border-cyan-400/40 dark:(border-l-3 border-gray-700/40) text-left;
  position: relative;
  margin: 1rem 0 0;
  padding: 1rem 3rem 1rem 1rem;
  border-radius: 2px;
  font-family: 'Hiragino Sans', 'メイリオ', Meiryo, sans-serif;

  cite:before {
    content: '—';
  }
}

blockquote::before,
blockquote::after {
  position: absolute;
  color: #aaa;
  font-size: 6.25rem;
  line-height: 1;
}

blockquote::before {
  top: -0.3rem;
  left: 0;
}

blockquote::after {
  bottom: -3.7rem;
  right: 0;
}
</style>
