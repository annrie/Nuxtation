<script setup lang="ts">
import type { Sections } from "~~/types/index.ts";

defineProps<{
  tags: Array<string>;
  section: Sections;
}>();
// replaceHyphenを自分で定義する
const replaceHyphen = (tag: string) => tag.replace(/-/g, " ");
</script>

<template>
  <ul class="flex flex-wrap text-sm text-jis-blue-600 uppercase dark:text-jis-blue-500 gap-2">
    <li v-for="tag in tags" :key="tag" class="border-zinc-600 rounded-md bg-blue-400 align-text-bottom text-white p-0.5rem dark:(text-slate-200 bg-blue-800) sm:text-0.8rem tb:(text-left text-12px) lg:text-md lt-lg:justify-evenly font-mono">
      <NuxtLink :to="`/${section}/tags/${tag}`">
        {{ tag }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
a {
  @apply text-white;
}
</style>
