<script setup lang="ts">
import { ref } from "vue";
import "github-markdown-css/github-markdown.css";
// import { Buffer } from "buffer";
import { withoutTrailingSlash } from "ufo";

const route = useRoute();
const currentPath = computed(() => `https://nuxtation.vercel.app${route.fullPath}`);
const { data: article } = await useAsyncData("home", () =>
  queryContent()
    .where({ _path: { $eq: withoutTrailingSlash(route.fullPath) } })
    .findOne()
);

const description = ref("annrieのNuxt,Vueを中心にしたポートフォリオサイト");
const ogTitle = ref("annrie's Nuxtation");
const twitterDescription = ref("Nuxt, contentで構築したブログサイト");
// const twitterCard = "summary_large_image";
const twitterImage = ref("/twitter-card.png");
// const twitterSite = ref("@muraie_jin");
// const mySite = ref("https://nuxtation.vercel.app/");
const ogLocale = ref("ja_JP");
const siteName = ref("Nuxtation");
const appleMobileWebAppStatusBarStyle = "black-translucent";

defineRobotMeta();

// let encoded1 = Buffer.from(`${ogTitle.value}`)
//   .toString("base64")
//   .replace(/\s/g, "+")
//   .replace(/=/g, "");

useHead({
  titleTemplate: (productCategory: string) => {
    return productCategory ? `${productCategory} - Nuxtation` : "Nuxtation";
  },
  htmlAttrs: {
    lang: "ja",
  },
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
  ],
  meta: [
    {
      property: "og:url",
      content: currentPath,
    },
  ],
});
// const ogImageOptions = {
//   component: "Og",
//   title: "Nuxtation",
//   width: 1200,
//   height: 630,
//   fit: "cover",
//   format: "png",
//   background: "rgb:ffffff",
// };
useSeoMeta({
  description: () => `${article?.value?.description ?? description.value}`,
  // twitterCard: () => `${twitterCard}`,
  // twitterSite: () => `${twitterSite.value}`,
  twitterTitle: () => `${ogTitle.value}`,
  twitterDescription: () => `${twitterDescription.value}`,
  // twitterImageSrc: () => `${twitterImageSrc.value}`,
  twitterImage: () =>
    `${twitterImage.value}?txt=${ogTitle.value}&txt-size=62&txt-color=blue&txt-shad=10&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&fit=crop&blur=80&auto=format,compress`,
  ogSiteName: () => `${siteName.value}`,
  // ogUrl: () => `${appConfig.siteMetadata.MySite}`,
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
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp();
// defineOgImage(ogImageOptions);
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtLoadingIndicator />
    <!-- <OgImage /> -->
    <TheTopBar />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppFooter />
    <!-- <ClientOnly> -->
    <div v-if="$pwa?.offlineReady || $pwa?.needRefresh" class="pwa-toast" role="alert">
      <div class="message">
        <span v-if="$pwa.offlineReady"> App ready to work offline </span>
        <span v-else> New content available, click on reload button to update. </span>
      </div>
      <button v-if="$pwa.needRefresh" @click="$pwa.updateServiceWorker()">Reload</button>
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
    <!-- </ClientOnly> -->
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
