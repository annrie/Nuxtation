<script setup lang="ts">
import { computed, provide } from 'vue'
import { useRoute } from 'vue-router'

// ダークモード状態を1回だけ取得してprovide
const isDark = useDark()
provide('isDark', isDark)

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// ベースURL定義
const baseUrl = 'https://nuxtation.phantomoon.com';

// 記事データを取得
const { data: article } = await useArticle('blog', slug.value)

// 記事の目次を取得
const headings = computed(() => {
  if (!article.value?.body)
    return []
  // Nuxt Contentの記事本文から見出しを抽出
  return article.value.body.toc?.links || []
});

// モバイル版TOCの開閉状態
const isMobileTocOpen = ref(false)

// モバイル版TOCのref
const mobileTocRef = ref<HTMLElement | null>(null)

// スクロール時のオフセット計算（モバイル版TOCの高さを考慮）
function calculateScrollOffset() {
  if (import.meta.server)
    return 80;

  const header = document.querySelector('header.custom-header')
  const headerHeight = header ? header.getBoundingClientRect().height : 64;

  // モバイル版の場合、TOCの高さも考慮
  if (window.innerWidth <= 768 && mobileTocRef.value) {
    const tocHeight = mobileTocRef.value.getBoundingClientRect().height;
    return headerHeight + tocHeight + 16; // 16pxは余白
  }

  return headerHeight + 16;
}

// 全記事リスト（左サイドバー用）
const { data: allArticles } = await useAllArticles('blog');

const filteredArticles = computed(() => {
  const isDev = import.meta.dev
  const items = (allArticles.value || []).filter((item) => {
    if (!item.path || item.path === '/blog')
      return false
    return isDev || !item.draft // 開発環境: すべて表示、本番環境: draft除外
  })

  return sortArticlesByLatestDate(items)
})

const navigationItems = computed(() => filteredArticles.value.map(item => ({
  title: item.title || item.path,
  path: item.path as string,
})))

const surroundData = computed(() => {
  const items = filteredArticles.value
  if (!items.length)
    return [null, null]

  const currentPath = article.value?.path || route.path
  const currentIndex = items.findIndex(item => item.path === currentPath)

  if (currentIndex === -1)
    return [null, null]

  return [
    currentIndex > 0 ? items[currentIndex - 1] : null,
    currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
  ]
})

// 関連記事の計算（タグベースの関連性スコアリング）
const relatedArticles = computed(() => {
  if (!article.value || !allArticles.value)
    return []

  const currentTags = article.value.tags || []
  const currentPath = article.value.path

  // 現在の記事以外をフィルタリング
  const isDev = import.meta.dev
  const otherArticles = allArticles.value.filter((item) => {
    if (!item.path || item.path === '/blog' || item.path === currentPath)
      return false
    return isDev || !item.draft // 開発環境: すべて表示、本番環境: draft除外
  });

  // 関連性スコアを計算
  const scoredArticles = otherArticles.map((item) => {
    const itemTags = item.tags || []
    let score = 0

    // タグの一致数をカウント（完全一致）
    const matchedTags = itemTags.filter(tag => currentTags.includes(tag))
    score += matchedTags.length * 10 // タグ一致は高いスコア

    // 新しい記事に少しボーナス（最新日付ベース）
    const itemLatestDate = getBlogLatestDate(item)
    const currentLatestDate = getBlogLatestDate(article.value)

    const daysDiff
      = Math.abs(itemLatestDate.getTime() - currentLatestDate.getTime())
        / (1000 * 60 * 60 * 24)

    // 最新日付が近いほどボーナス（最大30日で計算）
    if (daysDiff < 30) {
      score += (30 - daysDiff) / 10
    }

    return {
      ...item,
      score,
      matchedTagCount: matchedTags.length,
    }
  });

  // スコア順にソートして上位5件を取得
  return scoredArticles
    .filter(item => item.score > 0) // スコアが0より大きいもののみ
    .sort((a, b) => {
      // まずスコアで比較
      if (b.score !== a.score)
        return b.score - a.score
      // スコアが同じ場合は最新日付で比較
      return getBlogLatestDate(b).getTime() - getBlogLatestDate(a).getTime()
    })
    .slice(0, 5)
    .map(item => ({
      title: item.title || item.path,
      path: item.path as string,
      matchedTagCount: item.matchedTagCount,
    }))
});

