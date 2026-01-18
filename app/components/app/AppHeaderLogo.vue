<script setup lang="ts">
const appConfig = useAppConfig();
const hasLogo = computed(() => !!(appConfig.header?.logo?.light || appConfig.header?.logo?.dark));
</script>

<template>
  <span class="header-logo">
    <img
      v-if="hasLogo"
      :src="appConfig.header?.logo?.light || appConfig.header?.logo?.dark"
      :alt="appConfig.header?.logo?.alt || appConfig.header?.title || 'Logo'"
      class="logo-img"
    >
    <span v-else class="logo-text">
      {{ appConfig.header?.title || 'Nuxtation' }}
    </span>
  </span>
</template>

<style scoped>
.header-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
}

.logo-img {
  display: block;
  width: auto;
  height: 2.5rem;
  min-height: 2.5rem;
  max-height: 2.5rem;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 600;
  font-size: 1.125rem;
  color: #fff;
}
</style>
