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
    <li v-for="tag in tags" :key="tag" class="mr-5px underline whitespace-nowrap mt-1">
      <NuxtLink :to="`/${section}/tags/${tag}`">
        {{ tag }}
      </NuxtLink>
    </li>
  </ul>
</template>
