<script setup lang="ts">
import type { Sections, ParsedContent } from "~/types";

definePageMeta({
  layout: "blog",
});

// Find the number of blogs present
const blogCountLimit = 6;
const { data } = await useAsyncData(`content-friends`, async () => {
  const _posts = await queryContent("/friends").only("title").find();
  return Math.ceil(_posts.length / blogCountLimit);
});

const title: string = `All Friends Blog Posts`;
const description: string = "Here's a list of all my friends posts";
const section: Sections = "friends";

// get tag query
// const {
//   query: { tags },
// } = useRoute();

// const filtered = ref(tags ? (Array.isArray(tags) ? tags : tags.split(",")) : []);
// set meta for page
useHead({
  title,
  meta: [{ name: "description", content: description }],
});
</script>
<template>
  <div class="article-list">
    <FriendsHero />
    <section class="page-section">
      <Tags :section="section" />
      <ContentQuery
        path="/friends"
        :only="[
          'title',
          'description',
          'tags',
          '_path',
          'img',
          'author',
          'publishedAt',
          'name',
          'photo',
        ]"
        :limit="blogCountLimit"
        :sort="[{ publishedAt: -1, $sensitivity: 'base' }]"
        v-slot="{ data }"
      >
        <FriendsList :data="data as ParsedContent[]" />
      </ContentQuery>
      <Pagination
        v-if="data && data > 1"
        class="mt-8"
        :currentPage="1"
        :totalPages="data"
        :nextPage="data > 1"
        baseUrl="/friends/"
        pageUrl="/friends/page/"
      />
    </section>
  </div>
</template>
