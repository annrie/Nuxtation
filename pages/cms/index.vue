<template>
  <div>
    <div
      class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
    >
      <SBreadcrumb flex>
        <template #breadcrumb="{ to, title }">
          <NuxtLink :to="to">
            {{ title }}
          </NuxtLink>
        </template>
      </SBreadcrumb>
    </div>
    <h1>Nuxt3 Jamstack Blogs</h1>
    <ul>
      <li v-for="blog in data?.contents" :key="blog.id">
        <NuxtLink :to="`/${blog.id}`">
          <img
            :src="blog.eyecatch?.url"
            :width="blog.eyecatch?.width"
            :height="blog.eyecatch?.height"
            alt=""
          />
          <div>
            <div>
              {{ blog.category?.name }}
            </div>
            <div>
              {{ blog.title }}
            </div>
            <div>
              {{ blog.publishedAt ?? blog.createdAt }}
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Blog } from "~/blog";

definePageMeta({
  layout: "blog",
});

const { data } = await useMicroCMSGetList<Blog>({
  endpoint: "blogs",
});
console.log(data);
</script>
