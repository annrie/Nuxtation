<script setup lang="ts">
import type { BlogPostPreview, Sections } from "~/types";

defineProps<{
  item: BlogPostPreview;
  section: Sections;
}>();
</script>

<template>
  <article
    class="container bg-white mx-auto my-5 p-5 sm:items-center lg:(-mx-6 flex items-left) dark:bg-gray-900 "
  >
    <picture
      ><NuxtLink :to="item._path" :aria-label="item.title">
        <NuxtImg
          :provider="item.provider"
          :src="item.img"
          :alt="item.title"
          width="600"
          height="300"
          fit="cover"
          format="jpg"
          class="rounded transition-all duration-400 @tb:mx-auto lg:(scale-90 hover:scale-100) "
        /> </NuxtLink
    ></picture>

    <div class="mt-6 lg:(mx-6 mt-0 w-1/2 text-left) ">
      <TagsList
        :tags="item.tags"
        section="blog"
        class="sm:justify-center lg:justify-start hover:text-red"
      />

      <p>
        <NuxtLink
          :to="item._path"
          class="font-semibold mt-4 text-2xl text-gray-800 block md:text-3xl dark:text-white hover:underline"
        >
          {{ item.title }}
        </NuxtLink>
      </p>

      <p class="mt-3 text-sm text-gray-500 md:text-sm dark:text-gray-300">
        {{ item.description }}
      </p>

      <NuxtLink
        :to="item._path"
        :aria-label="`read more about ${item.title}`"
        class="mt-5 linkButton"
      >
        Read more
      </NuxtLink>
    </div>
  </article>
</template>
<style scope lang="scss">
ul {
  @apply sm:(w-full text-center) lg:text-left ;
}

.clip {
  clip-path: circle();
}
</style>
