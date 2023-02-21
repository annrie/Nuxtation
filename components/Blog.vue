<script setup lang="ts">
import type { BlogPost, Sections } from "~/types";

interface Props {
  page: number;
}

const { page } = defineProps<Props>();
const blogsPerPage = 5;
const currentPage = Number(useRoute().params.pagination);
const allBlogs = await queryContent("/blog").find();
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
const title: string = `All Blog Posts(${currentPage || 1})`;
const description: string = "Here's a list of all my blog posts";
const section: Sections = "blog";

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
    <header class="p-12 sm:mt-15 <md:prose-sm tb:mt-30 tb:prose-lg">
      <div class="mx-auto text-center w-full">
        <h1 class="font-extrabold mb-4 text-5xl dark:text-light-500"> All Blog Posts({{ allBlogs.length }}) </h1>
        <p class="font-medium text-lg dark:text-light-500"> Here's a list of all my great articles </p>
      </div>
    </header>
    <section class="page-section">
      <Tags :section="section" />
      <!-- Render list of all articles in ./content/blog using `path` -->
      <!-- Provide only defined fieldsin the `:query` prop -->
      <ContentList path="/blog"
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
          }">
        <!-- Default list slot -->
        <template v-slot="{ list }">
          <ul class="mx-auto w-full">
            <li v-for="article in list"
              :key="article._path"
              class="mt-3rem grid pt-0 blogCard items-center <md:grid-cols-1 tb:grid-cols-[1.5fr,1fr]">
              <div class="h-300px">
                <NuxtImg :src="article.img"
                  :alt="article.title"
                  format="jpg"
                  loading="lazy"
                  fit="cover"
                  class="rounded h-300px w-full transition-all duration-400 <sm:(mt-0 block text-center) hover:scale-100" />
              </div>
              <header class="pl-0.8rem <md:text-center tb:text-left">
                <p>{{ article.publishedAt }}</p>
                <h1 class="font-semibold text-2xl">
                  {{ article.title }}
                </h1>
                <p>{{ article.description }}</p>
                <ul class="border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-0 text-white text-sm max-w-4xl gap-2 uppercase <md:(text-md justify-center)">
                  <li class="rounded-md bg-pink-100 border-zinc-600 text-sm p-2 py-1 text-dark-700 align-text-bottom underline dark: (bg-slate-100 text-slate-700) hover:-translate-y-0.5"
                    v-for="(tag, n) in article.tags"
                    :key="n">
                    {{ tag }}
                  </li>
                </ul>
                <NuxtLink :to="article._path"
                  class="linkButton sm:mb-4">Read More</NuxtLink>
              </header>
            </li>
          </ul>
        </template>
        <!-- Not found slot to display message when no content us is found -->
        <template #not-found>
          <p>No articles found.</p>
        </template>
      </ContentList>
      <PaginationBlog v-if="allBlogs.length > 5"
        :numPages="numPages"
        :current="page" />
    </section>
  </div>
</template>
