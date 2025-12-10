<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useAsyncData } from '#imports'
import { sortArticlesByLatestDate } from '~/composables/useBlogDate'

const route = useRoute()
const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value[0] : value || ''
})

const { data: articlesData } = useLazyAsyncData(`articles-${slug.value}`, () =>
  queryCollection('blog')
    .all()
)

const articles = computed(() => {
  if (!articlesData.value) return []
  const isDev = import.meta.dev
  const filtered = articlesData.value.filter(article => {
    if (!isDev && article.draft) return false  // 本番環境: draft記事を除外
    return (article.tags || []).includes(slug.value)
  })
  return sortArticlesByLatestDate(filtered)
})

const tagOptions = computed(() => {
  const isDev = import.meta.dev
  const set = new Set<string>()
  for (const article of articlesData.value || []) {
    if (!isDev && article.draft) continue  // 本番環境: draft記事を除外
    for (const tag of article.tags || []) {
      if (typeof tag === 'string') {
        set.add(tag)
      }
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const title = computed(() => `Blog Posts on ${slug.value.toUpperCase()}`)
const description = computed(() => `Here's a list of all my blog posts with the ${slug.value.toUpperCase()} tag`)

const encoded1 = computed(() => {
  if (!title.value) return ''
  return encodeBase64WithPercent(title.value)
})

useHead({
  title: title.value,
  meta: [
    { name: 'description', content: description.value }
  ],
})

useSeoMeta({
  ogType: () => 'article',
  ogUrl: () => `https://nuxtation.phantomoon.com${route.path}`,
  ogTitle: () => title.value,
  ogDescription: () => description.value,
  ogImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1.value}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => title.value,
  twitterDescription: () => description.value,
  twitterImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1.value}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
})

useJsonld(() => [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'ホーム',
        'item': 'https://nuxtation.phantomoon.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'ブログ',
        'item': 'https://nuxtation.phantomoon.com/blog/'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': slug.value || '',
        'item': `https://nuxtation.phantomoon.com${route.path}`
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': title.value || '',
    'description': description.value || '',
    'url': `https://nuxtation.phantomoon.com${route.path}`
  }
])
</script>

<template>
  <div class="tag-page">
    <Breadcrumb
      variant="simple"
      :items="[
        { label: 'ホーム', to: '/', icon: 'line-md:home-md-twotone', srLabel: 'ホーム' },
        { label: 'ブログ', to: '/blog' },
        { label: slug, current: true },
      ]"
    />

    <header class="header">
      <div class="header-content">
        <h1 class="title">
          <span>All</span>
          <span>Articles</span>
          <span>with</span>
          <span class="tag-name">{{ slug }}</span>
        </h1>
        <p class="subtitle">Here's a list of all my great articles</p>
      </div>
    </header>

    <section class="content-section">
      <div class="tag-filter">
        <h2 class="filter-title">タグで絞り込む</h2>
        <div class="tag-list">
          <NuxtLink
            v-for="tag in tagOptions"
            :key="tag"
            :to="`/blog/tags/${tag}`"
            class="tag"
            :class="{ 'tag--active': slug === tag }"
            :aria-label="`${tag}タグの記事を表示`"
            :aria-current="slug === tag ? 'page' : undefined"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
        <div class="back-button-wrapper">
          <NuxtLink to="/blog" class="back-button" aria-label="ブログ一覧に戻る">
            <Icon name="lucide:arrow-left" class="button-icon" />
            <span>一覧に戻る</span>
          </NuxtLink>
        </div>
      </div>

      <div v-if="articles.length" class="article-list">
        <BlogCardHorizontal
          v-for="article in articles"
          :key="article.path"
          :item="article"
        />
      </div>
      <div v-else class="no-results">
        <p>このタグに該当する記事が見つかりませんでした。</p>
      </div>
    </section>
    <LazyScrollToTop />
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.tag-page {
  @apply max-w-screen-xl mx-auto px-6 py-8;
}

.breadcrumb {
  @apply mt-6 mb-8;
}

.breadcrumb ol {
  @apply flex items-center gap-2 list-none p-0 m-0;
}

.breadcrumb li {
  @apply text-base flex items-center;
}

.breadcrumb a {
  @apply no-underline transition-colors duration-200 flex items-center text-base outline-none rounded md:text-xl;
  color: rgba(15, 23, 42, 0.7);
}

.breadcrumb a:focus {
  @apply outline outline-2 outline-offset-2;
  outline-color: var(--color-link-light);
}

.breadcrumb a :deep(svg) {
  @apply text-2xl md:text-[1.8rem];
}

