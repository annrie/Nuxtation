<script setup lang="ts">
import type { BlogPostPreview, FriendsPostPreview, Sections } from "~/types";
defineProps<{
  list: Array<BlogPostPreview | FriendsPostPreview>;
  section: Sections;
}>();
</script>

<template>
  <ul
    class="mx-auto mt-12 text-left grid gap-6 md:max-w-none md:grid-cols-2 lg:grid-cols-3"
  >
    <li v-for="item of list" :key="item.url || item._path" class="grid at-sm:mx-auto">
      <TopCard :item="item" :section="section" />
    </li>
  </ul>
</template>
