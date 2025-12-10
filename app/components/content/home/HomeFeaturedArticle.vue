<script setup lang="ts">
import type { Ref } from 'vue';
import type { ContentPreview, Sections } from '~~/types';
import { computed, inject } from 'vue';
import { useIsWithinTenDays } from '~/composables/useIsWithinTenDays'
import { getLatestDate } from '~/utils/format'

const props = defineProps<{
  item?: ContentPreview | null;
  section: Sections;
}>();

// 親からダークモード状態をinject
const isDark = inject<Ref<boolean>>('isDark', ref(false));

const target = computed(() => props.item?.url ? '_blank' : '_self')
const destination = computed(
  () => props.item?.url || props.item?.path || '#',
);

// publishedAtとupdatedAtの新しい方を表示
const latestDate = computed(() => getLatestDate(props.item?.publishedAt, props.item?.updatedAt))

const isFresh = useIsWithinTenDays(latestDate)

const maxTitleLength = 100
const maxDescLength = 150

const limitedTitle = computed(() => {
  if (!props.item?.title)
    return 'Untitled'
  const title = props.item.title
  return title.length > maxTitleLength ? `${title.substring(0, maxTitleLength)}...` : title
});

const limitedDescription = computed(() => {
  if (!props.item?.description)
    return ''
  const desc = props.item.description
  return desc.length > maxDescLength ? `${desc.substring(0, maxDescLength)}...` : desc
});
</script>

<template>
  <article v-if="item" class="featured">
    <div class="featured-visual-wrapper">
      <NuxtLink :to="destination" :target="target" class="image-link-base featured-visual" :aria-label="`${limitedTitle}の画像`">
        <ArticleHeroImage
          v-if="item.img"
          :src="item.img"
          :alt="item.title"
          aspect-ratio="21/9"
          format="avif,webp,png"
          loading="eager"
          fetchpriority="high"
          :modifiers="{ fit: 'crop', w: 1200, h: 514, q: 85, auto: 'format,compress' }"
          img-class="featured-image"
          :is-dark="isDark"
        />
      </NuxtLink>
      <span v-if="isFresh" class="fresh-badge">
        NEW
      </span>
    </div>

    <div class="featured-body">
      <HomeTagList
        :tags="item.tags"
        :section="section"
        variant="blog"
      />
      <div class="featured-meta">
        <Icon v-if="isFresh" name="eos-icons:arrow-rotate" class="fresh-icon" />
        <HomeDateLabel :date="latestDate" />
      </div>
      <NuxtLink :to="destination" :target="target" class="featured-title" :aria-label="`${limitedTitle}の記事を読む`">
        {{ limitedTitle }}
      </NuxtLink>
      <p v-if="limitedDescription" class="featured-description">
        {{ limitedDescription }}
      </p>
      <div class="featured-button-wrapper">
        <BaseButton variant="cta" :href="destination" :target="target" :aria-label="`${limitedTitle}を読む`">
          <span>読んでみる</span>
          <Icon name="lucide:arrow-right" class="button-icon" />
        </BaseButton>
      </div>
    </div>
  </article>
</template>

<style scoped>
@reference "tailwindcss";

.featured {
  @apply grid gap-8 rounded-[32px] p-6 mx-auto mb-14 max-w-[1080px] border max-md:mx-4;
  @apply bg-gradient-to-br from-white to-slate-50;
  @apply border-slate-300/75 backdrop-blur-sm;
  box-shadow:
    0 22px 44px rgba(15, 23, 42, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.dark .featured {
  @apply bg-gradient-to-br from-blue-900/82 to-slate-800/80;
  @apply border-blue-200/50;
  box-shadow:
    0 32px 60px rgba(8, 25, 48, 0.55),
    inset 0 1px 0 rgba(168, 214, 255, 0.35);
}

@media (min-width: 62rem) {
  .featured {
    @apply grid-cols-[1.3fr_1fr] items-center;
    padding: 2.6rem;
  }
}

.featured-visual-wrapper {
  @apply relative;
}

.fresh-badge {
  @apply absolute top-2 right-2 z-10 px-2 py-1 text-xs font-bold uppercase tracking-wide rounded-md;
  @apply bg-emerald-500 text-white shadow-lg;
  @apply animate-pulse;
}

.featured-visual {
  @apply overflow-hidden rounded-t-[20px] relative -mx-6 -mt-6;
}

@media (min-width: 62rem) {
  .featured-visual {
    @apply m-0 rounded-3xl;
  }
}

.featured-image {
  @apply block w-full h-auto aspect-video object-cover transition-transform duration-[450ms] ease-in-out;
}

.featured:hover .featured-image {
  @apply scale-105;
}

.featured-body {
  @apply flex flex-col gap-5;
}

.featured-meta {
  @apply flex items-center gap-2;
}

.featured-title {
  @apply block self-stretch font-bold no-underline leading-tight w-full max-w-full outline-none rounded;
  @apply text-gray-900;
  font-size: clamp(1.3rem, 2vw, 2rem);
  text-shadow: 0 2px 9px rgba(15, 23, 42, 0.18);
}

.featured-title:focus {
  @apply outline outline-2 outline-offset-4;
  outline-color: var(--color-link-light);
}

.dark .featured-title {
  @apply text-white;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.55);
}

.dark .featured-title:focus {
  outline-color: var(--color-link-dark);
}

.featured-description {
  @apply block self-stretch text-base leading-[1.65] w-full max-w-full;
  @apply text-gray-800;
}

.dark .featured-description {
  @apply text-blue-50/90;
  text-shadow: 0 2px 8px rgba(8, 30, 54, 0.45);
}

.featured-button-wrapper {
  @apply flex justify-center;
}

@media (max-width: 61.99rem) {
  .featured-button-wrapper {
    display: flex !important;
  }
}

@media (min-width: 62rem) {
  .featured-button-wrapper {
    display: none !important;
  }
}

.featured-button-wrapper :deep(.base-button) {
  @apply px-6 py-3 text-lg;
}

.button-icon {
  @apply text-xl text-white;
}

.fresh-icon {
  @apply text-sky-500;
  font-size: 1.1rem;
}

.featured-body :deep(.tag-list) {
  @apply justify-center min-[62rem]:justify-start;
}
</style>
