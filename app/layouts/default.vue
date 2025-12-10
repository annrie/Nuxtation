<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
// ColorModeを初期化して、SSR時のハイドレーションミスマッチを防ぐ
const colorMode = useColorMode()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <a href="#main-content" class="skip-link">
      メインコンテンツへスキップ
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <SpeedInsights />
  </div>
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  font-weight: 600;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
