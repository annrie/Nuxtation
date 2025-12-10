<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()

const openDropdown = ref<string | null>(null)

// UHeaderのメニュー状態を取得
const headerMenuOpen = inject<Ref<boolean>>('header-menu-open', ref(false))

const navigationItems = computed(() => {
  const links = appConfig.header?.links || []
  return links.map((link: any) => ({
    label: link.label,
    to: link.to,
    children: link.children || [],
    active: route.path === link.to || (link.to !== '/' && route.path.startsWith(link.to))
  }))
})

const toggleDropdown = (label: string) => {
  openDropdown.value = openDropdown.value === label ? null : label
}

const closeDropdown = () => {
  openDropdown.value = null
}

const closeAllMenus = () => {
  openDropdown.value = null
  // UHeaderのモバイルメニューも閉じる
  headerMenuOpen.value = false
}

const isOpen = (label: string) => openDropdown.value === label

const handleParentClick = (item: any) => {
  // すでに開いている場合は親ページに遷移
  if (isOpen(item.label)) {
    navigateTo(item.to)
    closeAllMenus()
  } else {
    // 閉じている場合は開く
    toggleDropdown(item.label)
  }
}
</script>

<template>
  <nav v-if="navigationItems.length" class="px-4 py-4">
    <div v-for="item in navigationItems" :key="item.to" class="mb-2">
      <!-- 子要素がない場合: 通常のリンク -->
      <NuxtLink
        v-if="!item.children.length"
        :to="item.to"
        class="block px-5 py-3 text-base font-semibold tracking-wide transition-all duration-200 rounded-lg touch-manipulation"
        :class="item.active
          ? 'bg-emerald-900/30 !text-emerald-300'
          : '!text-gray-300 hover:!bg-gray-800 hover:!text-emerald-400 active:!bg-gray-700'"
        style="min-height: 44px; display: flex; align-items: center;"
      >
        {{ item.label }}
      </NuxtLink>

      <!-- 子要素がある場合: アコーディオン -->
      <div v-else>
        <button
          type="button"
          class="flex items-center justify-between w-full px-5 py-3 text-base font-semibold tracking-wide transition-all duration-200 rounded-lg touch-manipulation"
          :class="item.active
            ? 'bg-primary-900/30 !text-primary-300'
            : '!text-gray-300 hover:!bg-gray-800 hover:!text-primary-400 active:!bg-gray-700'"
          style="min-height: 44px;"
          @click="handleParentClick(item)"
        >
          {{ item.label }}
          <Icon
            name="heroicons:chevron-down-20-solid"
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen(item.label) }"
          />
        </button>

        <!-- サブメニュー -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div
            v-if="isOpen(item.label)"
            class="mt-2 ml-4 space-y-2 p-2 rounded-lg !bg-gray-900"
          >
            <NuxtLink
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              class="block px-5 py-3 text-base !text-gray-300 transition-colors rounded-lg hover:!bg-gray-800 hover:!text-emerald-400 active:!bg-gray-700 touch-manipulation"
              style="min-height: 44px; display: flex; align-items: center;"
              @click="closeAllMenus"
            >
              {{ child.label }}
            </NuxtLink>
          </div>
        </Transition>
      </div>
    </div>
  </nav>
</template>
