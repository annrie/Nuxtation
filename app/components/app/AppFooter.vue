<script setup lang="ts">
const appConfig = useAppConfig();
const colorMode = useColorMode();

const isMounted = ref(false);

onMounted(async () => {
  // ハイドレーション完了後に遅延実行
  await nextTick();
  isMounted.value = true;
});

const colorModeIcon = computed(() => {
  // SSRとハイドレーション中は固定値を返す
  if (import.meta.server || !isMounted.value) {
    return 'i-lucide-monitor';  // デフォルトはシステム設定
  }
  // ハイドレーション完了後にのみ実際のカラーモードを反映
  if (colorMode.preference === "system") {
    return "i-lucide-monitor";
  }
  return colorMode.value === "dark"
    ? "i-lucide-moon"
    : "i-lucide-sun";
});

const colorModeLabel = computed(() => {
  if (colorMode.preference === "system") {
    return "システム設定";
  }
  return colorMode.value === "dark" ? "ダークモード" : "ライトモード";
});

const cycleColorMode = () => {
  // system → light → dark → system のサイクル
  if (colorMode.preference === "system") {
    colorMode.preference = "light";
  } else if (colorMode.preference === "light") {
    colorMode.preference = "dark";
  } else {
    colorMode.preference = "system";
  }
};

const links = computed(() =>
  appConfig.github && appConfig.github.url
    ? [
        {
          icon: "i-simple-icons-github",
          to: appConfig.github.url,
          target: "_blank",
          "aria-label": "GitHub",
        },
      ]
    : []
);
</script>

<template>
  <UFooter
    :ui="{
      root: 'bg-gray-900 dark:bg-gray-900 border-gray-800 dark:border-gray-800',
      container: 'bg-gray-900 dark:bg-gray-900'
    }"
    class="custom-footer"
  >
    <template #left>
      <span class="text-sm">
        © {{ new Date().getFullYear() }} Nuxtation. All rights reserved.
      </span>
    </template>

    <template #right>
      <ClientOnly>
        <UButton
          :icon="colorModeIcon"
          color="white"
          variant="ghost"
          :aria-label="colorModeLabel"
          :title="colorModeLabel"
          :ui="{
            base: 'touch-manipulation',
            icon: { size: { md: 'w-5 h-5' } }
          }"
          class="!min-w-[44px] !min-h-[44px]"
          @click="cycleColorMode"
        />
        <template #fallback>
          <UButton
            icon="i-lucide-monitor"
            color="white"
            variant="ghost"
            aria-label="システム設定"
            title="システム設定"
            :ui="{
              base: 'touch-manipulation',
              icon: { size: { md: 'w-5 h-5' } }
            }"
            class="!min-w-[44px] !min-h-[44px]"
          />
        </template>
      </ClientOnly>

      <template v-if="links?.length">
        <UButton
          v-for="(link, index) of links"
          :key="link.to"
          v-bind="{ color: 'white', variant: 'ghost', ...link }"
          :ui="{
            base: 'touch-manipulation',
            icon: { size: { md: 'w-5 h-5' } }
          }"
          class="!min-w-[44px] !min-h-[44px]"
        />
      </template>
    </template>
  </UFooter>
</template>

<style scoped>
/* ui プロップで制御するため削除 */
</style>
