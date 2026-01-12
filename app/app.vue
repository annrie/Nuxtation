<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
import { withoutTrailingSlash } from "ufo";

// 検索モーダルを遅延読み込み
const SearchModal = defineAsyncComponent(() => import('~/components/SearchModal.vue'))

const isSearchModalOpen = useState('search-modal-open', () => false);

// Phase 20: onNuxtReady トリガーに変更したため、手動読み込みコードは不要
// サードパーティスクリプトはnuxt.config.tsで自動的に最適なタイミングで読み込まれる

const { path } = useRoute()
const mySite = 'https://nuxtation.phantomoon.com'
const canonical = computed(() => {
  if (path === '/') return mySite
  const { href: canonical } = new URL(path, mySite)
  return canonical
})
const { data: article } = useLazyAsyncData("home", () =>
  queryCollection()
    .where({ path: withoutTrailingSlash(route.fullPath) })
    .first()
)

const description = ref("Nuxt.js, Vue.jsについての記事及び作家山田正紀の著作の紹介をしているサイトです。 - Phantomoon Annex")
const ogTitle = ref("Nuxtation")
const twitterDescription = ref("Nuxt.js, Vue.jsについての記事及び作家山田正紀の著作の紹介をしているサイトです。")
const twitterCard = ref("https://nuxtation.imgix.net/ogp.png")
const twitterImage = ref("https://nuxtation.imgix.net/ogp.png")
const siteName = ref("Nuxtation")
const ogLocale = ref("ja_JP")
const appleMobileWebAppStatusBarStyle = "black-translucent"

useHead({
  titleTemplate: (titleChunk: string) => {
    return titleChunk ? `${titleChunk} - Nuxtation` : "Nuxtation";
  },
  htmlAttrs: {
    lang: "ja",
  },
  charset: 'utf-8',
  title: ogTitle,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'canonical',
      href: canonical.value,
    },
  ],
  meta: [
    {
      name: 'description',
      content:
          description,
    },
    {
      property: "og:url",
      content: mySite,
    },
    { property: 'og:site_name', content: mySite },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: mySite,
    },
    {
      property: 'og:title',
      content: ogTitle
      ,
    },
    {
      property: 'og:description',
      content:
          description,
    },
    {
      property: 'og:image',
      content: twitterCard,
    },
    { name: 'twitter:site', content: '@muraie_jin' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: mySite,
    },
    {
      name: 'twitter:title',
      content: ogTitle,
    },
    {
      name: 'twitter:description',
      content: twitterDescription,
    },
    {
      name: 'twitter:image',
      content: twitterCard,
    },
  ],
});
useSeoMeta({
  description: () => `${article?.value?.description ?? description.value}`,
  twitterTitle: () => `${ogTitle.value}`,
  twitterDescription: () => `${twitterDescription.value}`,
  twitterImage: () =>
    `${twitterImage.value}?txt=${ogTitle.value}&txt-size=62&txt-color=blue&txt-shad=10&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&fit=crop&blur=80&auto=format,compress`,
  ogSiteName: () => `${siteName.value}`,
  ogTitle: () => `${ogTitle.value}`,
  ogDescription: () => `${description.value}`,
  ogType: () => "website",
  ogLocale: () => `${ogLocale.value}`,
  ogImage: () =>
    `${twitterImage.value}?txt=${ogTitle.value}&txt-size=62&txt-color=blue&txt-shad=10&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&fit=crop&blur=80&auto=format,compress`,
  ogImageWidth: () => 1280,
  ogImageHeight: () => 640,
  appleMobileWebAppStatusBarStyle,
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />

    <!-- Search Modal (遅延読み込み) -->
    <SearchModal v-model:is-open="isSearchModalOpen" />
  </NuxtLayout>
  <Analytics />
</template>
