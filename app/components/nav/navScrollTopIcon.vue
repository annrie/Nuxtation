<template>
  <div
    :class="[
      'fixed flex flex-col items-center w-section_x z-20 bottom-[50px] right-1 transform duration-150',
      isVisible ? '' : 'translate-x-full',
    ]"
  >
    <NuxtLink
      to="#main"
      aria-label="Scroll to Top"
      class="flex flex-col items-center py-2 text-center"
    >
      <IconCircleUpRounded
        text-red
        w-56px
        h-56px
        hover:(text-lightblue-600 dark:text-fuchsia-200)
      />
    </NuxtLink>
  </div>
</template>

<script setup>
import IconCircleUpRounded from "~icons/material-symbols/arrowCircleUp";

// Scroll handling
import { onUnmounted, ref, nextTick } from "vue";
const isVisible = ref(false);
const handleScroll = () => {
  // Only run the code if we are on the client
  if (typeof window !== "undefined") {
    const st = window.scrollY || document.documentElement.scrollTop;
    isVisible.value = st > window.innerHeight / 2;
  }
};
if (typeof window !== "undefined") {
  window.addEventListener("scroll", handleScroll);
  nextTick(() => handleScroll());
}
onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>
