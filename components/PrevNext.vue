<script setup lang="ts">
import type { PrevNext } from "~/types";
defineProps<{
  prev: PrevNext;
  next: PrevNext;
}>();
// define prev and next props
// defineProps(["prev", "next"]);
// const { prev, next } = useContent()
</script>

<template>
  <ul class="prev-next-cont">
    <li class="link-item prev">
      <NuxtLink v-if="prev" :to="prev._path">
        <div i-carbon-arrow-left class="stroke icon" />
        <span> {{ prev.title }} </span>
      </NuxtLink>
    </li>
    <li class="link-item next">
      <NuxtLink v-if="next" :to="next._path">
        <span> {{ next.title }} </span>
        <div i-carbon-arrow-right class="stroke icon" />
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.prev-next-cont {
  @apply border rounded-lg flex border-slate-200 p-4 gap-4 justify-between;
}

.link-item a {
  @apply flex gap-2 font-display;
}
</style>
