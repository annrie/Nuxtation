<script setup lang="ts">
import type { Sections } from "~/types";

defineProps<{
  tags: Array<string>;
  section: Sections;
}>();
</script>

<template>
  <ul class="flex flex-wrap text-sm text-blue-600 uppercase dark:text-blue-500 gap-2">
    <li v-for="tag in tags" :key="tag" class="mr-5px underline whitespace-nowrap mt-1">
      <NuxtLink :to="`/${section}/tags/${tag}`">
        {{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>
