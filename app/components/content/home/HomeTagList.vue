<script setup lang="ts">
import type { Sections } from '~~/types'

withDefaults(
  defineProps<{
    tags?: string[]
    section: Sections
    variant?: 'blog'
  }>(),
  {
    tags: () => [],
    variant: 'blog',
  },
)
</script>

<template>
  <div v-if="tags?.length" class="tag-container" :class="[`variant-${variant}`]">
    <ul class="tag-list">
      <li v-for="tag in tags" :key="tag">
        <BaseTag
          variant="blog"
          :href="`/${section}/tags/${tag}`"
          :label="tag"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tag-container {
  @apply mt-4;
}

.button-wrapper {
  @apply flex justify-center gap-2;
}

.button-icon {
  @apply text-base text-white;
}

.tag-list {
  @apply flex flex-wrap gap-2 list-none p-0;
}
</style>
