<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
  propsUrl: String,
  title: String,
  siteUrl: String,
  description: String,
})

const isDevRun = import.meta.env.DEV
const ogpData = ref(null)

if (isDevRun) {
  onMounted(async () => {
    try {
      const data = await $fetch(
        `/api/ogp?url=${encodeURIComponent(props.propsUrl)}`,
      )
      ogpData.value = data
    }
    catch (error) {
      console.error('Fetch error:', error)
    }
  })
}
else {
  const { data, error } = await useFetch(
    `/api/ogp?url=${encodeURIComponent(props.propsUrl)}`,
  )

  if (error.value) {
    console.error('Fetch error:', error.value)
  }
  else {
    ogpData.value = data.value
  }
}

const maxLength = 40

const limitedTitle = computed(() => {
  if (!ogpData.value) return ''
  const base = ogpData.value.ogTitle || props.title || ''
  return base.length > maxLength ? `${base.substring(0, maxLength)}...` : base
})

const limitedDescription = computed(() => {
  if (!ogpData.value) return ''
  const base = ogpData.value.ogDescription || props.description || ''
  const maxDescLength = 120
  return base.length > maxDescLength ? `${base.substring(0, maxDescLength)}...` : base
})
</script>

<template>
  <div class="link-card-root">
    <UCard
      v-if="ogpData"
      :ui="{
        root: 'overflow-hidden rounded-md ring-1 ring-gray-200 dark:ring-gray-800 hover:ring-gray-300 dark:hover:ring-gray-700 transition-colors duration-200 bg-white dark:bg-gray-900',
        body: 'p-0 sm:p-0',
        header: 'p-0 sm:p-0',
      }"
      class="my-3 not-prose"
    >
      <NuxtLink
        :to="propsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="block text-inherit m-0 p-0 link-card-link"
      >
        <div class="link-card-content">
          <div class="link-card-image">
            <img
              :src="ogpData.ogImage?.[0]?.url || '/img/ogp.png'"
              :alt="limitedTitle || 'リンク先のサムネイル画像'"
            >
          </div>
          <div class="link-card-text">
            <h3 class="link-card-title">
              {{ limitedTitle }}
            </h3>
            <p class="link-card-description">
              {{ limitedDescription }}
            </p>
            <p class="link-card-url">
              {{ ogpData.ogUrl || props.siteUrl || propsUrl }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </UCard>
    <div v-else class="flex items-center gap-2 p-4 text-gray-500/70 dark:text-slate-400/70 text-sm">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
      <span>Loading link card...</span>
    </div>
  </div>
</template>

<style scoped>
.link-card-root {
  width: 100%;
}
@reference "tailwindcss";

.link-card-content {
  @apply grid grid-cols-1 gap-0 items-stretch;
}

@media (min-width: 768px) {
  .link-card-content {
    @apply grid-cols-[200px_1fr] h-[113px];
  }
}

.link-card-image {
  @apply relative w-full aspect-video overflow-hidden bg-gray-200/30 dark:bg-slate-700/70 block leading-none;
}

@media (min-width: 768px) {
  .link-card-image {
    @apply w-[200px] h-[113px] aspect-auto flex-shrink-0;
  }
}

.link-card-image img {
  @apply w-full h-full object-cover object-center block align-top m-0 p-0;
}

.link-card-text {
  @apply flex flex-col justify-start;
  padding: 0 0.75rem 0.5rem 0.75rem;
  gap: 0.25rem;
}

.link-card-title {
  font-size: 1rem !important;
  font-weight: 600;
  color: #0f172a;
  margin: 0 !important;
  line-height: 1.3 !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.link-card-description {
  @apply text-xs text-gray-600/90 dark:text-gray-400/90 m-0 leading-normal line-clamp-2;
}

.link-card-url {
  font-size: 0.6875rem;
  color: rgba(107, 114, 128, 0.8);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark .link-card-title {
  color: #e2e8f0;
}

.dark .link-card-url {
  color: rgba(148, 163, 184, 0.8);
}

/* リンクの下線を削除 */
.link-card-link {
  text-decoration: none !important;
}

.link-card-link:hover {
  text-decoration: none !important;
}

/* 外部リンクアイコンを非表示 */
.link-card-link :deep(.icon-external),
.link-card-link :deep([class*="external"]),
.link-card-link::after,
.link-card-link :deep(svg),
.link-card-link :deep(.icon),
.link-card-link :deep(a[target="_blank"]::after),
.link-card-link :deep(a[rel*="noopener"]::after) {
  display: none !important;
}
</style>
