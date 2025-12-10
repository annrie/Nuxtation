<script setup lang="ts">
/**
 * Nuxt ContentのMarkdown画像コンポーネント
 * すべてのMarkdown画像に自動的にloading="lazy"を適用
 */
const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: undefined
  },
  height: {
    type: [String, Number],
    default: undefined
  }
})

</script>

<template>
  <NuxtPicture
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    format="avif,webp"
    loading="lazy"
    class="max-w-full h-auto"
  />
</template>
