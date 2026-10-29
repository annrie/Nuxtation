<script setup lang="ts">
import type { ContentPreview, Sections } from '~~/types'

defineProps<{
  items?: ContentPreview[]
  section: Sections
  variant?: 'blog'
  // 先頭のカードが最初の画面の主役（LCP）になる一覧だけ true にする。
  // トップでは注目記事が主役なので付けない（付けると下の方のカードの画像が注目記事の画像と帯域を取り合う）
  priority?: boolean
}>()
</script>

<template>
  <div v-if="items?.length" class="card-grid">
    <HomeCard
      v-for="(item, index) in items"
      :key="item.path || item.url || item.title"
      :item="item"
      :section="section"
      :variant="variant"
      :priority="priority && index === 0"
    />
  </div>
  <p v-else class="empty-placeholder">
    更新されたコンテンツがまだありません。
  </p>
</template>

<style scoped>
@reference "tailwindcss";

.card-grid {
  @apply grid gap-7 mt-10 max-[48rem]:gap-6 max-[48rem]:mt-8 min-[48rem]:grid-cols-2 min-[48rem]:auto-rows-fr min-[64rem]:grid-cols-3;
}

.empty-placeholder {
  @apply mt-6 text-center;
  color: #94a3b8;
}

.dark .empty-placeholder {
  color: #64748b;
}
</style>
