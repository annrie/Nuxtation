<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "ja",
  },
  link: [
    {
      rel: "canonical",
      href: "https://nuxtation.phantomoon.com",
    },
  ],
});
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <TheTopBar />
    <main id="main" class="mx-auto px-2 md:px-4 lg:container">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