// スムーズスクロール（モバイル版TOCの高さを考慮）
function scrollToHeadingWithOffset(id: string) {
  if (import.meta.server)
    return;

  const element = document.getElementById(id);
  if (!element)
    return;

  const offset = calculateScrollOffset();
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: Math.max(offsetPosition, 0),
    behavior: 'smooth',
  });
}

// デスクトップ版TOC用（従来のオフセット）
const { scrollToHeading } = useScrollTo()

// SEO設定
useArticleSeo({
  article,
  route,
  baseUrl,
  breadcrumbSection: {
    name: 'ブログ',
    path: '/blog/',
  },
  schemaType: 'BlogPosting',
  ogImageOptions: {
    blur: 50,
  },
})
</script>

<template>
<div v-if="article" class="blog-article-page">
      <!-- 左サイドバー：記事ナビゲーション -->
      <aside class="sidebar sidebar--left">
        <div class="sidebar-sticky-wrapper">
          <h2 class="sidebar-title">
            記事一覧
          </h2>
          <nav v-if="navigationItems.length" class="sidebar-nav">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="sidebar-link"
              :class="{ 'sidebar-link--active': item.path === route.path }"
            >
              <Icon name="carbon:document" class="inline-block mr-2" />{{ item.title }}
            </NuxtLink>
          </nav>
        </div>
      </aside>

      <!-- メインコンテンツ -->
      <div class="main-content">
        <Breadcrumb
          :items="[
            {
              label: 'ホーム',
              to: '/',
              icon: 'line-md:home-md-twotone',
              srLabel: 'ホーム',
            },
            { label: 'ブログ', to: '/blog' },
            { label: article.title, current: true },
          ]"
        />

        <article class="article-container">
          <header class="article-header">
            <ArticleHeroImage
              v-if="article.img"
              :src="article.img"
              :alt="article.title"
              aspect-ratio="21/9"
              format="avif,webp"
              loading="eager"
              fetchpriority="high"
              :modifiers="{
                auto: 'format,compress',
                fit: 'cover',
                quality: '70',
              }"
              img-class="article-image"
              :is-dark="isDark"
            />

            <h1 class="article-title">
              {{ article.title }}
            </h1>

            <p v-if="article.description" class="article-description">
              {{ article.description }}
            </p>

            <div class="article-meta">
              <time
                v-if="article.publishedAt"
                :datetime="article.publishedAt"
                class="meta-date"
              >
                <Icon name="carbon:calendar" class="meta-icon" />
                {{ parseDate(article.publishedAt) }}
              </time>
              <time
                v-if="article.updatedAt"
                :datetime="article.updatedAt"
                class="meta-date"
              >
                <Icon name="carbon:update-now" class="meta-icon" />
                {{ parseDate(article.updatedAt) }}
              </time>
            </div>

            <ul v-if="article.tags && article.tags.length" class="article-tags">
              <li v-for="tag in article.tags" :key="tag" class="tag-item">
                <NuxtLink :to="`/blog/tags/${tag}`" class="tag-link">
                  #{{ replaceHyphen(tag) }}
                </NuxtLink>
              </li>
            </ul>

            <div class="share-buttons">
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  article.title,
                )}&url=${encodeURIComponent(
                  `https://nuxtation.phantomoon.com${route.path}`,
                )}`"
                target="_blank"
                rel="noopener noreferrer"
                class="share-button share-button--x"
                aria-label="Xでシェア"
              >
                <Icon name="carbon:logo-x" />
              </a>
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://nuxtation.phantomoon.com${route.path}`,
                )}`"
                target="_blank"
                rel="noopener noreferrer"
                class="share-button share-button--facebook"
                aria-label="Facebookでシェア"
              >
                <Icon name="carbon:logo-facebook" />
              </a>
              <a
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  `https://nuxtation.phantomoon.com${route.path}`,
                )}`"
                target="_blank"
                rel="noopener noreferrer"
                class="share-button share-button--linkedin"
                aria-label="LinkedInでシェア"
              >
                <Icon name="carbon:logo-linkedin" />
              </a>
              <a
                :href="`mailto:?subject=${encodeURIComponent(
                  article.title,
                )}&body=${encodeURIComponent(
                  `https://nuxtation.phantomoon.com${route.path}`,
                )}`"
                class="share-button share-button--email"
                aria-label="メールで共有"
              >
                <Icon name="carbon:email" />
              </a>
            </div>
          </header>

          <!-- モバイル版：折りたたみ式目次 -->
          <nav
            v-if="headings && headings.length"
            ref="mobileTocRef"
            class="mobile-toc"
            aria-label="目次"
          >
            <button
              class="mobile-toc-toggle"
              :aria-expanded="isMobileTocOpen"
              aria-label="目次を開閉"
              @click="isMobileTocOpen = !isMobileTocOpen"
            >
              <Icon name="carbon:list" class="toc-toggle-icon" />
              <span>目次</span>
              <Icon
                :name="isMobileTocOpen ? 'carbon:chevron-up' : 'carbon:chevron-down'"
                class="toc-toggle-arrow"
              />
            </button>
            <div v-show="isMobileTocOpen" class="mobile-toc-content">
              <ul class="toc-list">
                <li
                  v-for="link in headings"
                  :key="link.id"
                  :class="`toc-item toc-item--${link.depth}`"
                >
                  <a
                    :href="`#${link.id}`"
                    class="toc-link"
                    @click.prevent="
                      scrollToHeadingWithOffset(link.id);
                      isMobileTocOpen = false;
                    "
                  >
                    {{ link.text }}
                  </a>
                  <ul
                    v-if="link.children && link.children.length"
                    class="toc-list toc-list--nested"
                  >
                    <li
                      v-for="child in link.children"
                      :key="child.id"
                      :class="`toc-item toc-item--${child.depth}`"
                    >
                      <a
                        :href="`#${child.id}`"
                        class="toc-link"
                        @click.prevent="
                          scrollToHeadingWithOffset(child.id);
                          isMobileTocOpen = false;
                        "
                      >
                        {{ child.text }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>

          <div class="article-content prose dark:prose-invert">
            <ContentRenderer :value="article" />
          </div>

          <!-- 関連記事 -->
          <nav
            v-if="relatedArticles.length"
            class="related-articles-section"
            aria-label="関連記事"
          >
            <h2 class="related-section-title">
              関連記事
            </h2>
            <ul class="related-articles-grid">
              <li
                v-for="related in relatedArticles"
                :key="related.path"
                class="related-article-item"
              >
                <NuxtLink :to="related.path" class="related-article-link">
                  <Icon name="carbon:document" class="related-article-icon" />
                  <span class="related-article-title">{{ related.title }}</span>
                  <span v-if="related.matchedTagCount > 0" class="related-tag-badge">
                    {{ related.matchedTagCount }}
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </nav>

          <nav
            v-if="surroundData && (surroundData[0] || surroundData[1])"
            class="article-navigation"
          >
            <NuxtLink
              v-if="surroundData[0]"
              :to="surroundData[0].path"
              class="nav-link nav-link--prev"
            >
              <Icon name="carbon:arrow-left" class="nav-icon" />
              <div class="nav-content">
                <span class="nav-label">前の記事</span>
                <span class="nav-title">
                  <Icon name="carbon:document" class="inline-block mr-1" />{{
                    surroundData[0].title
                  }}
                </span>
              </div>
            </NuxtLink>
            <div v-else class="nav-placeholder" />

            <NuxtLink
              v-if="surroundData[1]"
              :to="surroundData[1].path"
              class="nav-link nav-link--next"
            >
              <div class="nav-content nav-content--right">
                <span class="nav-label">次の記事</span>
                <span class="nav-title">
                  <Icon name="carbon:document" class="inline-block mr-1" />{{
                    surroundData[1].title
                  }}
                </span>
              </div>
              <Icon name="carbon:arrow-right" class="nav-icon" />
            </NuxtLink>
            <div v-else class="nav-placeholder" />
          </nav>
        </article>
      </div>

      <!-- 右サイドバー：目次と関連記事 -->
      <aside class="sidebar sidebar--right">
        <div class="sidebar-sticky-wrapper">
          <nav v-if="headings && headings.length" class="toc-nav" aria-label="目次">
            <h2 class="sidebar-title">
              目次
            </h2>
            <ul class="toc-list">
              <li
                v-for="link in headings"
                :key="link.id"
                :class="`toc-item toc-item--${link.depth}`"
              >
                <a
                  :href="`#${link.id}`"
                  class="toc-link"
                  @click.prevent="scrollToHeading(link.id)"
                >
                  {{ link.text }}
                </a>
                <ul
                  v-if="link.children && link.children.length"
                  class="toc-list toc-list--nested"
                >
                  <li
                    v-for="child in link.children"
                    :key="child.id"
                    :class="`toc-item toc-item--${child.depth}`"
                  >
                    <a
                      :href="`#${child.id}`"
                      class="toc-link"
                      @click.prevent="scrollToHeading(child.id)"
                    >
                      {{ child.text }}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    <LazyScrollToTop />
		</div>
</template>

<style scoped>
@reference "tailwindcss";

.blog-article-page {
  @apply grid gap-8 max-w-[1440px] mx-auto px-6 lg:grid-cols-[260px_minmax(0,1fr)_240px] md:max-lg:grid-cols-[minmax(0,1fr)_240px] max-md:grid-cols-1;
}

.sidebar--left {
  @apply max-lg:hidden;
}

.sidebar--right {
  @apply max-md:hidden;
}

.sidebar {
  @apply pt-8;
}

.sidebar-sticky-wrapper {
  @apply sticky flex flex-col gap-4;
  top: 100px;
  max-height: calc(100vh - 150px);
}

.sidebar-title {
  @apply font-bold pb-3 flex-shrink-0;
  font-size: 1.05rem;
  color: #0f172a;
  border-bottom: 2px solid rgba(16, 185, 129, 0.3);
}

.sidebar-nav {
  @apply flex flex-col gap-2 overflow-y-auto pr-2 flex-1;
  min-height: 0;
}

.sidebar-link {
  @apply block rounded-lg no-underline transition-all duration-200;
  padding: 0.4rem 0.6rem;
  color: rgba(15, 23, 42, 0.78);
  font-size: 0.95rem;
}

.sidebar-link:hover {
  background-color: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.sidebar-link--active {
  background-color: rgba(16, 185, 129, 0.2);
  color: #047857;
  font-weight: 600;
}

.toc-nav {
  @apply flex flex-col gap-2 overflow-y-auto pr-2 flex-1;
  min-height: 0;
}

.toc-list {
  @apply list-none p-0 m-0 flex flex-col gap-1;
}

.toc-list--nested {
  @apply mt-1 pl-4;
  border-left: 2px solid rgba(226, 232, 240, 0.4);
}

.toc-item {
  @apply block;
}

.toc-item--2 {
  font-size: 0.9rem;
}

.toc-item--3 {
  font-size: 0.85rem;
  padding-left: 0.5rem;
}

.toc-link {
  @apply block rounded-md no-underline transition-all duration-200;
  padding: 0.4rem 0.6rem;
  color: rgba(15, 23, 42, 0.75);
  font-size: 0.9rem;
  line-height: 1.4;
}

.toc-link:hover {
  @apply translate-x-0.5;
  background-color: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.toc-link:focus {
  @apply outline outline-2 outline-offset-2;
  outline-color: var(--color-link-light);
  background-color: rgba(16, 185, 129, 0.12);
}

.main-content {
  @apply flex flex-col gap-8 min-w-0;
}

.breadcrumb {
  @apply mt-6;
}

.breadcrumb-list {
  @apply flex items-center gap-2 list-none p-0 m-0 text-sm;
}

.breadcrumb-item {
  @apply flex items-center;
}

.breadcrumb-link {
  @apply no-underline transition-colors duration-200 flex items-center text-base;
  color: rgba(15, 23, 42, 0.7);
}

.breadcrumb-link {
  @apply md:text-xl;
}

.breadcrumb-link :deep(svg) {
  @apply text-2xl md:text-[1.8rem];
}

.breadcrumb-link:hover {
  color: var(--color-link-light);
}

.breadcrumb-separator {
  @apply select-none;
  color: rgba(148, 163, 184, 0.6);
}

.breadcrumb-current {
  @apply font-semibold text-base max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap md:max-w-none md:text-xl;
  color: rgba(15, 23, 42, 0.9);
}

.visually-hidden {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
}

.article-container {
  @apply rounded-2xl overflow-hidden border max-md:overflow-visible;
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(226, 232, 240, 0.6);
}

.article-header {
  @apply text-center p-0 max-md:px-2.5;
}

.article-image {
  @apply w-full h-auto block object-cover;
  max-height: 500px;
}

.article-header :deep(.article-hero-wrapper) {
  @apply w-full;
}

@media (max-width: 768px) {
  .article-header :deep(.article-hero-wrapper) {
    margin-left: -10px;
    margin-right: -10px;
    width: calc(100% + 20px);
  }
}

.article-title {
  @apply font-bold leading-tight;
  font-size: clamp(2rem, 4vw, 3rem);
  color: #0f172a;
  margin: 2rem 2rem 1rem;
}

@media (max-width: 768px) {
  .article-title {
    margin-left: 0;
    margin-right: 0;
  }
}

.article-description {
  @apply text-lg leading-relaxed;
  color: rgba(55, 65, 81, 0.9);
  margin: 0 2rem 1.5rem;
}

@media (max-width: 768px) {
  .article-description {
    margin-left: 0;
    margin-right: 0;
  }
}

.article-meta {
  @apply flex items-center justify-center gap-6 flex-wrap;
  margin: 1rem 2rem;
}

@media (max-width: 768px) {
  .article-meta {
    margin-left: 0;
    margin-right: 0;
  }
}

.meta-date {
  @apply flex items-center gap-2 text-sm;
  color: rgba(15, 23, 42, 0.7);
}

.meta-icon {
  font-size: 1.1rem;
}

.article-tags {
  @apply flex flex-wrap gap-3 justify-center list-none m-0;
  padding: 0 2rem 2rem;
}

@media (max-width: 768px) {
  .article-tags {
    padding-left: 0;
    padding-right: 0;
  }
}

.tag-item {
  @apply inline-block;
}

.tag-link {
  @apply inline-block font-semibold text-sm rounded-full no-underline transition-all duration-200;
  padding: 0.4rem 0.9rem;
  background: rgba(16, 185, 129, 0.16);
  color: #047857;
}

.tag-link:hover {
  @apply -translate-y-0.5;
  background: rgba(16, 185, 129, 0.24);
}

.share-buttons {
  @apply flex items-center justify-center gap-4;
  margin: 1.5rem 2rem 2rem;
}

@media (max-width: 768px) {
  .share-buttons {
    margin-left: 0;
    margin-right: 0;
  }
}

.share-button {
  @apply flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-full no-underline transition-all duration-200 text-xl;
  touch-action: manipulation;
}

.share-button--x {
  background: rgba(0, 0, 0, 0.08);
  color: #0f172a;
}

.share-button--x:hover {
  background: #000000;
  color: white;
  transform: translateY(-2px);
}

.share-button--facebook {
  background: rgba(24, 119, 242, 0.1);
  color: #1877f2;
}

.share-button--facebook:hover {
  background: #1877f2;
  color: white;
  transform: translateY(-2px);
}

.share-button--linkedin {
  background: rgba(10, 102, 194, 0.1);
  color: #0a66c2;
}

.share-button--linkedin:hover {
  background: #0a66c2;
  color: white;
  transform: translateY(-2px);
}

.share-button--email {
  background: rgba(234, 67, 53, 0.1);
  color: #ea4335;
}

.share-button--email:hover {
  background: #ea4335;
  color: white;
  transform: translateY(-2px);
}

/* ============================================
   記事本文
   ============================================ */
.article-content {
  @apply max-w-[800px] mx-auto leading-relaxed;
  margin: 2rem auto;
  padding: 3rem 2rem;
}

@media (max-width: 768px) {
  .article-content {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 2rem;
    padding-bottom: 2rem;
    font-size: 1rem;
    line-height: 1.9;
  }
}

/* Pタグの幅を統一 - proseクラスの制限を上書き */
.article-content :deep(p) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  text-align: justify !important;
  text-justify: inter-character !important;
}

.article-content.prose :deep(p),
.article-content.prose-invert :deep(p) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  text-align: justify !important;
  text-justify: inter-character !important;
}

/* 記事本文内の見出しスタイル */
.article-content :deep(h2) {
  position: relative;
  padding: 0.8em !important;
  margin: 2rem 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  border: 2px solid #b92a2c;
  border-radius: 10px;
  text-decoration: none;
  line-height: 1.4;
  & a {
    text-decoration: none !important;
  }
}

.article-content :deep(h2) {
  @apply max-md:text-[1.35rem] max-[767px]:p-[0.6em] max-[767px]:my-6 max-[767px]:mx-0 min-[768px]:text-[2rem];
}

.article-content :deep(h3) {
  position: relative;
  padding: 14px 10px 10px 10px;
  margin: 30px 0 0 0;
  font-size: 1.25rem;
  line-height: 1.6;
  & a {
    text-decoration: none;
  }
}

.article-content :deep(h3) {
  @apply max-sm:text-[1.2rem] max-sm:my-5 max-sm:mx-0 max-sm:py-3 max-sm:px-2 sm:text-[1.4rem] sm:ml-2.5;
}

.article-content :deep(h3::before):not(.link-card-title) {
  content: '';
  position: absolute;
  top: 0;
  left: -5px;
  width: 12px;
  height: 12px;
  background: #999;
  transform: rotate(45deg);
}

.article-content :deep(h3::after):not(.link-card-title) {
  content: '';
  position: absolute;
  top: 15px;
  left: -10px;
  width: 8px;
  height: 8px;
  background: #777;
  transform: rotate(15deg);
}

.article-content :deep(h4) {
  position: relative;
  padding: 0.5em 0 0.5em 1.5em;
  margin: 0 0 0.8em;
  font-size: 1.25rem;
  font-weight: 700;
  border: 2px solid #b92a2c;
  line-height: 1.5;
  & a {
    text-decoration: none;
  }
}

.article-content :deep(h4) {
  @apply max-md:text-[1.15rem] max-[767px]:py-[0.5em] max-[767px]:pr-0 max-[767px]:pl-[1.2em];
}

.article-content :deep(h4::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 0.5em;
  margin-top: -15px;
  width: 8px;
  height: 30px;
  background: #b92a2c;
  border-radius: 2px;
}

.article-content :deep(h5) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1e293b;
  line-height: 1.4;
  & a {
    text-decoration: none;
  }
}

