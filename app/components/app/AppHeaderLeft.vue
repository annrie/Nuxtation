<script setup lang="ts">
const appConfig = useAppConfig()
const site = useSiteConfig()
const { localePath } = useDocusI18n()

const ariaLabel = appConfig.header?.title || site.name
</script>

<template>
  <NuxtLink
    :to="localePath('/')"
    :aria-label="ariaLabel"
    class="outline-none rounded transition-all focus:outline focus:outline-2 focus:outline-white/50 focus:outline-offset-2"
  >
    <AppHeaderLogo class="h-8 w-auto shrink-0" />
  </NuxtLink>
</template>
