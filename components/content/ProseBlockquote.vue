<script lang="ts">
import { TwitterWindow } from "~/types";
declare const window: TwitterWindow;
</script>
<script setup lang="ts">
useHead({
  script: [
    {
      type: "text/javascript",
      async: true,
      src: "https://platform.twitter.com/widgets.js",
    },
  ],
});

onMounted(() => {
  window.twttr.widgets.load();
});
</script>

<template>
  <blockquote>
    <slot />
  </blockquote>
</template>
