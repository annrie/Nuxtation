<script setup lang="ts">
import { appName } from "~/constants";

const description = ref('annrieのNuxt,Vueを中心にしたポートフォリオサイト');
const ogTitle = ref('annrie\'s Nuxtation');
const twitterDescription = ref('Nuxt, contentで構築したブログサイト');
const twitterCard = ref('https://nuxtation.vercel.app/twitter-card.png');
const twitterSite = ref('@muraie_jin');
const mySite = ref('https://nuxtation.vercel.app/');
const siteName = ref('Nuxtation');
const  appleMobileWebAppStatusBarStyle = ref('black-translucent');


useHead({
  titleTemplate: (productCategory) => {
    return productCategory
      ? `${productCategory} - Nuxtation`
      : 'Nuxtation'
  },
  htmlAttrs: {
    lang: "ja",
  },
  link: [
    {
      rel: "canonical",
      href: "https://nuxtation.phantomoon.com/",
    },
    {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "any"
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/nuxt.svg",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
    },
   ],
});
useServerSeoMeta({
      description,
      ogSiteName: () =>   `${siteName.value}`,
      ogType: () => "website",
      ogUrl: () => `${mySite.value}`,
      ogTitle,
      ogDescription:  () => `${description.value}`,
      ogImage: ()  =>  `${twitterCard.value}`,
      twitterSite: () => `${twitterSite.value}`,
      twitterCard: () => `summary_large_image`,
       twitterUrl: () => `${mySite.value}`,
       twitterTitle: () => `${ogTitle.value}`,
       twitterDescription: () => `${twitterDescription.value}`,
       twitterImage: () => `${twitterCard.value}`,
       appleMobileWebAppStatusBarStyle
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <!-- <VitePwaManifest /> -->
    <TheTopBar />
    <main id="main" class="mx-auto mt-2 text-center mb-6 home md:px-4 lg:container">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
