<script setup lang="ts">
const description = ref("annrieのNuxt,Vueを中心にしたポートフォリオサイト");
const ogTitle = ref("annrie's Nuxtation");
const twitterDescription = ref("Nuxt, contentで構築したブログサイト");
const twitterCard = ref("summary_large_image");
const twitterImage = ref("https://nuxtation.vercel.app/twitter-card.png");
const twitterSite = ref("@muraie_jin");
const mySite = ref("https://nuxtation.vercel.app/");
const siteName = ref("Nuxtation");
const appleMobileWebAppStatusBarStyle = "black-translucent";

useHead({
  titleTemplate: (productCategory) => {
    return productCategory ? `${productCategory} - Nuxtation` : "Nuxtation";
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
      sizes: "any",
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
useSeoMeta({
  description,
  ogSiteName: () => `${siteName.value}`,
  ogType: () => "website",
  ogUrl: () => `${mySite.value}`,
  ogTitle,
  ogDescription: () => `${description.value}`,
  ogImage: () => `${twitterImage.value}`,
  twitterSite: () => `${twitterSite.value}`,
  twitterCard: () => `${twitterCard.value}`,
  twitterTitle: () => `${ogTitle.value}`,
  twitterDescription: () => `${twitterDescription.value}`,
  twitterImage: () => `${twitterImage.value}`,
  appleMobileWebAppStatusBarStyle,
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <!-- <VitePwaManifest /> -->
    <TheTopBar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
  </div>
</template>