.breadcrumb a:hover {
  color: var(--color-link-light);
}

.dark .breadcrumb a {
  color: rgba(226, 232, 240, 0.7);
}

.dark .breadcrumb a:focus {
  outline-color: var(--color-link-dark);
}

.dark .breadcrumb a:hover {
  color: var(--color-link-dark);
}

.breadcrumb .current-tag {
  @apply font-semibold text-base max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap inline-block align-baseline md:max-w-none md:text-xl;
  color: rgba(15, 23, 42, 0.9);
}

.dark .breadcrumb .current-tag {
  color: rgba(226, 232, 240, 0.95);
}

.separator {
  color: rgba(148, 163, 184, 0.6);
}

.visually-hidden {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}

.header {
  @apply text-center py-8 pb-12;
}

.header-content {
  @apply max-w-3xl mx-auto;
}

.title {
  @apply font-extrabold leading-tight mb-4;
  font-size: clamp(2rem, 5vw, 3rem);
  color: #0f172a;
}

.dark .title {
  color: #f9fafc;
}

.title span {
  @apply inline;
}

.title span:not(:last-child) {
  @apply mr-2;
}

.tag-name {
  @apply uppercase underline;
  text-decoration-style: wavy;
  text-decoration-color: var(--color-link-light);
  text-underline-offset: 0.3rem;
}

.dark .tag-name {
  text-decoration-color: var(--color-link-dark);
}

.subtitle {
  @apply text-lg font-medium;
  color: rgba(55, 65, 81, 0.85);
}

.dark .subtitle {
  color: rgba(226, 232, 240, 0.8);
}

.content-section {
  @apply mt-12 max-w-screen-lg mx-auto;
}

.tag-filter {
  @apply mb-12 text-center;
}

.filter-title {
  @apply text-xl font-semibold mb-5;
  color: #0f172a;
}

.dark .filter-title {
  color: #f9fafc;
}

.tag-list {
  @apply flex flex-wrap gap-3 justify-center md:justify-start;
}

.tag {
  @apply inline-flex items-center min-h-[44px] rounded-full font-semibold no-underline outline-none;
  padding: 0.625rem 1rem;
  background: rgba(16, 185, 129, 0.16);
  color: #047857;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
  touch-action: manipulation;
}

.tag:focus {
  @apply outline outline-2 outline-offset-2 -translate-y-px;
  outline-color: var(--color-link-light);
}

.tag:hover {
  @apply -translate-y-px;
  background: rgba(16, 185, 129, 0.22);
}

.tag--active {
  background: linear-gradient(120deg, var(--color-mystery-active), #f97316);
  color: #fff;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
}

.dark .tag {
  background: var(--color-tag-bg-dark);
  color: #ffffff;
}

.dark .tag:focus {
  outline-color: var(--color-link-dark);
}

.dark .tag:hover {
  background: rgba(59, 130, 246, 0.35);
}

.dark .tag--active {
  background: linear-gradient(120deg, #fb923c, #f97316);
  color: #0f172a;
  box-shadow: 0 8px 20px rgba(251, 146, 60, 0.3);
}

.article-list {
  @apply flex flex-col gap-6 mb-12;
}

.no-results {
  @apply text-center;
  padding: 3rem 1rem;
  color: rgba(148, 163, 184, 0.9);
  font-size: 1.1rem;
}

.dark .no-results {
  color: rgba(148, 163, 184, 0.75);
}

.back-button-wrapper {
  @apply flex justify-center mt-8;
}

.back-button {
  @apply inline-flex items-center gap-2 rounded-full text-lg font-semibold no-underline border-0 cursor-pointer outline-none;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to bottom right, var(--color-button-light), var(--color-button-hover-light));
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
}

.back-button:focus {
  @apply outline outline-[3px] outline-offset-2;
  outline-color: var(--color-link-light);
  box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2);
}

.dark .back-button {
  background: linear-gradient(to bottom right, var(--color-button-light), var(--color-button-hover-light));
}

.dark .back-button:focus {
  outline-color: var(--color-link-dark);
}

.back-button:hover {
  @apply -translate-y-0.5;
  box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2);
  background: linear-gradient(to bottom right, var(--color-button-hover-light), #15803d);
}

.button-icon {
  @apply text-xl text-white;
}

.title {
  @apply max-sm:text-[1.75rem];
}

.title span {
  @apply max-sm:mr-0;
}

.title span:not(:last-child) {
  @apply max-sm:block max-sm:leading-[0.75];
}

.title span:last-child {
  @apply max-sm:block max-sm:leading-[1.75] max-sm:mt-2;
}
</style>
