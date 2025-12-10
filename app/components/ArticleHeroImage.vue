<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  format?: string
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  modifiers?: Record<string, any>
  imgClass?: string
  overlayClass?: string
  absolute?: boolean
  aspectRatio?: string | number  // '16/9', '4/3', '1/1', 2.35, etc.
  noOverlay?: boolean   // オーバーレイを無効化
  isDark?: boolean      // ダークモード状態（親から渡される）
}>(), {
  isDark: false,
})

// アスペクト比をCSSで使用可能な形式に変換
const aspectRatioStyle = computed(() => {
  if (!props.aspectRatio) return undefined

  // 数値の場合はそのまま使用
  if (typeof props.aspectRatio === 'number') {
    return props.aspectRatio.toString()
  }

  // 文字列の場合（'16/9'など）もそのまま使用
  return props.aspectRatio
})
</script>

<template>
  <div
    v-if="src"
    class="article-hero-wrapper"
    :class="{ 'is-absolute': absolute }"
    :style="aspectRatioStyle ? { aspectRatio: aspectRatioStyle } : undefined"
  >
    <NuxtPicture
      :src="src"
      :alt="alt"
      :format="format || 'avif,webp'"
      :loading="loading || 'eager'"
      :fetchpriority="fetchpriority || 'high'"
      :modifiers="modifiers"
      :img-attrs="{ class: imgClass || 'article-hero-image' }"
    />
    <div
      v-if="!noOverlay"
      :class="overlayClass || 'article-hero-overlay'"
    />
  </div>
</template>

<style>
.article-hero-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0;
}

.article-hero-wrapper.is-absolute {
  position: absolute;
  top: 0;
  left: 0;
}

.article-hero-wrapper picture {
  display: block;
  width: 100%;
  height: 100%;
}

.article-hero-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.article-hero-wrapper.is-absolute picture {
  position: absolute;
  top: 0;
  left: 0;
}

.article-hero-wrapper.is-absolute img {
  position: absolute;
  top: 0;
  left: 0;
}

.article-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
  pointer-events: none;
  z-index: 2;
}

.dark .article-hero-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
}

.article-hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
