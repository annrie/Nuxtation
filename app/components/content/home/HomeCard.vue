<script setup lang="ts">
import type { Ref } from 'vue';
import type { ContentPreview, Sections } from '~~/types';
import { computed, inject } from 'vue';
import { useIsWithinTenDays } from '~/composables/useIsWithinTenDays'
import { getLatestDate } from '~/utils/format'

const props = withDefaults(defineProps<{
  item: ContentPreview;
  section: Sections;
  variant?: 'blog' | 'biblio';
  index?: number;
}>(), {
  index: 0,
});

// 親からダークモード状態をinject
const isDark = inject<Ref<boolean>>('isDark', ref(false));

const target = computed(() => props.item.url ? '_blank' : '_self')
const destination = computed(() => props.item.url || props.item.path || '#')

// publishedAtとupdatedAtの新しい方を表示
const latestDate = computed(() => getLatestDate(props.item.publishedAt, props.item.updatedAt))

const isFresh = useIsWithinTenDays(latestDate)

const maxTitleLength = 30

const limitedTitle = computed(() => {
  const title = props.item.title || 'Untitled'
  return title.length > maxTitleLength ? `${title.substring(0, maxTitleLength)}...` : title
});

// ジャンル別のクラス名を生成（モバイル版のみ）
const jenreClass = computed(() => {
  if (props.variant === 'biblio' && props.section) {
    if (props.section === 'jenre' && props.item.tags && props.item.tags.length > 0) {
      return `jenre-${props.item.tags[0]}`
    }
  }
  return ''
});
</script>

<template>
  <article class="card-wrapper">
    <UCard
      class="card"
      :class="{ 'biblio-variant': variant === 'biblio' }"
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
              :modifiers="{ fit: 'crop', w: 640, h: 360, q: index === 0 ? 85 : 80, auto: 'format,compress' }"
              img-class="card-image"
              :is-dark="isDark"
            />
            <h3 v-if="variant === 'biblio'" class="card-title-overlay" :class="jenreClass">
              {{ limitedTitle }}
            </h3>
          </NuxtLink>
          <span v-if="isFresh" class="fresh-badge">
            NEW
          </span>
        </div>
      </template>

      <template #default>
        <div class="card-body">
          <NuxtLink :to="destination" :target="target" class="card-title" :class="{ 'biblio-title': variant === 'biblio' }">
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

  .card-image-link .card-title-overlay {
    @apply !hidden !h-0 !absolute !invisible;
    top: -9999px !important;
    left: -9999px !important;
  }

  .biblio-variant .card-image-link {
    @apply !rounded-none;
  }
}

@media (max-width: 768px) {
  .card-image-link {
    @apply relative rounded-t-[20px] overflow-hidden;
  }

  .card.biblio-variant .card-image-link {
    @apply !rounded-none;
  }
}

:deep(.article-hero-wrapper),
:deep(.article-hero-wrapper picture),
:deep(.article-hero-wrapper img) {
  @apply m-0 p-0 block align-bottom;
}

.card-image {
  @apply block w-full h-auto aspect-video object-cover transition-transform duration-[350ms] rounded-t-[20px];
}

.biblio-variant .card-image {
  @apply !rounded-none;
}

.card:hover .card-image {
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

@media (max-width: 768px) {
  .card-title.biblio-title {
    @apply !hidden;
  }
}

@media (max-width: 768px) {
  .card-title-overlay {
    @apply absolute left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white leading-[1.3] py-4 px-6 rounded-2xl inline-block m-0 z-10 max-w-[85%] text-center whitespace-nowrap overflow-hidden text-ellipsis;
    background: linear-gradient(to bottom right, rgba(16, 185, 129, 0.85), rgba(5, 150, 105, 0.9));
    top: calc(50% + 10px);
    font-size: clamp(1.33rem, 3.33vw, 1.67rem);
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .card-title-overlay.jenre-sf {
    background: linear-gradient(to bottom right, rgba(37, 99, 235, 0.85), rgba(29, 78, 216, 0.9));
  }

  .card-title-overlay.jenre-adv {
    background: linear-gradient(to bottom right, rgba(102, 153, 0, 0.85), rgba(77, 124, 15, 0.9));
  }

  .card-title-overlay.jenre-mys {
    background: linear-gradient(to bottom right, rgba(237, 24, 30, 0.85), rgba(220, 38, 38, 0.9));
  }

  .card-title-overlay.jenre-jedi {
    background: linear-gradient(to bottom right, rgba(75, 85, 99, 0.85), rgba(55, 65, 81, 0.9));
  }

  .card-title-overlay.jenre-horror {
    background: linear-gradient(to bottom right, rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.9));
  }

  .card-title-overlay.jenre-short {
    background: linear-gradient(to bottom right, rgba(132, 204, 22, 0.85), rgba(101, 163, 13, 0.9));
  }
}

@media (min-width: 769px) {
  .card-title-overlay {
    @apply !hidden !h-0 !p-0 !m-0 !overflow-hidden !absolute !invisible;
  }
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
