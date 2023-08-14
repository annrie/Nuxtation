<script setup lang="ts">
import { appName } from "~/constants";
useHead({
  htmlAttrs: {
    lang: "ja",
  },
  link: [
    {
      rel: "canonical",
      href: "https://nuxtation.phantomoon.com/",
    },
  ],
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <!-- <VitePwaManifest /> -->
    <TheTopBar />
    <main id="main" class="mx-auto px-2 md:px-4 lg:container">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
