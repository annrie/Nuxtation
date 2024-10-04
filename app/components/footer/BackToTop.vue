<template>
  <div>
    <a
      href="#main"
      data-smooth-scroll
      class="scrolltop"
      :class="{ 'show-scroll': scrollHeader }"
      @click="scrollTop"
    >
      <MdiArrowUpCircleOutline
        text-red
        text-36px
        />
    </a>
  </div>
</template>

<script setup lang="ts">
import { mdiArrowUpCircleOutline } from "@mdi/js";

const scrollHeader = ref(false);

function showScrollTop() {
  if (window.scrollY >= 460) {
    scrollHeader.value = true;
  } else {
    scrollHeader.value = false;
  }
}

function scrollTop() {
  if (window.scrollY >= 460) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
onMounted(() => {
  window.addEventListener("scroll", showScrollTop, { passive: true });
});
</script>

<style lang="postcss" scoped>
.scrolltop {
  @apply rounded-lg flex p-2 right-4 bottom-6 z-3 delay-400 fixed justify-center items-center invisible;

   /* &:hover {
    @apply bg-transparent text-jis-blue-400;
  }

 & .icon {
    @apply text-24;
  } */
}

.show-scroll {
  @apply bottom-14 fill-blue-500 stroke-blue-500 text-light-900 visible;
}
</style>
