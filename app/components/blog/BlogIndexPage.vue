<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<{ pageSize?: number }>(), {
  pageSize: 6,
})

const route = useRoute()
const router = useRouter()

const currentPage = computed(() => {
  const value = route.query.page
  const parsed = Number(Array.isArray(value) ? value[0] : value || 1)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1
})

const activeTag = computed(() => {
  const tag = route.query.tag
  return Array.isArray(tag) ? tag[0] : tag || ''
})

const { data: articlesData } = useLazyAsyncData('docs-blog-articles', async () => {
  const articles = await queryCollection('blog').all()
  // Payload最適化: リスト表示に不要なbodyフィールドを除外
  return articles.map(article => ({
    title: article.title,
    path: article.path,
    tags: article.tags,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    description: article.description,
    img: article.img,
    draft: article.draft,
    featured: article.featured
    // bodyフィールドを除外してpayloadサイズを削減
  }))
})

const articles = computed(() => {
  const isDev = import.meta.dev
  const filtered = (articlesData.value || []).filter(article => {
    if (!article.path || article.path === '/blog') return false
    return isDev || !article.draft  // 開発環境: すべて表示、本番環境: draft除外
  })
  return sortArticlesByLatestDate(filtered)
})

const tagOptions = computed(() => {
  const set = new Set<string>()
  for (const article of articles.value) {
    for (const tag of article.tags || []) {
      if (typeof tag === 'string') {
        set.add(tag)
      }
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredArticles = computed(() => {
  if (!activeTag.value) return articles.value
  return articles.value.filter(article => (article.tags || []).includes(activeTag.value))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredArticles.value.length / props.pageSize)))

watch([currentPage, totalPages], ([page, pages]) => {
  if (page > pages) {
    router.replace({ path: route.path, query: { ...route.query, page: String(pages) } })
  }
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  return filteredArticles.value.slice(start, start + props.pageSize)
})

const paginatedCards = computed(() =>
  paginatedArticles.value.map(article => ({
    ...article,
    path: article.path as string,
  }))
)

watch(paginatedArticles, (list) => {
  if (!list.length && currentPage.value > 1) {
    router.replace({ path: route.path, query: { ...route.query, page: '1' } })
  }
})

const navigationItems = computed(() => {
  return articles.value.map(article => ({
    title: article.title || article.path,
    path: article.path as string,
  }))
})

const selectTag = (tag: string) => {
  router.push({ path: route.path, query: { ...route.query, tag, page: '1' } })
}

const clearTag = () => {
  const query = { ...route.query }
  delete query.tag
  query.page = '1'
  router.push({ path: route.path, query })
}

const goToPage = (page: number) => {
  router.push({ path: route.path, query: { ...route.query, page: String(page) } })
}

// SEO設定
const title = 'All Blog Posts'
const description = "Here's a list of all my blog posts"

const encoded1 = computed(() => {
  return encodeBase64WithPercent(title)
})

useSeoMeta({
  title: () => `All Blog Posts - Page ${currentPage.value}`,
  description: () => description,
  ogType: () => 'article',
  ogUrl: () => 'https://nuxtation.phantomoon.com/blog/',
  ogDescription: () => description,
  ogImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1.value}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
  twitterCard: 'summary_large_image',
  twitterTitle: () => `All Blog Posts - Page ${currentPage.value}`,
  twitterDescription: () => description,
  twitterImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1.value}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
})

useJsonld(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
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
        }
      ]
    },
    {
      '@type': 'CollectionPage',
      'name': 'Blog Posts',
      'description': "Here's a list of all my blog posts",
      'url': 'https://nuxtation.phantomoon.com/blog/'
    }
  ]
}))
</script>

<template>
  <div class="blog-index">
    <aside class="sidebar sidebar--left ml-5">
      <h2 class="sidebar-title">記事ナビゲーション</h2>
      <nav v-if="navigationItems.length" class="sidebar-nav">
        <NuxtLink v-for="item in navigationItems" :key="item.path" :to="item.path" :prefetch="false" class="sidebar-link">
          <Icon name="carbon:document" class="inline-block mr-2" />{{ item.title }}
        </NuxtLink>
      </nav>
      <p v-else class="placeholder">記事がありません。</p>
    </aside>

    <main class="main">
      <Breadcrumb
        class="ml-4"
        :items="[
          { label: 'ホーム', to: '/', icon: 'line-md:home-md-twotone', srLabel: 'ホーム' },
          { label: `ブログ - ${currentPage}ページ目`, current: true },
        ]"
      />

      <header class="main-header">
        <h1 class="main-title">ブログ({{ currentPage }})</h1>
        <p class="main-lead">最新の記事をチェックするか、タグとキーワードで絞り込んでください。</p>
      </header>

      <section class="filter-panel">
        <div class="tag-list">
          <button v-if="activeTag" type="button" class="tag tag--clear" @click="clearTag">すべて表示</button>
          <NuxtLink
            v-for="tag in tagOptions"
            :key="tag"
            :to="`/blog/tags/${tag}`"
            class="tag"
            :class="{ 'tag--active': activeTag === tag }"
          >
            #{{ tag }}
          </NuxtLink>
        </div>
      </section>

      <section class="article-grid">
        <HomeCardGrid :items="paginatedCards" section="blog" variant="blog" />
        <p v-if="!paginatedArticles.length" class="placeholder">条件に合致する記事がありませんでした。</p>
      </section>

      <nav v-if="totalPages > 1" class="pagination" aria-label="ブログ記事のページング">
        <button type="button" class="pagination-button" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
          前へ
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          type="button"
          class="pagination-button"
          :class="{ 'is-active': currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          type="button"
          class="pagination-button"
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
        >
          次へ
        </button>
      </nav>
    </main>

    <aside class="sidebar sidebar--right">
      <h2 class="sidebar-title">タグ一覧</h2>
      <ul class="tag-column">
        <li v-for="tag in tagOptions" :key="tag">
          <NuxtLink
            :to="`/blog/tags/${tag}`"
            class="tag"
            :class="{ 'tag--active': activeTag === tag }"
          >
            #{{ tag }}
          </NuxtLink>
        </li>
      </ul>
    </aside>
    <LazyScrollToTop />
  </div>
