<script setup lang="ts">
import type { BlogPost, Sections } from '~/types/index.ts'

const props = defineProps<{
  list: Array<BlogPost>
  section: Sections
  showImages?: boolean
}>()
</script>

<template>
  <ul class="py-6 m-auto max-w-4xl">
    <li v-for="item in list" :key="item.path" class="py-4">
      <BlogItem :item="item" :section="section" :showImages="showImages" />
    </li>
  </ul>
</template>
