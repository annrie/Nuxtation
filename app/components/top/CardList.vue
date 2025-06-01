<script setup lang="ts">
import type { BlogPostPreview, Sections } from "~~/types/index.ts";
defineProps<{
  list: Array<BlogPostPreview>;
  section: Sections;
}>();
</script>

<template>
  <ul
    class="mx-auto mt-12 text-left grid gap-6 md:max-w-none md:grid-cols-2 lg:grid-cols-3"
  >
    <li v-for="item of list" :key="item.url || item.path" class="grid at-sm:mx-auto">
      <Card :item="item" :section="section" />
    </li>
  </ul>
</template>
