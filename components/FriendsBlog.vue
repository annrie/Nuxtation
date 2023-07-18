// 一覧表示用
<script setup lang="ts">
import type { FriendsPost, Sections } from "~/types";

interface Props {
  page: number;
}

const { page } = defineProps<Props>();
const blogsPerPage = 5;
const currentPage = Number(useRoute().params.pagination);
const allBlogs = await queryContent("/friends").find();
const numPages = Math.ceil(allBlogs.length / blogsPerPage);
const lastPage = Math.ceil(allBlogs.length / blogsPerPage);
const lastPageCount = allBlogs.length / blogsPerPage;
const offset = (currentPage - 1) * blogsPerPage;

const skipNumber = () => {
  // 計算が違う
  if (currentPage === 1) {
    return 0;
  }
  if (currentPage === lastPage) {
    return allBlogs.length - lastPageCount;
  }
  return (currentPage - 1) * blogsPerPage;
};

// const nextPage = articles.value.length === 5
const title: string = `All Member's Blog Posts(${currentPage || 1})`;
const description: string = "Here's a list of all my member's blog posts";
const section: Sections = "friends";

// definePageMeta({
//   pageTransition: {
//     name: "fade",
//     mode: "in-out",
//   },
// });

// get tag query
const {
  query: { tags },
} = useRoute();

const filtered = ref(tags?.split(","));

// set meta for page
useHead({
  title,
  meta: [{ name: "description", content: description }],
});
</script>
<template>
  <div class="article-list">
    <div
      class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
    >
      <ol itemscope itemtype="https://schema.org/BreadcrumbList" class="blog-breadcrumb">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <NuxtLink itemprop="item" to="/"> <span itemprop="name">Home</span></NuxtLink>
          <meta itemprop="position" content="1" />
        </li>
        <span>&gt;</span>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">Friends Blog</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </div>
    <header class="p-12 sm:mt-15 lt-md:prose-md tb:mt-30 tb:prose-lg">
      <div class="mx-auto text-center w-full">
        <h1 class="font-extrabold text-5xl dark:text-light-500">
          All Friends Posts({{ allBlogs.length }})
        </h1>
        <p class="font-medium text-lg dark:text-light-500">
          Here's a list of all friends great articles
        </p>
      </div>
    </header>
    <section class="page-section">
      <Tags :section="section" />
      <!-- Render list of all articles in ./content/friends using `path` -->
      <!-- Provide only defined fieldsin the `:query` prop -->
      <ContentList
        path="/friends"
        :query="{
          only: [
            'title',
            'description',
            'tags',
            '_path',
            'img',
            'author',
            'publishedAt',
            'name',
            'photo',
          ],
          limit: blogsPerPage,
          skip: offset,
          sort: { publishedAt: -1 },
          $sensitivity: 'base',
        }"
      >
        <!-- Default list slot -->
        <template v-slot="{ list }">
          <ul class="mx-auto w-full">
            <li
              v-for="article in list"
              :key="article._path"
              class="mt-3rem grid pt-0 blogCard items-center lt-md:grid-cols-1 tb:grid-cols-[1.5fr_1fr] gap-x-2"
            >
              <div>
                <nuxt-picture
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
                      'rounded transition-all duration-400 at-sm:(mt-0 block text-center h-full)',
                  }"
                />
              </div>
              <header class="tb:text-left lt-md:text-center">
                <p>{{ article.publishedAt }}</p>
                <h1 class="font-semibold text-2xl">
                  {{ article.title }}
                </h1>
                <p>{{ article.description }}</p>
                <ul
                  class="border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-auto text-white text-sm max-w-4xl gap-2 uppercase"
                >
                  <li
                    class="rounded-md bg-pink-100 border-zinc-600 text-sm p-2 py-1 text-dark-700 align-text-bottom underline dark: (bg-slate-100 text-slate-700) hover:-translate-y-0.5"
                    v-for="(tag, n) in article.tags"
                    :key="n"
                  >
                    {{ tag }}
                  </li>
                </ul>
                <NuxtLink :to="article._path" class="linkButton sm:mb-4"
                  >Read More</NuxtLink
                >
              </header>
            </li>
          </ul>
        </template>
        <!-- Not found slot to display message when no content us is found -->
        <template #not-found>
          <p>No articles found.</p>
        </template>
      </ContentList>
      <Pagination v-if="allBlogs.length > 5" :numPages="numPages" :current="page" />
    </section>
  </div>
</template>
