<script setup lang="ts">
import type { BlogPostPreview, FriendsPostPreview, Sections } from "~/types";
defineProps<{
  item: BlogPostPreview | FriendsPostPreview;
  section: Sections;
}>();
</script>

<template>
  <article
      class="container bg-white rounded-2xl grid p-5 gap-6 auto-cols-[minmax(0,_2fr)] grid-cols-3 blogCard dark:bg-gray-200"
    >
      <div class="h-full object-cover w-full">
        <NuxtLink :to="item.url || item._path" :target="item.url ? '_blank' : '_self'">
            <nuxt-img
          :src="item.img"
          :alt="item.title"
          width="300"
          height="300"
          fit="cover"
          format="jpg"
          loading="lazy"
          class="rounded transition-all scale-90 duration-400 hover:scale-100"
        />
      </NuxtLink>
    </div>
    <div class="col-span-2">
      <NuxtLink :to="item.url || item._path" :target="item.url ? '_blank' : '_self'">
        <h3 class="font-medium text-lg mb-2 leading-tight text-gray-600">
          {{ item.title }}
        </h3>

        <Date :date="item.publishedAt" />
      </NuxtLink>
      <TagsList
        :tags="item.tags"
        :section="section"
        class="mt-6 text-left sm:(text-0.8rem mt-0) lg:(mx-6 mt-0 w-1/2) hover:text-red-500 "
      />
    </div>
  </article>
</template>

<style scope lang="scss">
.clip {
  clip-path: circle();
}
</style>
