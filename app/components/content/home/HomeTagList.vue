<script setup lang="ts">
import type { Sections } from '~~/types'

const props = withDefaults(
  defineProps<{
    tags?: string[]
    section: Sections
    variant?: 'blog' | 'biblio'
  }>(),
  {
    tags: () => [],
    variant: 'blog',
  },
);

// ジャンル判定: tags の最初の要素が有効なジャンルかチェック
const validGenres = ['sf', 'adv', 'mys', 'horror', 'jedi', 'short']
const genreTag = computed(() => {
  if (props.variant === 'biblio' && props.tags && props.tags.length > 0) {
    const firstTag = props.tags[0].toLowerCase()
    return validGenres.includes(firstTag) ? firstTag : 'sf'
  }
  return 'sf'
});
</script>

<template>
  <div v-if="tags?.length" class="tag-container" :class="[`variant-${variant}`]">
    <template v-if="variant === 'biblio'">
      <div class="button-wrapper">
        <BaseButton
          v-for="tag in tags"
          :key="tag"
          variant="genre"
          :genre="genreTag"
          :href="`/${section}/tags/${tag}`"
          :aria-label="`${tag}タグの書影付き作品一覧へ移動`"
        >
          <span>書影付き作品一覧はこちら</span>
          <Icon name="lucide:arrow-right" class="button-icon" />
        </BaseButton>
      </div>
    </template>
    <ul v-else class="tag-list">
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
