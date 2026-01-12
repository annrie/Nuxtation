<script setup lang="ts">
import { computed } from 'vue'
import type { BlogPostPreview } from '~~/types'

const { data: pageVisits } = await useFetch(() => `/api/kv`);
const refreshPage = () => {
	window.location.reload();
};

const normalizeEntry = <T extends BlogPostPreview>(entry?: Partial<T> | null): T | null => {
  if (!entry) return null
  const {
    title = 'Untitled',
    description = '',
    path,
    url = '',
    img,
    alt = '',
    tags = [],
    updatedAt,
    publishedAt,
  } = entry
  const normalizedPath = path as string | undefined
  return {
    ...entry,
    title,
    description,
    path: normalizedPath,
    url,
    img,
    alt,
    tags,
    updatedAt,
    publishedAt,
  } as T
}

const normalizeCollection = <T extends BlogPostPreview>(items: Array<Partial<T>> = [], prefix?: string) =>
  items
    .map(item => normalizeEntry<T>(item))
    .filter((item): item is T => Boolean(item && (item.path || item.url)))
    .filter(item => {
      if (!prefix) return true
      const route = item.path || item.url || ''
      return route.startsWith(prefix)
    })

const { data: blogEntries } = useLazyAsyncData('docs-home-blog', async () => {
  const blog = await queryCollection<BlogPostPreview>('blog').all()
  // Payload最適化: リスト表示に不要なbodyフィールドを除外
  return blog.map(item => ({
    title: item.title,
    path: item.path,
    url: item.url,
    tags: item.tags,
    publishedAt: item.publishedAt,
    updatedAt: item.updatedAt,
    description: item.description,
    img: item.img,
    alt: item.alt,
    draft: item.draft,
    featured: item.featured
    // bodyフィールドを除外してpayloadサイズを削減
  }))
})

const blogCollection = computed(() => {
  const normalized = normalizeCollection<BlogPostPreview>(blogEntries.value || [], '/blog/')
  const filtered = import.meta.env.PROD
    ? normalized.filter(article => !article.draft)  // 本番環境: draft記事を除外
    : normalized  // 開発環境: すべて表示
  return sortArticlesByLatestDate(filtered).slice(0, 7)
})

const featuredPost = computed(() => blogCollection.value[0] || null)
const recentArticles = computed(() => blogCollection.value.slice(1))

// SEO設定
const title = 'Nuxtation'
const description = "annrie's Blog Site"

const encoded1 = computed(() => {
  return encodeBase64WithPercent(title)
})

useHead({
  title: `${title}`,
  titleTemplate: '',
})
useSeoMeta({
  title: () => `${title}`,
  description: () => description,
  ogType: () => 'site',
  ogUrl: () => 'https://nuxtation.phantomoon.com/',
  ogImage: () => `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1.value}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${title}`,
  twitterDescription: () => description,
  twitterImage: () => `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1.value}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
})

useJsonld({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'url': 'https://nuxtation.phantomoon.com/',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': 'https://nuxtation.phantomoon.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
})
</script>

<template>
  <section class="home-landing">
    <header class="home-header">
      <HomeHeroTitle />
    </header>

    <HomeSubtitle id="featured-posts">
      注目記事
    </HomeSubtitle>

    <HomeFeaturedArticle
      aria-labelledby="featured-posts"
      :item="featuredPost"
      section="blog"
    />

    <section aria-labelledby="recent-blog" class="home-section">
      <NuxtLink to="/blog" class="section-link">
        <HomeSubtitle id="recent-blog" variant="pill">
          最近のブログ
        </HomeSubtitle>
      </NuxtLink>
      <HomeCardGrid
        :items="recentArticles"
        section="blog"
        variant="blog"
      />
    </section>
    <section aria-labelledby="vercel-kv" class="home-section mt-16">
      <div class="flex flex-col items-center gap-6">
        <button
          @click="refreshPage()"
          class="px-6 py-3 font-bold !text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
        >
          Refresh page
        </button>
        <div class="text-5xl font-bold text-gray-900 dark:text-gray-100">
          {{ pageVisits?.pageVisits }}
        </div>
      </div>
    </section>
    <LazyScrollToTop />
  </section>
</template>

<style scoped>
@reference "tailwindcss";

.home-landing {
  @apply grid gap-8 pt-4 pb-20 max-lg:pt-0;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0) 0%, rgba(241, 245, 249, 0.3) 100%);
}

.dark .home-landing {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.4) 100%);
}

.home-header {
  @apply flex justify-center mt-8 max-lg:mt-0;
}

.home-section {
  @apply max-w-[1080px] w-full mx-auto px-4 md:px-0;
}

.section-link {
  @apply no-underline inline-flex w-full justify-center;
}
</style>