</template>

<style scoped>
.blog-index {
  display: grid;
  gap: 2rem;
  grid-template-columns: 260px minmax(0, 1fr) 220px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  position: sticky;
  top: 80px;
  align-self: flex-start;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(16, 185, 129, 0.3);
  margin-bottom: 0.5rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-link {
  display: block;
  padding: 0.4rem 0.6rem;
  border-radius: 0.5rem;
  color: rgba(15, 23, 42, 0.78);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.sidebar-link:hover {
  background-color: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.breadcrumb {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: rgba(15, 23, 42, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.breadcrumb-link :deep(svg) {
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .breadcrumb-link {
    font-size: 1.2rem;
  }

  .breadcrumb-link :deep(svg) {
    font-size: 1.8rem;
  }
}

.breadcrumb-link:hover {
  color: var(--color-link-light);
}

.breadcrumb-separator {
  color: rgba(148, 163, 184, 0.6);
  user-select: none;
}

.breadcrumb-current {
  color: rgba(15, 23, 42, 0.9);
  font-weight: 600;
  font-size: 1rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .breadcrumb-current {
    max-width: none;
    font-size: 1.2rem;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.main-header {
  text-align: center;
  margin-top: -3rem;
}

@media (min-width: 768px) {
  .main-header {
    margin-top: 0;
  }
}

.main-title {
  font-size: clamp(2.2rem, 3vw, 2.8rem);
  font-weight: 700;
  color: #0f172a;
}

.main-lead {
  color: rgba(55, 65, 81, 0.92);
  font-size: 1.05rem;
}

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.tag-column {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(16, 185, 129, 0.16);
  color: #047857;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.tag:hover {
  transform: translateY(-1px);
  background: rgba(16, 185, 129, 0.22);
}

.tag--active {
  background: linear-gradient(120deg, #059669, var(--color-link-light));
  color: #fff;
  box-shadow: 0 12px 24px rgba(16, 185, 129, 0.25);
}

.tag--clear {
  background: rgba(239, 68, 68, 0.18);
  color: #dc2626;
}

.article-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.placeholder {
  text-align: center;
  color: rgba(148, 163, 184, 0.9);
}

.pagination {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.pagination-button {
  border: none;
  background: rgba(148, 163, 184, 0.18);
  padding: 0.4rem 0.85rem;
  border-radius: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
  background: rgba(16, 185, 129, 0.18);
  color: #047857;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-button.is-active {
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: #fff;
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.25);
}

@media (max-width: 1180px) {
  .blog-index {
    grid-template-columns: minmax(0, 1fr);
    padding: 0 1rem;
  }

  .sidebar--left,
  .sidebar--right {
    display: none;
  }
}

.dark .breadcrumb-link {
  color: rgba(226, 232, 240, 0.7);
}

.dark .breadcrumb-link:hover {
  color: var(--color-link-dark);
}

.dark .breadcrumb-separator {
  color: rgba(148, 163, 184, 0.5);
}

.dark .breadcrumb-current {
  color: rgba(226, 232, 240, 0.95);
}

.dark .sidebar-title {
  color: #f8fafc;
  border-bottom-color: rgba(34, 197, 94, 0.4);
}

.dark .sidebar-link {
  color: rgba(226, 232, 240, 0.8);
}

.dark .sidebar-link:hover {
  background-color: rgba(34, 197, 94, 0.18);
  color: var(--color-link-dark);
}

.dark .main-title {
  color: #f9fafc;
}

.dark .main-lead {
  color: rgba(226, 232, 240, 0.85);
}

.dark .tag {
  background: var(--color-tag-bg-dark);
  color: #ffffff;
}

.dark .tag:hover {
  background: rgba(59, 130, 246, 0.35);
}

.dark .tag--active {
  background: linear-gradient(120deg, #60a5fa, var(--color-link-dark));
  color: #0f172a;
}

.dark .tag--clear {
  background: rgba(248, 113, 113, 0.2);
  color: rgba(248, 250, 252, 0.9);
}

.dark .placeholder {
  color: rgba(148, 163, 184, 0.75);
}

.dark .pagination-button {
  background: rgba(59, 130, 246, 0.25);
  color: rgba(226, 232, 240, 0.85);
}

.dark .pagination-button:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.35);
  color: rgba(240, 253, 244, 0.95);
}

.dark .pagination-button.is-active {
  background: linear-gradient(120deg, var(--color-sf-active), var(--color-link-light));
  color: rgba(255, 255, 255, 0.98);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
}
</style>
