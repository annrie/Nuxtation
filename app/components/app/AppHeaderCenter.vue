<script setup lang="ts">
const appConfig = useAppConfig();
const route = useRoute();

const openDropdown = ref<string | null>(null);

const navigationItems = computed(() => {
  const links = appConfig.header?.links || [];
  return links.map((link: any) => ({
    label: link.label,
    to: link.to,
    children: link.children || [],
    active: route.path === link.to || (link.to !== "/" && route.path.startsWith(link.to)),
  }));
});

const toggleDropdown = (label: string) => {
  openDropdown.value = openDropdown.value === label ? null : label;
};

const closeDropdown = () => {
  openDropdown.value = null;
};

const isOpen = (label: string) => openDropdown.value === label;

const handleParentClick = (item: any) => {
  // 親要素をクリックしたときにそのページに遷移
  navigateTo(item.to);
};

// キーボードナビゲーション対応
const handleKeydown = (event: KeyboardEvent, item: any, index: number) => {
  const key = event.key;

  // Escapeでドロップダウンを閉じる
  if (key === 'Escape') {
    event.preventDefault();
    closeDropdown();
  }
  // Enter/Spaceでドロップダウンをトグルまたは遷移
  else if (key === 'Enter' || key === ' ') {
    event.preventDefault();
    if (item.children.length) {
      if (isOpen(item.label)) {
        // 既に開いている場合は親ページに遷移
        handleParentClick(item);
      } else {
        // 閉じている場合は開く
        toggleDropdown(item.label);
      }
    } else {
      navigateTo(item.to);
    }
  }
  // 矢印キーでのナビゲーション
  else if (key === 'ArrowLeft' || key === 'ArrowRight') {
    event.preventDefault();
    const direction = key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + navigationItems.value.length) % navigationItems.value.length;
    const buttons = document.querySelectorAll('nav button[type="button"], nav a');
    const nextButton = buttons[nextIndex] as HTMLElement;
    if (nextButton) {
      nextButton.focus();
      closeDropdown();
    }
  }
  else if (key === 'ArrowDown' && item.children.length) {
    event.preventDefault();
    if (!isOpen(item.label)) {
      toggleDropdown(item.label);
    }
    // 次のティックでサブメニューの最初のリンクにフォーカス
    nextTick(() => {
      const dropdown = event.currentTarget as HTMLElement;
      const firstLink = dropdown.parentElement?.querySelector('.block.px-4') as HTMLElement;
      if (firstLink) {
        firstLink.focus();
      }
    });
  }
};

// サブメニュー内での矢印キーナビゲーション
const handleSubmenuKeydown = (event: KeyboardEvent, childIndex: number, totalChildren: number) => {
  const key = event.key;

  if (key === 'Escape') {
    event.preventDefault();
    closeDropdown();
  }
  else if (key === 'ArrowDown') {
    event.preventDefault();
    const nextIndex = (childIndex + 1) % totalChildren;
    const currentLink = event.currentTarget as HTMLElement;
    const allLinks = currentLink.parentElement?.parentElement?.querySelectorAll('.block.px-4');
    if (allLinks && allLinks[nextIndex]) {
      (allLinks[nextIndex] as HTMLElement).focus();
    }
  }
  else if (key === 'ArrowUp') {
    event.preventDefault();
    const prevIndex = (childIndex - 1 + totalChildren) % totalChildren;
    const currentLink = event.currentTarget as HTMLElement;
    const allLinks = currentLink.parentElement?.parentElement?.querySelectorAll('.block.px-4');
    if (allLinks && allLinks[prevIndex]) {
      (allLinks[prevIndex] as HTMLElement).focus();
    }
  }
};
</script>

<template>
  <nav v-if="navigationItems.length" class="flex items-center gap-3">
    <template v-for="(item, index) in navigationItems" :key="item.to">
      <!-- 子要素がない場合: 通常のリンク -->
      <NuxtLink
        v-if="!item.children.length"
        :to="item.to"
        class="px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg outline-none"
        :class="item.active
          ? 'bg-emerald-900/30 !text-emerald-300'
          : '!text-gray-300 hover:!bg-gray-800 hover:!text-emerald-400'"
        :aria-label="`${item.label}ページへ移動`"
        :aria-current="item.active ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>

      <!-- 子要素がある場合: ドロップダウン -->
      <div
        v-else
        class="relative"
        @mouseenter="openDropdown = item.label"
        @mouseleave="closeDropdown"
      >
        <button
          type="button"
          class="flex items-center gap-1 px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg outline-none"
          :class="item.active
            ? 'bg-primary-900/30 !text-primary-300'
            : '!text-gray-300 hover:!bg-gray-800 hover:!text-primary-400'"
          :aria-expanded="isOpen(item.label)"
          :aria-haspopup="item.children.length > 0"
          :aria-label="`${item.label}メニュー`"
          @click="handleParentClick(item)"
          @keydown="handleKeydown($event, item, index)"
        >
          {{ item.label }}
          <Icon
            name="heroicons:chevron-down-20-solid"
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isOpen(item.label) }"
          />
        </button>

        <!-- ドロップダウンメニュー -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="isOpen(item.label)"
            class="absolute z-50 mt-2 w-64 rounded-lg shadow-lg ring-1 !bg-gray-800 !ring-gray-700"
            :class="index >= navigationItems.length - 2 ? 'right-0' : 'left-0'"
          >
            <div class="py-1">
              <NuxtLink
                v-for="(child, childIndex) in item.children"
                :key="child.to"
                :to="child.to"
                class="block px-4 py-2 text-sm !text-gray-300 transition-colors hover:!bg-gray-700 hover:!text-emerald-400 outline-none"
                :aria-label="`${child.label}ページへ移動`"
                @click="closeDropdown"
                @keydown="handleSubmenuKeydown($event, childIndex, item.children.length)"
              >
                {{ child.label }}
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </template>
  </nav>
</template>

<style scoped>
/* ナビゲーションリンクのフォーカススタイル */
nav a:focus,
nav button:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* ドロップダウンメニュー内のリンクのフォーカススタイル */
.absolute a:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: -2px;
  background-color: rgba(55, 65, 81, 0.5) !important;
}
</style>
