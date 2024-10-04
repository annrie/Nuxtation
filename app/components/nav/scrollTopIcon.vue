<template>
  <div
    :class="[
      'fixed flex flex-col items-center w-section_x z-20 bottom-[50px] right-1 text-black transform duration-150',
      isVisible ? '' : 'translate-x-full',
    ]"
  >
    <a
      href="#"
      aria-label="Scroll to Top"
      class="flex flex-col items-center py-2 text-center"
    >
      <!-- <span class="text-xxs leading-xxs uppercase text-highlight sm:w-6/12"
        >Scroll to Top</span
      > -->
      <IconCircleUpRounded
        text-jis-red
        text-36px
        hover:(bg-transparent
        text-jis-blue-400)
      />
      <!-- <IconsArrowUp class="w-4 h-4" width="16" height="16" /> -->
    </a>
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
