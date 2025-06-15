<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps(['nav', 'isActive']);
const emit = defineEmits(['mouseEnter', 'mouseLeave']);

const router = useRouter();
const isHovered = ref(false);
const isSubmenuOpen = ref(false);
const submenuTimeout = ref(null);

const handleMouseEnter = () => {
  isHovered.value = true;
  emit('mouseEnter');
  clearTimeout(submenuTimeout.value);
  isSubmenuOpen.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
  emit('mouseLeave');
  submenuTimeout.value = setTimeout(() => {
    isSubmenuOpen.value = false;
  }, 300); // 300ミリ秒の遅延を設定
};

const handleSubmenuMouseEnter = () => {
  clearTimeout(submenuTimeout.value);
  isSubmenuOpen.value = true;
};

const handleSubmenuMouseLeave = () => {
  submenuTimeout.value = setTimeout(() => {
    isSubmenuOpen.value = false;
  }, 300); // 300ミリ秒の遅延を設定
};

const handleLinkClick = (url: string, event: Event) => {
  if (url) {
    event.preventDefault();
    router.push(url);
  }
};

watch(isSubmenuOpen, (newValue) => {
  if (newValue) {
    emit('mouseEnter');
  } else {
    emit('mouseLeave');
  }
});
</script>

<template>
  <li
    class="relative group w-auto"
    role="none"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <NuxtLink
      :href="nav.url"
      class="block px-16ptr py-8ptr text-lg font-medium transition-colors duration-200 hover:text-jis-red text-white"
      :class="{ 'text-white': isActive || isHovered }"
      :aria-expanded="isSubmenuOpen.toString()"
      :aria-haspopup="nav.items && nav.items.length > 0 ? 'true' : 'false'"
      @click="handleLinkClick(nav.url, $event)"
    >
      {{ nav.link }}
    </NuxtLink>
    <Transition
      enter="transition-all duration-200 ease-out"
      enter-from="opacity-0 translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition-all duration-150 ease-in"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 translate-y-1"
    >
      <ul
        v-if="isSubmenuOpen && nav.items && nav.items.length > 0"
        class="w-230px sm:(absolute left-0 bg-gray-700  rounded-md) tb:mt-4ptr tb:bg-gray-800 shadow-lg py-16ptr z-10"
        role="menu"
        @mouseenter="handleSubmenuMouseEnter"
        @mouseleave="handleSubmenuMouseLeave"
      >
        <li v-for="submenu in nav.items" :key="submenu.id" role="none">
          <NuxtLink
            :href="submenu.url"
            class="block px-16ptr py-8ptr text-sm text-white hover:bg-gray-700 hover:text-white"
            @click.prevent="handleLinkClick(submenu.url, $event)"
            role="menuitem"
          >
            {{ submenu.link }}
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </li>
</template>