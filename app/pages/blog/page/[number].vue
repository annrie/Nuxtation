<script setup lang="ts">
import type { ParsedContent, Sections } from "~~/types.ts";
import { useRoute, useRouter } from "vue-router";

const { path, params } = useRoute();
const router = useRouter();

definePageMeta({
  layout: false,
});

const blogCountLimit = 6;

function getPageLimit(totalPosts: number): number {
  return Math.ceil(totalPosts / blogCountLimit);
}

function getPageNumber(): number {
  const pageNo = Number(params.number);
  if (Number.isNaN(pageNo) || pageNo <= 0) {
    router.replace("/blog/");
    return 1;
  }
  return pageNo;
}

const section: Sections = "blog";
const current = getPageNumber();
const title = `${current}ページ目の記事一覧`;

useHead({
  title,
  meta: [{ property: "og:type", content: "article" }],
});
</script>

<template>
  <div>
    <NuxtLayout name="blog">
      <div class="article-list mt-0 pt-10">
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
          :sort="{ publishedAt: -1 }"
          :skip="blogCountLimit * (current - 1)"
          :limit="blogCountLimit"
        >
          <template #default="{ data }">
            <BlogBreadcrumbs :current-page="current" />
            <BlogHero :page-no="current" />
            <section class="page-section">
              <Tags :section="section" />
              <BlogList :data="data as ParsedContent[]" />
              <ContentQuery path="/blog" :only="['title']">
                <template #default="{ data: queryData }">
                  <Pagination
                    v-if="getPageLimit(queryData.length) > 1"
                    class="mt-8"
                    :current-page="current"
                    :total-pages="getPageLimit(data.length)"
                    :next-page="current < getPageLimit(data.length)"
                    base-url="/blog"
                    page-url="/blog/page/"
                  />
                </template>
                <template #not-found>
                  <!-- Nothing -->
                </template>
              </ContentQuery>
            </section>
          </template>
          <template #not-found>
            <BlogHero />
            <BlogList
              :data="[]"
              message="There are no posts in this page, maybe try searching on another one."
            />
          </template>
        </ContentQuery>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped>
.blog-breadcrumb {
  @apply flex items-center text-sm text-gray-500;
}

.blog-breadcrumb .separator {
  @apply mx-2;
}
</style>
