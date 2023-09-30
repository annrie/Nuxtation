<script setup lang="ts">
import { Blog } from "~/blog";

definePageMeta({
  layout: "blog",
});

const { params } = useRoute();

const { data } = await useMicroCMSGetListDetail<Blog>({
  endpoint: "blogs",
  contentId: Array.isArray(params.id) ? params.id[0] : params.id,
});
console.log(data);
const { $formatDate } = useNuxtApp();
</script>

<template>
  <template v-if="data">
    <h1 class="text-3xl font-semibold">
      {{ data.title }}
    </h1>
    <img
      :src="data.eyecatch?.url"
      :width="data.eyecatch?.width"
      :height="data.eyecatch?.height"
      alt=""
      class="mt-6 md:mt-10"
    />
    <div
      class="mt-4 flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-4"
    >
      <div
        class="rounded border-2 border-indigo-600 px-1.5 py-0.5 text-sm font-semibold text-indigo-600"
      >
        {{ data.category?.name }}
      </div>
      <div class="text-sm text-gray-700">
        {{ $formatDate(data.publishedAt ?? data.createdAt) }}
      </div>
    </div>
    <div v-html="data.content" class="prose mt-6 md:mt-10"></div>
  </template>
</template>