.article-content :deep(.twitter-tweet) {
  margin: 0 auto;
}

.dark .article-content :deep(h5) {
  color: #e2e8f0;
}

.related-articles-section {
  @apply p-8 mt-12 border-t;
  border-color: rgba(226, 232, 240, 0.8);
}

.related-section-title {
  @apply text-2xl font-bold text-center mb-6;
  color: #0f172a;
}

.related-articles-grid {
  @apply list-none p-0 m-0 grid gap-4;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.related-article-item {
  @apply block;
}

.related-article-link {
  @apply flex items-center gap-3 rounded-xl no-underline transition-all duration-200 h-full border;
  padding: 1rem 1.25rem;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #0f172a;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.15);
}

.related-article-link:hover {
  @apply -translate-y-0.5;
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}

.related-article-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
  opacity: 0.7;
  color: var(--color-link-light);
}

.related-article-title {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-tag-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.2);
  color: #047857;
  font-size: 0.75rem;
  font-weight: 700;
}

.article-navigation {
  @apply grid gap-6 mt-8 p-8 border-t grid-cols-2 max-md:grid-cols-1;
  border-color: rgba(226, 232, 240, 0.8);
}

.nav-link {
  @apply flex items-center gap-4 p-6 rounded-xl border no-underline transition-all duration-200;
  border-color: rgba(226, 232, 240, 0.6);
  background: rgba(248, 250, 252, 0.5);
}

