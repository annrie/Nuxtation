<script setup lang="ts">
import type { Ref } from 'vue'
import type { ContentPreview, Sections } from '~~/types'
import { computed, inject } from 'vue'
import { useIsWithinTenDays } from '~/composables/useIsWithinTenDays'
import { getLatestDate } from '~/utils/format'

const props = withDefaults(defineProps<{
  item: ContentPreview
  section: Sections
  variant?: 'blog'
  index?: number
}>(), {
  index: 0,
})

// 親からダークモード状態をinject
const isDark = inject<Ref<boolean>>('isDark', ref(false))

const target = computed(() => props.item.url ? '_blank' : '_self')
const destination = computed(() => props.item.url || props.item.path || '#')

// publishedAtとupdatedAtの新しい方を表示
const latestDate = computed(() => getLatestDate(props.item.publishedAt, props.item.updatedAt))

const isFresh = useIsWithinTenDays(latestDate)

const maxTitleLength = 30

const limitedTitle = computed(() => {
  const title = props.item.title || 'Untitled'
  return title.length > maxTitleLength ? `${title.substring(0, maxTitleLength)}...` : title
})

</script>

<template>
  <article class="card-wrapper">
    <UCard
      class="card"
      :ui="{
        root: 'rounded-[20px] overflow-hidden h-full transition-all duration-[350ms] max-md:cursor-pointer bg-white dark:bg-slate-800 shadow-card-light dark:shadow-card-dark hover:shadow-card-hover-light dark:hover:shadow-card-hover-dark hover:-translate-y-1.5 max-md:hover:translate-y-0 border-2 border-slate-300 dark:border-slate-700 active:scale-[0.98] max-md:active:scale-[0.98]',
        body: 'p-0 sm:p-0',
        header: 'p-0 sm:p-0',
      }"
    >
      <template #header>
        <div class="header-wrapper">
          <NuxtLink :to="destination" :target="target" class="card-image-link" :aria-label="`${limitedTitle}の記事を読む`">
            <ArticleHeroImage
              v-if="item.img"
              :src="item.img"
              :alt="item.title"
              aspect-ratio="16/9"
              format="avif,webp,png"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : undefined"
              :modifiers="{ fit: 'contain', w: 1280, h: 720, q: 60, auto: 'format,compress' }"
              img-class="card-image"
              :is-dark="isDark"
            />
          </NuxtLink>
          <span v-if="isFresh" class="fresh-badge">
            NEW
          </span>
        </div>
      </template>

      <template #default>
        <div class="card-body">
          <NuxtLink :to="destination" :target="target" class="card-title">
            {{ limitedTitle }}
          </NuxtLink>
          <div class="card-meta">
            <Icon v-if="isFresh" name="eos-icons:arrow-rotate" class="fresh-icon" />
            <HomeDateLabel :date="latestDate" />
          </div>
          <HomeTagList :tags="item.tags" :section="section" :variant="variant" />
        </div>
      </template>
    </UCard>
  </article>
</template>

<style scoped>
@reference "tailwindcss";

.card-wrapper {
  @apply h-full;
}

.header-wrapper {
  @apply relative;
}

.fresh-badge {
  @apply absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-md;
  @apply bg-emerald-500 text-white shadow-lg;
  @apply animate-pulse;
}

/* ui プロップで制御するため削除 */

@media (max-width: 768px) {
  .card {
    -webkit-tap-highlight-color: rgba(16, 185, 129, 0.1);
  }
}

.card-image-link {
  @apply block no-underline m-0 p-0 leading-none outline-none;
}

.card-image-link:focus {
  @apply outline outline-[3px] outline-offset-2;
  outline-color: var(--color-link-light);
}

.dark .card-image-link:focus {
  outline-color: var(--color-link-dark);
}

@media (min-width: 769px) {
  .card-image-link {
    @apply static overflow-hidden h-auto max-h-fit rounded-t-[20px];
  }
}

@media (max-width: 768px) {
  .card-image-link {
    @apply relative rounded-t-[20px] overflow-hidden;
  }
}

:deep(.article-hero-wrapper),
:deep(.article-hero-wrapper picture),
:deep(.article-hero-wrapper img) {
  @apply m-0 p-0 block align-bottom;
}

:deep(.card-image) {
  @apply absolute top-0 left-0 w-full h-full aspect-video object-cover object-top transition-transform duration-[350ms] rounded-t-[20px];
}

.card:hover :deep(.card-image) {
  @apply scale-105;
}

.card-body {
  @apply flex flex-col flex-grow p-6 pt-2 text-center max-md:pt-4;
}

.card-title {
  @apply block text-lg font-bold no-underline leading-[1.35];
  @apply text-slate-900;
}

.card-title:hover {
  color: var(--color-link-light);
}

.card-title:focus {
  @apply outline outline-2 outline-offset-2 rounded;
  outline-color: var(--color-link-light);
}

.dark .card-title {
  @apply text-slate-50;
}

.dark .card-title:hover {
  color: var(--color-link-dark);
}

.dark .card-title:focus {
  outline-color: var(--color-link-dark);
}

.card-meta {
  @apply mt-3 flex items-center justify-center gap-2;
}

.fresh-icon {
  @apply text-sky-500 text-[1.1rem];
}

.card-body :deep(.tag-list) {
  @apply mt-auto;
}
</style>
