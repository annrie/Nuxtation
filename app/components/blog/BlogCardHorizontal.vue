<script setup lang="ts">
import type { Ref } from 'vue';
import type { ContentPreview } from '~/types';
import { computed, inject } from 'vue';
import { useIsWithinTenDays } from '~/composables/useIsWithinTenDays'
import { getLatestDate } from '~/utils/format'

const props = defineProps<{
  item: ContentPreview;
}>();

// 親からダークモード状態をinject
const isDark = inject<Ref<boolean>>('isDark', ref(false));

const target = computed(() => props.item.url ? '_blank' : '_self')
const destination = computed(() => props.item.url || props.item.path || '#')

// publishedAtとupdatedAtの新しい方を表示
const latestDate = computed(() => getLatestDate(props.item.publishedAt, props.item.updatedAt))

const isFresh = useIsWithinTenDays(latestDate)

const maxTitleLength = 80
const maxDescLength = 120

const limitedTitle = computed(() => {
  const title = props.item.title || 'Untitled'
  return title.length > maxTitleLength ? `${title.substring(0, maxTitleLength)}...` : title
});

const limitedDescription = computed(() => {
  if (!props.item.description)
    return ''
  const desc = props.item.description
  return desc.length > maxDescLength ? `${desc.substring(0, maxDescLength)}...` : desc
});

const safeAlt = computed(() => props.item.title || '記事の画像')

</script>

<template>
  <article class="card-wrapper">
    <div class="card-horizontal">
      <div class="card-layout">
        <NuxtLink :to="destination" :target="target" class="image-link-base card-image-link">
          <div class="card-image-wrapper">
            <ArticleHeroImage
              v-if="item.img"
              :src="item.img"
              :alt="safeAlt"
              aspect-ratio="16/9"
              format="avif,webp,png"
              loading="lazy"
              :modifiers="{ fit: 'crop', w: 800, h: 450, q: 80, auto: 'format,compress' }"
              img-class="card-image"
              :is-dark="isDark"
            />
          </div>
        </NuxtLink>

        <div class="card-content">
          <div class="card-meta">
            <Icon v-if="isFresh" name="eos-icons:arrow-rotate" class="fresh-icon" />
            <HomeDateLabel :date="latestDate" />
          </div>
          <NuxtLink :to="destination" :target="target" class="card-title-link">
            <h3 class="card-title">
              {{ limitedTitle }}
            </h3>
          </NuxtLink>
          <p v-if="limitedDescription" class="card-description">
            {{ limitedDescription }}
          </p>
          <HomeTagList :tags="item.tags" section="blog" variant="blog" />
          <div class="button-wrapper">
            <BaseButton variant="cta" :href="destination" :target="target" aria-label="`${limitedTitle}を読む`">
              <span>読んでみる</span>
              <Icon name="lucide:arrow-right" class="button-icon" />
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style>
@reference "tailwindcss";

.card-wrapper {
  @apply w-full max-w-[900px] mx-auto;
}

.card-horizontal {
  @apply w-full overflow-hidden transition-all duration-300 ease-in-out;
}

:deep(.card-horizontal .p-4) {
  @apply !p-0;
}

:deep(.card-wrapper .p-4) {
  @apply !p-0;
}

.card-horizontal :deep(div[class*='p-']) {
  @apply !p-0;
}

.card-horizontal:hover {
  @apply -translate-y-1;
}

.card-layout {
  @apply flex flex-row !m-0 !p-0 max-md:flex-col h-auto;
}

.card-image-link {
  @apply flex-[0_0_40%] max-md:flex-[0_0_auto] max-md:w-full max-md:h-[200px];
}

.card-title-link {
  @apply no-underline min-h-[44px] flex items-start text-inherit;
  touch-action: manipulation;
}

.card-title-link:hover .card-title {
  color: var(--color-link-light);
}

.dark .card-title-link:hover .card-title {
  color: var(--color-link-dark);
}

.card-image-wrapper {
  @apply w-full relative overflow-hidden !m-0 !p-0 max-md:h-[200px];
  min-height: 240px;
}

@media (max-width: 768px) {
  .card-image-wrapper {
    min-height: 200px;
  }
}

.card-image {
  @apply block w-full object-cover transition-transform duration-300 ease-in-out max-md:h-[200px];
  height: 100%;
  min-height: 240px;
}

@media (max-width: 768px) {
  .card-image {
    min-height: 200px;
  }
}

.card-horizontal:hover .card-image {
  @apply scale-105;
}

.card-content {
  @apply flex flex-col gap-1 flex-1 px-4 py-3 max-md:px-6 max-md:py-5 max-md:items-center;
}

.card-title {
  @apply text-[1.1rem] font-bold leading-[1.3] m-0 overflow-hidden line-clamp-2 max-md:text-xl max-md:leading-normal;
}

.card-meta {
  @apply flex items-center gap-2 text-[0.85rem] max-md:text-[0.95rem];
}

.fresh-icon {
  @apply text-sky-500 text-[1.1rem];
}

.card-description {
  @apply text-[0.85rem] leading-[1.3] m-0 overflow-hidden line-clamp-2 max-md:text-base max-md:leading-relaxed;
}

.card-content :deep(.tag-list) {
  @apply mt-2 mb-0 gap-[0.35rem] justify-start max-md:justify-center;
}

.card-content :deep(.tag-pill) {
  @apply px-[0.6rem] py-1 text-xs;
}

.button-wrapper {
  @apply mt-2 inline-block max-md:block max-md:text-center;
}

.button-icon {
  @apply text-base text-white;
}
</style>
