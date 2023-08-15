<script setup lang="ts">
import type { BlogPost, Sections } from "~/types";

definePageMeta({
  layout: "blog",
});

// Find the number of blogs present
const blogCountLimit = 6;
const { data } = await useAsyncData(`content-blog`, async () => {
  const _posts = await queryContent("/blog").only("title").find();
  return Math.ceil(_posts.length / blogCountLimit);
});

// const count = await queryContent("blog").count();
// console.log(count);
const title: string = `All Blog Posts`;
const description: string = "Here's a list of all my blog posts";
const section: Sections = "blog";

// get tag query
const {
  query: { tags },
} = useRoute();

const filtered = ref(tags ? (Array.isArray(tags) ? tags : tags.split(",")) : []);
// set meta for page
useHead({
  title,
  meta: [{ name: "description", content: description }],
});
</script>
<template>
  <div class="article-list">
    <BlogHero />
    <section class="page-section">
      <Tags :section="section" />
      <ContentQuery
        path="/blog"
        :only="['title', 'description', 'tags', '_path', 'img', 'publishedAt']"
        :limit="blogCountLimit"
        :sort="{ publishedAt: -1 }"
        v-slot="{ data }"
      >
        <BlogList :data="data" />
      </ContentQuery>
      <Pagination
        v-if="data && data > 1"
        class="mt-8"
        :currentPage="1"
        :totalPages="data"
        :nextPage="data > 1"
        baseUrl="/blog/"
        pageUrl="/blog/page/"
      />
    </section>
  </div>
</template>
