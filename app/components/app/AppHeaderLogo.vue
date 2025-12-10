<script setup lang="ts">
const appConfig = useAppConfig()
const hasLogo = computed(() => !!(appConfig.header?.logo?.light || appConfig.header?.logo?.dark))
</script>

<template>
  <img
    v-if="hasLogo"
    :src="appConfig.header?.logo?.light || appConfig.header?.logo?.dark"
    :alt="appConfig.header?.logo?.alt || appConfig.header?.title || 'Logo'"
    class="h-10 w-auto shrink-0 logo-img"
    style="height: 2.5rem !important; min-height: 2.5rem !important; max-height: 2.5rem !important;"
  />
  <span v-else class="font-semibold text-lg text-white">
    {{ appConfig.header?.title || 'Nuxtation' }}
  </span>
</template>

<style scoped>
img.logo-img {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: 2.5rem !important;
  min-height: 2.5rem !important;
  max-height: 2.5rem !important;
  width: auto !important;
  flex-shrink: 0 !important;
}
</style>
