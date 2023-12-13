<script setup lang="ts">
import type { Sections, ParsedContent } from "~/types";
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
const title: string = `${pageNo}ページ目の記事一覧`;
const current = pageNo;
console.log(current);
useHead({
  title,
  meta: [{ property: "og:type", content: "article" }],
});
// useSeoMeta({
//   twitterDescription: () => data?.value?.article.description,
// });
</script>

<template>
  <div class="article-list mt-0 pt-10">
    <ContentQuery
      path="/blog"
      :only="['title', 'description', 'tags', '_path', 'img', 'publishedAt', 'updatedAt']"
      :sort="{ publishedAt: -1 }"
      :skip="blogCountLimit * (getPageNumber() - 1)"
      :limit="blogCountLimit"
    >
      <!-- In case it is found -->
      <template v-slot="{ data }">
        <!-- Breadcrumbs -->
        <ol
          itemscope
          itemtype="https://schema.org/BreadcrumbList"
          class="blog-breadcrumb"
        >
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <NuxtLink itemprop="item" to="/">
              <span itemprop="name">
                <Icon align-top mb-5px name="line-md:home-md-twotone" />
              </span>
            </NuxtLink>
            <meta itemprop="position" content="1" />
          </li>
          <li class="separator">&gt;</li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <NuxtLink to="/blog">
              <span itemprop="name">Blog</span>
            </NuxtLink>
            <meta itemprop="position" content="2" />
          </li>
          <li class="separator">&gt;</li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name">{{ title }}</span>
            <meta itemprop="position" content="3" />
          </li>
        </ol>
        <BlogHero :pageNo="current" />
        <section class="page-section">
          <Tags :section="section" />
          <BlogList :data="data as ParsedContent[]" />
          <ContentQuery path="/blog" :only="['title']">
            <template v-slot="{ data }">
              <Pagination
                v-if="getPageLimit(data.length) > 1"
                class="mt-8"
                :currentPage="getPageNumber()"
                :totalPages="getPageLimit(data.length)"
                :nextPage="getPageNumber() < getPageLimit(data.length)"
                baseUrl="/blog"
                pageUrl="/blog/page"
              />
            </template>
            <template #not-found>
              <!-- Nothing -->
            </template>
          </ContentQuery>
        </section>
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
