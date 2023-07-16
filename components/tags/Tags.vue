<script setup lang="ts">
import type { Sections } from "~/types";

interface Props {
  section: Sections;
}

const props = defineProps<Props>();

// tag list state
// const expanded = ref(false);

// helper function to flatten tags array
const flatten = (tags: Array<any>, key = "tags") => {
  const _tags = tags
    .map((tag) => {
      let _tag = tag;
      if (tag.tags) {
        const flattened = flatten(tag[key]);
        _tag = flattened;
      }
      return _tag;
    })
    .flat(1);

  return _tags;
};

const { data } = await useAsyncData("tags", () =>
  queryContent(props.section)
    .only(["tags"])
    .where({ publishedAt: { $ne: false } })
    .find()
);

const articleTags = [...new Set(flatten(data.value, "tags"))];
const sortedArticleTags = articleTags.sort();

// function to toggle expanded state
// const toggleExpand = () => {
//   expanded.value = !expanded.value;
// };

console.log({ articleTags });
</script>
<template>
  <!-- <div class="mx-auto <md:max-w-full tb:max-w-full"> -->
  <!-- <div class="mx-auto max-w-3xl" :class="{ active: expanded }"> -->
  <!-- Button to toggle expand -->
  <!-- <button @click="toggleExpand" class="w-icon w-auto cta">
      <i i-carbon-tag class="bg-pink-500 icon solid" />
      <span text-pink-500>Tags</span>
    </button> -->
  <!-- <ul class="flex py-2 gap-2" :class="{ expanded: expanded }"> -->
  <ul
    class="border border-transparent rounded-lg flex flex-nowrap font-normal mx-auto my-4 mx-0 text-white max-w-4xl gap-2 items-center overflow-x-scroll uppercase overflow-visible md:flex-wrap md:justify-center md:overflow-visible"
  >
    <!-- list out tags with links -->
    <li
      v-for="(tag, n) in sortedArticleTags"
      :key="n"
      class="flex flex-nowrap gap-2 justify-center"
    >
      <NuxtLink
        :to="`/${section}/tags/${tag}`"
        class="rounded-md font-header bg-slate-600 px-2 transition-all whitespace-nowrap sm:text-base !py-0.5 tb:text-lg hover:bg-blue-500 hover:-translate-y-0.5"
      >
        {{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.router-link-exact-active {
  @apply bg-blue-500;
}
</style>
