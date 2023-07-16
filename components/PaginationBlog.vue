<script setup lang="ts">
interface Props {
  numPages: number;
  current: number;
}

const { numPages, current } = defineProps<Props>();
// ページリンクを返す
function getPath(p: number) {
  return `/blog/page/${p}`;
}

// クラスを返す
// 現在のページの場合スタイルをかえるため
function getClass(page: number, current: number) {
  if (page == current) return "current";
  return "link";
}
</script>

<template>
  <div class="pagination">
    <NuxtLink
      v-for="page in numPages"
      :key="page"
      :class="[page == current ? 'current' : 'link']"
      :to="getPath(page)"
    >
      {{ page }}
      <!-- <NuxtLink v-for="page in numPages"
            :key="page"
            :to="getPath(page)"
            :class="[page == current ? 'current' : 'link']">
            {{ page }} -->
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  @apply font-body font-light mx-0 mt-4rem text-base text-center mb-0 w-full;
}

a {
  @apply bg-transparent border-solid border-dark-50 border-1 rounded-1/2 h-3rem my-0 mx-0.5rem text-center px-0 pt-6px pb-1px text-2xl w-3rem inline-block dark: border-white hover: bg-sky-500;
}

a[aria-current="page"] {
  @apply bg-sky-500 text-dark-300 hover: (text-sky-900 bg-sky-100);
}
</style>
