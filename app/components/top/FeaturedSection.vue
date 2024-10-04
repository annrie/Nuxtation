<script setup lang="ts">
import type { BlogPostPreview, Sections } from "~~/types/index.ts";

defineProps<{
  item: BlogPostPreview;
  section: Sections;
}>();
</script>

<template>
  <article
    class="container bg-white mx-auto my-5 p-5 blogCard sm:items-center lg:(-mx-6 flex items-left) dark:bg-gray-900"
  >
    <NuxtLink :to="item._path" :aria-label="item.title">
      <NuxtPicture
        provider="imgix"
        :src="item.img"
        :alt="item.title"
        width="600"
        height="300"
        fit="cover"
        format="avif,webp"
        :modifiers="{ auto: 'format,compress', q: 60 }"
        :imgAttrs="{
          class:
            'rounded transition-all duration-400 mx-auto tb:(w-100vw mt-0 mx-0)  lg:(hover:scale-110)',
        }"
      />
    </NuxtLink>
    <div class="mt-6 lg:(mx-6 mt-0 w-1/2 text-left)">
      <TagsList
        :tags="item.tags"
        section="blog"
        class="sm:justify-center lg:justify-start hover:text-jis-red"
      />
      <p v-if="item.updatedAt" pt-4>
        <Icon class="mr-10px" name="eos-icons:arrow-rotate" />
        <Date :date="item.updatedAt" />
      </p>
      <p pt-4 v-else>
        <Date :date="item.publishedAt" />
      </p>
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
        class="text-white at-sm:text-white mt-5 linkButton hover:(text-pink-100 scale-110 duration-400)"
      >
        読んでみる
      </NuxtLink>
    </div>
  </article>
</template>
<style scope lang="scss">
ul {
  @apply sm:(w-full text-center) lg:text-left;
}

.clip {
  clip-path: circle();
}
</style>