.nav-link:hover {
  @apply -translate-y-0.5;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.nav-link--prev {
  @apply justify-start;
}

.nav-link--next {
  @apply justify-end;
}

.nav-icon {
  @apply text-2xl flex-shrink-0;
  color: rgba(16, 185, 129, 0.8);
}

.nav-content {
  @apply flex flex-col gap-1;
}

.nav-content--right {
  @apply text-right;
}

.nav-label {
  @apply text-sm font-medium;
  color: rgba(15, 23, 42, 0.6);
}

.nav-title {
  @apply text-base font-semibold;
  color: #0f172a;
}

.nav-placeholder {
  @apply invisible;
}

/* ダークモード */
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

.dark .sidebar-link--active {
  background-color: rgba(34, 197, 94, 0.25);
  color: var(--color-link-dark);
}

.dark .toc-link {
  color: rgba(226, 232, 240, 0.75);
}

.dark .toc-link:hover {
  background-color: rgba(34, 197, 94, 0.18);
  color: var(--color-link-dark);
}

.dark .toc-list--nested {
  border-left-color: rgba(71, 85, 105, 0.5);
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

.dark .article-container {
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(71, 85, 105, 0.6);
}

.dark .article-title {
  color: #f8fafc;
}

.dark .article-description {
  color: rgba(226, 232, 240, 0.85);
}

.dark .article-content :deep(h2) {
  border-color: #b92a2c !important;
  color: #f8fafc !important;
}

.dark .meta-date {
  color: rgba(226, 232, 240, 0.7);
}

.dark .tag-link {
  background: var(--color-tag-bg-dark);
  color: #ffffff;
}

.dark .tag-link:hover {
  background: rgba(59, 130, 246, 0.35);
}

.dark .article-navigation {
  border-top-color: rgba(71, 85, 105, 0.5);
}

.dark .nav-link {
  border-color: rgba(71, 85, 105, 0.6);
  background: rgba(30, 41, 59, 0.6);
}

.dark .nav-link:hover {
  box-shadow: 0 8px 16px rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
}

.dark .nav-icon {
  color: rgba(34, 197, 94, 0.9);
}

.dark .nav-label {
  color: rgba(226, 232, 240, 0.6);
}

.dark .nav-title {
  color: #f8fafc;
}

.dark .share-button--x {
  background: rgba(226, 232, 240, 0.15);
  color: #f8fafc;
}

.dark .share-button--x:hover {
  background: #f8fafc;
  color: #000000;
}

.dark .related-articles-section {
  border-top-color: rgba(71, 85, 105, 0.5);
}

.dark .related-section-title {
  color: #f8fafc;
}

.dark .related-article-link {
  background: rgba(34, 197, 94, 0.15);
  color: #f1f5f9;
  border-color: rgba(34, 197, 94, 0.4);
  box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
}

.dark .related-article-link:hover {
  background: rgba(34, 197, 94, 0.25);
  border-color: rgba(34, 197, 94, 0.6);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.dark .related-article-icon {
  color: var(--color-link-dark);
}

.dark .related-tag-badge {
  background: rgba(34, 197, 94, 0.25);
  color: var(--color-link-dark);
}

/* モバイル版折りたたみ式目次 */
.mobile-toc {
  @apply hidden rounded-lg border max-md:block max-md:sticky max-md:m-0 max-md:z-20 max-md:top-16;
  margin: 1.5rem 0;
  background: rgba(248, 250, 252, 0.95);
  border-color: rgba(226, 232, 240, 0.6);
}

.mobile-toc-toggle {
  @apply w-full flex items-center gap-3 bg-transparent border-0 cursor-pointer text-base font-semibold transition-colors duration-200;
  padding: 1rem 1.25rem;
  color: #0f172a;
}

.mobile-toc-toggle:hover {
  background: rgba(16, 185, 129, 0.08);
}

.mobile-toc-toggle:focus {
  @apply outline outline-2 outline-offset-2;
  outline-color: var(--color-link-light);
}

.toc-toggle-icon {
  @apply text-xl;
  color: var(--color-link-light);
}

.toc-toggle-arrow {
  @apply ml-auto text-base transition-transform duration-200;
  color: rgba(15, 23, 42, 0.5);
}

.mobile-toc-content {
  @apply border-t overflow-y-auto;
  padding: 0 1.25rem 1rem;
  border-color: rgba(226, 232, 240, 0.4);
  animation: slideDown 0.2s ease;
  max-height: 60vh;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dark .mobile-toc {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(51, 65, 85, 0.6);
}

.dark .mobile-toc-toggle {
  color: #f8fafc;
}

.dark .mobile-toc-toggle:hover {
  background: rgba(16, 185, 129, 0.12);
}

.dark .mobile-toc-content {
  border-top-color: rgba(51, 65, 85, 0.4);
}

.dark .toc-toggle-arrow {
  color: rgba(248, 250, 252, 0.5);
}
</style>
