<script setup lang="ts">
import type { BlogPostPreview, FriendsPostPreview, Sections } from "~/types";
defineProps<{
  item: BlogPostPreview | FriendsPostPreview;
  section: Sections;
}>();
</script>

<template>
  <article
      class="container bg-white rounded-2xl grid p-15 gap-6 auto-cols-[minmax(0,_2fr)] grid-cols-3 blogCard dark:(bg-gray-900)"
    >
      <div class="h-full object-cover w-full">
        <NuxtLink :to="item.url || item._path" :target="item.url ? '_blank' : '_self'">
            <nuxt-picture
                  provider="imgix"
                  :src="item.img"
                  :alt="item.title"
                  width="300"
                  height="300"
                  fit="cover"
                  format="avif,webp"
                  loading="lazy"
                  :modifiers="{ auto: 'format,enhance', crop: 'entropy',q:60 }"
                  :imgAttrs="{
                            class:
                              'rounded transition-all scale-90 duration-400 hover:scale-100',
                          }"
        />
      </NuxtLink>
    </div>
    <div class="col-span-2">
      <NuxtLink :to="item.url || item._path" :target="item.url ? '_blank' : '_self'">
        <h3 class="font-medium text-lg mb-2 leading-tight text-gray-600 dark:text-gray-300">
          {{ item.title }}
        </h3>

        <Date :date="item.publishedAt" />
      </NuxtLink>
      <TagsList
        :tags="item.tags"
        :section="section"
        class="mt-6 text-left sm:(text-0.8rem mt-0) lg:(mx-1 mt-2) hover:text-jis-red"
      />
    </div>
  </article>
</template>

<style scope lang="scss">
.clip {
  clip-path: circle();
}
</style>
