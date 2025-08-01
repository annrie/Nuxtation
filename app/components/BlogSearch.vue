<script setup lang="ts">
import type { BlogPost } from '~/types'

const props = defineProps<{
  articles: BlogPost[]
  showImages?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:filteredArticles', articles: BlogPost[]): void
}>()

const searchQuery = ref('')

const { data: titleResults } = await useAsyncData('title-search',
  () => queryCollection('blog')
    .where('title', 'LIKE', `%${searchQuery.value}%`)
    .order('date', 'DESC')
    .all(),
  {
    watch: [searchQuery],
    immediate: false,
  }
)

const { data: tagResults } = await useAsyncData('tag-search',
  () => queryCollection('blog')
    .where('tags', 'LIKE', `%${searchQuery.value}%`)
    .order('date', 'DESC')
    .all(),
  {
    watch: [searchQuery],
    immediate: false,
  }
)

const filteredArticles = computed(() => {
  if (!searchQuery.value) return props.articles
  const titleMatches = titleResults.value || []
  const tagMatches = tagResults.value || []
  const paths = new Set<string>()
  const results: BlogPost[] = []

  titleMatches.forEach((article: BlogPost) => {
    if (article.path) {
      paths.add(article.path)
      results.push(article)
    }
  })

  tagMatches.forEach((article: BlogPost) => {
    if (article.path && !paths.has(article.path)) {
      results.push(article)
    }
  })

  return results
})

watch(filteredArticles, (newValue) => {
  emit('update:filteredArticles', newValue)
}, { immediate: true })
</script>

<template>
  <div class="max-w-2xl mx-auto mb-8">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search articles..."
        class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 indent-2rem"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <i class="i-wpf-search"></i>
      </div>
    </div>
  </div>
</template>
