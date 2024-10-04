<script setup lang="ts">
import type { BlogPostPreview, FriendsPostPreview, Sections } from '~~/types'

defineProps<{
  list: Array<BlogPostPreview | FriendsPostPreview>
  section: Sections
}>()
</script>

<template>
  <ul class="m-auto max-w-4xl py-6">
    <li v-for="item in list" :key="item._path" class="border-b py-4">
      <Item :item="item" :section="section" />
    </li>
  </ul>
</template>
