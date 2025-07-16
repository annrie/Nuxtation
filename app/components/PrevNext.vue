<script setup lang="ts">
import type { PrevNext as PrevNextType } from "~~/types";
import type { Ref } from "vue";

// prev / next に渡される型のサンプル (プロジェクトに合わせて修正してください)
interface ArticleData {
  path: string;
  title: string;
}

// Props 定義:
//   - prev, next: 前後の記事データ
//   - section: "blog" または "biblio" などを想定
const props = defineProps<{
  prev: PrevNextType | null;
  next: PrevNextType | null;
  section: string;
}>();
</script>

<template>
  <ul class="prev-next-cont">
    <li class="prev link-item">
      <NuxtLink v-if="props.prev" :to="prev.path">
        <div class="i-tabler:arrow-big-left-line w-2em h-2em"></div>
        <span mt-2> {{ prev.title }} </span>
      </NuxtLink>
    </li>
    <li class="link-item next">
      <NuxtLink v-if="props.next" :to="next.path">
        <span mt-2> {{ next.title }} </span>
        <div class="i-tabler:arrow-big-right-line w-2em h-2em"></div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
@forward '@/assets/styles/scss/global';
@use '@/assets/styles/scss/global' as *;

.prev-next-cont {
  @apply border rounded-lg flex border-slate-400 dark:border-slate-100 p-1rem gap-1rem justify-between;
}

.link-item a {
  @apply flex gap-2 text-dark-700 dark:text-white no-underline;
  @media (hover: hover) {
    &:where(:any-link, :enabled, summary):hover {
      @apply underline;
    }
  }
}
</style>
