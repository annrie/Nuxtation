<script setup>
import { ref } from "vue";

defineProps({
  filteredArticles: {
    type: Array,
    required: true,
  },
  message: {
    type: String,
    default:
      "There are no posts right now, but stay tuned for newer releases in the future.",
  },
  updatedAt: {
    type: String,
    default: "",
  },
});
// console.log(article.updatedAt);
const { $formatDate } = useNuxtApp();

const updatedAt = ref(filteredArticles.updatedAt);
const isWithinTenDays = useIsWithinTenDays(computed(() => filteredArticles.updatedAt));
</script>

<template>
  <ul class="mx-auto w-full">
    <li
      v-for="article in filteredArticles"
      :key="article.path"
      class="blogCard grid mt-3rem items-center gap-x-1rem pt-0 lg:grid-cols-[1.5fr_1fr] lt-lg:grid-cols-1"
    >
      <div>
        <NuxtPicture
          provider="imgix"
          :src="article.img"
          :alt="article.title"
          format="avif,webp"
          loading="lazy"
          :modifiers="{
            auto: 'format,enhance',
            crop: 'entropy',
            q: '60',
            w: '1280',
            h: '640',
            fit: 'crop',
          }"
          :img-attrs="{
            class:
              'rounded transition-all duration-400 at-sm:(mt-0 block text-center w-full) ',
          }"
        />
      </div>
      <header class="text-left lt-lg:p-20">
        <p v-if="article.updatedAt">
          <Icon v-if="isWithinTenDays" name="eos-icons:arrow-rotate" />
          {{ $formatDate(article.updatedAt) }}
        </p>
        <p v-else>
          {{ $formatDate(article.publishedAt) }}
        </p>
        <h1 class="font-semibold text-1.5rem tb:text-1.2rem lg:text-2xl">
          {{ article.title }}
        </h1>
        <p
          mt-5px
          lg:text-lg
          tb:text-14px
          at-sm:lh-1.5
          lg:line-height-base
          tb:line-height-tight
        >
          {{ article.description }}
        </p>
        <ul
          class="my-1rem flex gap-2 text-white font-normal uppercase lt-lg:flex-row-center"
        >
          <li
            v-for="(tag, n) in article.tags"
            :key="n"
            class="border-zinc-600 rounded-md bg-blue-400 align-text-bottom text-white p-0.5rem dark:(text-slate-200 bg-blue-800) sm:text-0.8rem tb:(text-left text-12px) lg:text-md" lt-lg:justify-evenly
          >
            {{ tag }}
          </li>
        </ul>
        <NuxtLink
          :to="article.path"
          class="linkButton at-sm:(mx-auto mb-4 text-white) hover:(scale-110 text-white duration-400) lt-tb:translate-x-50% lt-lg:translate-x-150%"
        >
          読んでみる
        </NuxtLink>
      </header>
    </li>
  </ul>
  <p
    v-if="data.length === 0"
    class="w-full text-h3 font-bold leading-h3 md:w-7/12 dark:text-white"
  >
    {{ message }}
  </p>
</template>
