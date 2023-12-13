<script setup lang="ts">
import type { Sections, ParsedContent } from "~/types";
import { Buffer } from "buffer";

definePageMeta({
  layout: "blog",
});

// Find the number of blogs present
const blogCountLimit = 6;
const { data } = await useAsyncData(`content-blog`, async () => {
  const _posts = await queryContent("/blog").only("title").find();
  return Math.ceil(_posts.length / blogCountLimit);
});

// const count = (await queryContent("blog").only([]).fetch()).length;
// console.log(count);
const title: string = `All Blog Posts`;
const description: string = "Here's a list of all my blog posts";
const section: Sections = "blog";
const pageNo = ref(1);
// get tag query
// const {
//   query: { tags },
// } = useRoute();

// const filtered = ref(tags ? (Array.isArray(tags) ? tags : tags.split(",")) : []);
// set meta for page
useHead({
  title,
  meta: [
    { property: "og:type", content: "article" },
    { name: "description", content: description },
  ],
});
let encoded1 = Buffer.from(`${title}`)
  .toString("base64")
  .replace(/\s/g, "%20")
  .replace(/=/g, "");

useSeoMeta({
  description: () => description,
  twitterDescription: () => description,
  ogType: () => "article",
  ogLocale: () => "ja_JP",
  // ogUrl: () => "https://nuxtation.vercel.app/blog",
  ogDescription: () => description,
  twitterTitle: () => "All Blog Posts",
  twitterImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
  ogImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
});
</script>
<template>
  <div class="article-list">
    <BlogHero :pageNo="pageNo" />
    <section class="page-section">
      <Tags :section="section" />
      <ContentQuery
        path="/blog"
        :only="[
          'title',
          'description',
          'tags',
          '_path',
          'img',
          'publishedAt',
          'updatedAt',
        ]"
        :limit="blogCountLimit"
        :sort="{ publishedAt: -1 }"
        v-slot="{ data }"
      >
        <BlogList :data="data as ParsedContent[]" />
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
