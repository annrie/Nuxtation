<template>
  <ul class="mx-auto w-full">
    <li
      v-for="article in data"
      :key="article._path"
      class="mt-3rem grid pt-0 blogCard items-center lt-md:grid-cols-1 tb:grid-cols-[1.5fr_1fr] gap-x-2"
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
            w: '1200',
            h: '600',
            fit: 'crop',
          }"
          :imgAttrs="{
            class:
              'rounded transition-all duration-400 at-sm:(mt-0 block text-center h-full) ',
          }"
        />
      </div>
      <header class="tb:text-left lt-md:text-center">
        <p v-if="article.updatedAt">
          <Icon name="eos-icons:arrow-rotate" />
          {{ article.updatedAt }}
        </p>
        <p v-else>
          {{ article.publishedAt }}
        </p>
        <h1 class="font-semibold tb:text-xl lg:text-2xl">
          {{ article.title }}
        </h1>
        <p leading-7 tb:text-base lg:text-l>{{ article.description }}</p>
        <ul class="flex rounded-lg font-normal my-4 text-white gap-2 uppercase">
          <li
            class="rounded-md bg-jis-blue/30 border-zinc-600 sm:text-base tb:text-14px lg:text-lg p-2 text-dark-700 align-text-bottom tb:text-left dark:(bg-slate-100 text-slate-700)"
            v-for="(tag, n) in article.tags"
            :key="n"
          >
            {{ tag }}
          </li>
        </ul>
        <NuxtLink
          :to="article._path"
          class="linkButton at-sm:(mb-4 text-white mx-auto) hover:(text-white scale-110 duration-400)"
          >Read More</NuxtLink
        >
      </header>
    </li>
  </ul>
  <p
    v-if="data.length == 0"
    class="w-full md:w-7/12 text-h3 leading-h3 font-bold dark:text-white"
  >
    {{ message }}
  </p>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  message: {
    type: String,
    default:
      "There are no posts right now, but stay tuned for newer releases in the future.",
  },
});
const { $formatDate } = useNuxtApp();
</script>
