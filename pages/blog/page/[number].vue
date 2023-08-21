<script setup lang="ts">
import type { Sections } from "~/types";
const { path, params } = useRoute();

definePageMeta({
  layout: "blog",
});

const blogCountLimit = 6;

const getPageLimit = (totalPosts: any) => {
  return Math.ceil(totalPosts / blogCountLimit);
};

const section: Sections = "blog";

const getPageNumber = () => {
  return Number((params as any).number);
};

// Attempt to get the number
const router = useRouter();
let pageNo;
try {
  pageNo = getPageNumber();
  if (isNaN(pageNo) || pageNo <= 0) {
    router.replace("/blog/");
  }
} catch (err) {
  console.error(err);
  router.replace("/blog/");
}
</script>

<template>
  <div>
    <ContentQuery
      path="/blog"
      :only="['title', 'description', 'tags', '_path', 'img', 'publishedAt']"
      :sort="{ publishedAt: -1 }"
      :skip="blogCountLimit * (getPageNumber() - 1)"
      :limit="blogCountLimit"
    >
      <!-- In case it is found -->
      <template v-slot="{ data }">
        <BlogHero />
        <Tags :section="section" />
        <BlogList :data="data" />
        <ContentQuery path="/blog" :only="['title']">
          <template v-slot="{ data }">
            <Pagination
              v-if="getPageLimit(data.length) > 1"
              class="mt-8"
              :currentPage="getPageNumber()"
              :totalPages="getPageLimit(data.length)"
              :nextPage="getPageNumber() < getPageLimit(data.length)"
              baseUrl="/blog/"
              pageUrl="/blog/page/"
            />
          </template>
          <template #not-found>
            <!-- Nothing -->
          </template>
        </ContentQuery>
      </template>
      <!-- In case not found -->
      <template #not-found>
        <!-- Show hero and message -->
        <BlogHero />
        <BlogList
          :data="[]"
          message="There are no posts in this page, maybe try searching on another one."
        />
      </template>
    </ContentQuery>
  </div>
</template>
