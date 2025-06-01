<script setup lang="ts">
import type { Sections } from "~~/types/index.ts";

interface Props {
  section: Sections;
}

const props = defineProps<Props>();

// tag list state
// const expanded = ref(false);
// replaceHyphenを自分で定義する
const replaceHyphen: any = (tag: string) => tag.replace(/-/g, " ");

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

const { data } = await useAsyncData('blog', () =>
  queryContent('blog')
  .select('tags')
  .all());

// const articleTags = [...new Set(flatten(data.value, "tags"))];
// ↑ data.valueの型がPick<ParsedContent, string>[] | nullであるため、flatten関数のパラメーターの型であるany[]と互換性がないというエラーが出るので、下記に書き換えた
const articleTags = data.value ? [...new Set(flatten(data.value, "tags"))] : [];
const sortedArticleTags = articleTags.sort();
</script>
<template>
  <ul
    class="mx-auto my-4 max-w-4xl flex flex-wrap items-center gap-6 border border-transparent rounded-lg text-white font-normal uppercase flex-wrap justify-center"
  >
    <!-- list out tags with links -->
    <li
      v-for="(tag, n) in sortedArticleTags"
      :key="n"
      class="flex flex-nowrap justify-center"
    >
      <NuxtLink
        :to="`/blog/tags/${tag}`"
        class="whitespace-nowrap rounded-md bg-slate-600 p-0.5rem transition-all hover:bg-blue-500 sm:text-base tb:text-lg hover:-translate-y-0.5 font-mono"
      >
        {{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.router-link-active,
.router-link-exact-active {
  @apply text-white bg-blue-500 px-0.75rem dark:(bg-blue-500 text-whte) hover:(bg-orange-500 text-white);
}
</style>
