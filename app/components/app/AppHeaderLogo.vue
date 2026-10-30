<script setup lang="ts">
const appConfig = useAppConfig()
// Docus の型（@nuxt/schema の AppConfig の header.logo）には width / height が無い。入れ子のプロパティは型の拡張で
// 足せないので、app.config.ts で足した 2 つをここで型に加えて読む
type HeaderLogo = NonNullable<typeof appConfig.header>['logo'] & { width?: number, height?: number }
const logo = computed(() => appConfig.header?.logo as HeaderLogo | undefined)
const hasLogo = computed(() => !!(logo.value?.light || logo.value?.dark))
</script>

<template>
  <span class="header-logo">
    <!-- width / height は app.config.ts のロゴの寸法。読み込む前から縦横比が決まるので、届くまで幅が 0 のままにならない -->
    <img
      v-if="hasLogo"
      :src="logo?.light || logo?.dark"
      :alt="logo?.alt || appConfig.header?.title || 'Logo'"
      :width="logo?.width"
      :height="logo?.height"
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
