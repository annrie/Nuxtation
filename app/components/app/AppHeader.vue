<script setup lang="ts">
const appConfig = useAppConfig();
const site = useSiteConfig();
const colorMode = useColorMode();

const isSearchModalOpen = useState('search-modal-open', () => false);

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

const openSearchModal = () => {
  isSearchModalOpen.value = true;
};
</script>

<template>
  <UHeader
    :ui="{
      root: 'bg-gray-900 dark:bg-gray-900 border-gray-800 dark:border-gray-800',
      container: 'bg-gray-900 dark:bg-gray-900',
      center: 'hidden lg:flex flex-1',
      right: 'flex items-center gap-3',
      content: 'bg-gray-900',
      body: 'bg-transparent',
      overlay: 'bg-gray-900/80 backdrop-blur'
    }"
    class="custom-header"
    to="/"
    :title="appConfig.header?.title || site.name"
  >
    <AppHeaderCenter />

    <template #title>
      <AppHeaderLogo class="h-6 w-auto shrink-0" />
    </template>

    <template #right>
      <UButton
        icon="i-heroicons-magnifying-glass"
        color="white"
        variant="ghost"
        aria-label="検索"
        title="検索"
        :ui="{
          base: '!ring-0 !border-0 !shadow-none touch-manipulation focus:!outline-none focus:!ring-2 focus:!ring-white/50',
          icon: { size: { md: 'w-5 h-5' } }
        }"
        class="!min-w-[44px] !min-h-[44px]"
        @click="openSearchModal"
      />

      <ClientOnly>
        <UButton
          :icon="colorModeIcon"
          color="white"
          variant="ghost"
          :aria-label="colorModeLabel"
          :title="colorModeLabel"
          :ui="{
            base: '!ring-0 !border-0 !shadow-none touch-manipulation focus:!outline-none focus:!ring-2 focus:!ring-white/50',
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
              base: '!ring-0 !border-0 !shadow-none touch-manipulation focus:!outline-none focus:!ring-2 focus:!ring-white/50',
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
            base: '!ring-0 !border-0 !shadow-none touch-manipulation focus:!outline-none focus:!ring-2 focus:!ring-white/50',
            icon: { size: { md: 'w-5 h-5' } }
          }"
          class="!min-w-[44px] !min-h-[44px]"
        />
      </template>
    </template>

    <template #body>
      <AppHeaderBody />
    </template>
  </UHeader>
</template>

<style scoped>
@reference "tailwindcss";

/* ui プロップで制御するため、最小限のスタイルのみ */

/* ロゴリンクのフォーカススタイル */
:deep(a[href="/"]) {
  @apply outline-none rounded transition-all;
}

:deep(a[href="/"]:focus) {
  @apply outline outline-2 outline-white/50 outline-offset-2;
}

/* モバイルメニュー開閉ボタンのアイコン色 */
:deep(button[aria-expanded] *) {
  @apply text-white fill-white stroke-white;
}
</style>
