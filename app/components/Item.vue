<script setup lang="ts">
import type { BlogPostPreview, FriendsPostPreview, Sections } from "~~/types/index.ts";

defineProps<{
  item: BlogPostPreview | FriendsPostPreview;
  section: Sections;
}>();
</script>

<template>
  <article class="grid py-4 gap-6 auto-cols-[minmax(0,_3fr)] grid-cols-4">
    <div class="h-full object-cover w-full">
      <NuxtLink :to="item.url || item._path" :target="item.url ? '_blank' : '_self'">
        <NuxtImg
          :provider="item.provider"
          :src="item.img"
          :alt="item.title"
          width="272"
          height="272"
          fit="cover"
          format="jpg"
          class="rounded transition-all scale-90 duration-400 hover:scale-100"
        />
      </NuxtLink>
    </div>

    <div class="col-span-3">
      <NuxtLink :to="item.url || item._path" :target="item.url ? '_blank' : '_self'">
        <h2
          class="font-semibold text-lg mb-0 text-gray-800 md:text-3xl lg:mb-4 dark:text-white hover:underline"
        >
          {{ item.title }}
        </h2>
        <p
          class="mt-0 text-base text-ellipsis mb-3 text-gray-500 overflow-hidden whitespace-nowrap md:text-sm md:overflow-visible md:whitespace-normal lg:mt-3 lg:text-base dark:text-gray-300"
        >
          {{ item.description }}
        </p>
      </NuxtLink>
      <TagsList v-if="item.tags" :tags="item.tags" :section="section" />
      <NuxtLink
        :to="item._path"
        class="bg-hex-108775 rounded-5px text-white text-lg py-0.8px px-2rem inline-block"
        >Read More</NuxtLink
      >
    </div>
  </article>
</template>
