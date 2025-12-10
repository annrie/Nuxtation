<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()

const links = computed(() => [
  ...Object.entries(appConfig.socials || {}).map(([key, url]) => ({
    'icon': `i-simple-icons-${key}`,
    'to': url,
    'target': '_blank',
    'aria-label': `${key} social link`,
  })),
  appConfig.github && appConfig.github.url && {
    'icon': 'i-simple-icons-github',
    'to': appConfig.github.url,
    'target': '_blank',
    'aria-label': 'GitHub repository',
  },
].filter(Boolean))

const colorModeIcon = computed(() => {
  if (colorMode.preference === 'system') {
    return 'i-lucide-monitor'
  }
  return colorMode.value === 'dark'
    ? 'i-lucide-moon'
    : 'i-lucide-sun'
})

const colorModeLabel = computed(() => {
  const labels = {
    light: 'ライトモード',
    dark: 'ダークモード',
    system: 'システム設定に追従'
  }
  return labels[colorMode.preference as keyof typeof labels] || 'カラーモード'
})

const cycleColorMode = () => {
  const modes = ['light', 'dark', 'system'] as const
  const currentIndex = modes.indexOf(colorMode.preference as any)
  const nextIndex = (currentIndex + 1) % modes.length
  colorMode.preference = modes[nextIndex]
}
</script>

<template>
  <template v-if="links.length">
    <UButton
      v-for="(link, index) of links"
      :key="index"
      size="sm"
      v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
    />
  </template>
  <UButton
    :icon="colorModeIcon"
    size="sm"
    color="neutral"
    variant="ghost"
    :aria-label="colorModeLabel"
    :title="colorModeLabel"
    @click="cycleColorMode"
  />
</template>
