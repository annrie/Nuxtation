<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<template>
  <div>
    <SpeedInsights />
    <main id="main" class="mx-auto mt-2 text-center mb-6 home md:px-4 lg:container">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
