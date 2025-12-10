<script setup lang="ts">
import type { ContentPreview, Sections } from '~~/types'

defineProps<{
  items?: ContentPreview[]
  section: Sections
  variant?: 'blog' | 'biblio'
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
      :index="index"
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
