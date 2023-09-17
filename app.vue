<script setup lang="ts">
import { ref } from "vue";

const description = ref("annrieのNuxt,Vueを中心にしたポートフォリオサイト");
const ogTitle = ref("annrie's Nuxtation");
const twitterDescription = ref("Nuxt, contentで構築したブログサイト");
const twitterCard = "summary_large_image";
// const twitterImage = ref("https://nuxtation.vercel.app/twitter-card.png");
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
      href: "https://nuxtation.vercel.app/",
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
const ogImageOptions = {
  title: "Nuxtation",
  width: 1200,
  height: 630,
  fit: "cover",
  format: "png",
  background: "rgb:ffffff",
};
useSeoMeta({
  description,
  ogSiteName: () => `${siteName.value}`,
  ogType: () => "website",
  ogUrl: () => `${mySite.value}`,
  ogTitle,
  ogDescription: () => `${description.value}`,
  // ogImage: () => `${twitterImage.value}`,
  twitterSite: () => `${twitterSite.value}`,
  twitterCard,
  twitterTitle: () => `${ogTitle.value}`,
  twitterDescription: () => `${twitterDescription.value}`,
  //twitterImage: () => `${twitterImage.value}`,
  appleMobileWebAppStatusBarStyle,
});
defineOgImage(ogImageOptions);
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtLoadingIndicator />
    <OgImage v-bind="ogImageOptions" />
    <TheTopBar />
    <NuxtLayout>
      <NuxtPage />
      <!-- <NuxtPage :page-key="(route) => route.fullPath" /> -->
    </NuxtLayout>
    <AppFooter />
    <ClientOnly>
      <div v-if="$pwa?.offlineReady || $pwa?.needRefresh" class="pwa-toast" role="alert">
        <div class="message">
          <span v-if="$pwa.offlineReady"> App ready to work offline </span>
          <span v-else> New content available, click on reload button to update. </span>
        </div>
        <button v-if="$pwa.needRefresh" @click="$pwa.updateServiceWorker()">
          Reload
        </button>
        <button @click="$pwa.cancelPrompt()">Close</button>
      </div>
      <div
        v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
        class="pwa-toast"
        role="alert"
      >
        <div class="message">
          <span> Install PWA </span>
        </div>
        <button @click="$pwa.install()">Install</button>
        <button @click="$pwa.cancelInstall()">Cancel</button>
      </div>
    </ClientOnly>
  </div>
</template>
<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}
</style>
