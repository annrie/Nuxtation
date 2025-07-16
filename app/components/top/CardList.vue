<script setup lang="ts">
import type { BlogPostPreview, Sections } from "~~/types/index.ts";
defineProps<{
  list: Array<BlogPostPreview>;
  section: Sections;
}>();
</script>

<template>
  <ul
    class="grid mx-auto mt-3rem gap-1.0rem text-left md:grid-cols-2 lg:grid-cols-3 md:w-none"
  >
    <li v-for="item of list" :key="item.url || item.path" class="grid at-sm:mx-auto">
      <Card :item="item" :section="section" />
    </li>
  </ul>
</template>
