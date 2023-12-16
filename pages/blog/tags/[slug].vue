<script setup lang="ts">
import type { Sections } from "~/types/index.ts";

type Params = {
  slug: string;
};

// get current route
// useRoute()の戻り値をParams型にキャストする
const {
  params: { slug },
} = useRoute() as { params: Params };

// const filtered = slug.split(",");
const filtered = ref(slug ? (Array.isArray(slug) ? slug : slug.split(",")) : []);
console.log({ filtered });

//const topic: string = replaceHyphen(slug as string);
const title: string = `Blog Posts on ${slug}`;
const description: string = `Here's a list of all my blog posts with the ${slug} tag`;
const section: Sections = "blog";

definePageMeta({
  key: (route) => route.fullPath,
  layout: "blog",
});

// set meta for page
useHead({
  title,
  meta: [{ name: "description", content: description }],
});
</script>
<template>
  <div>
    <!-- <div
      class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
    >
      <ol itemscope itemtype="https://schema.org/BreadcrumbList" class="blog-breadcrumb">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="/"> <span itemprop="name">Home</span></a>
          <meta itemprop="position" content="1" />
        </li>
        <li class="separator">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a
            itemscope
            itemtype="https://schema.org/WebPage"
            itemprop="item"
            itemid="/blog/"
            href="/blog"
          >
            <span itemprop="name">Blog</span></a
          >
          <meta itemprop="position" content="2" />
        </li>
        <li class="separator">/</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">{{ slug }}</span>
          <meta itemprop="position" content="3" />
        </li>
      </ol>
    </div> -->
    <header class="lt-md:mt-5 lt-md:p-5 lt-md:prose-md tb:mt-15 tb:p-12 tb:prose-lg">
      <div class="mx-auto text-center max-w-3xl">
        <h1 class="font-extrabold mt-10 mb-5 !line-height-15 lt-md:text-3xl tb:text-5xl">
          All articles with <span underline underline-wavy uppercase>{{ slug }}</span>
        </h1>
        <p class="font-medium text-lg">Here's a list of all my great articles</p>
      </div>
    </header>
    <section class="mx-auto max-w-3xl p-4 py-0">
      <Tags :section="section" />
      <NuxtLink to="/blog">
        <p class="ml-1 text-2xl underline text-center">Back to All Articles</p>
      </NuxtLink>
      <!-- Render list of all articles in ./content/blog using `path` -->
      <!-- Provide only defined fields in the `:query` prop -->
      <ContentList
        path="/blog"
        :query="{
          only: ['title', 'description', 'tags', '_path', 'img'],
          where: [
            {
              tags: {
                $contains: filtered,
              },
            },
          ],
          $sensitivity: 'base',
        }"
      >
        <!-- Default list slot -->
        <template v-slot="{ list }">
          <ul class="mx-auto max-w-800px">
            <li
              v-for="article in list"
              :key="article._path"
              class="container border-t border-slate-200 mt-5rem grid pt-6 items-center lt-sm:grid-cols-1 md:grid-cols-[1fr_2fr] first-of-type:border-none"
            >
              <NuxtPicture
                provider="imgix"
                :src="article.img"
                :alt="article.title"
                fit="cover"
                format="avif,webp"
                class="rounded-5px transition-all duration-400"
              />
              <header class="pl-0.8rem lt-md:(text-center mt-4) tb:text-left">
                <h1 class="font-semibold text-2xl">{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <ul class="tags-list">
                  <li class="tags" v-for="(tag, n) in article.tags" :key="n">
                    <NuxtLink :to="`/blog/tags/${tag}`">
                      {{ tag }}
                    </NuxtLink>
                  </li>
                </ul>
                <NuxtLink :to="article._path" class="linkButton">Read More</NuxtLink>
              </header>
            </li>
          </ul>
        </template>

        <!-- Not found slot to display message when no content us is found -->
        <template #not-found>
          <p>No articles found.</p>
        </template>
      </ContentList>
    </section>
  </div>
</template>

<style scope lang="scss">
// html,
// body {
//   height: 100%;
// }

// body > div footer {
//   position: sticky;
//   top: 100vh;
// }
.tags-list {
  @apply border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-0 text-white text-sm w-full gap-2 uppercase lt-md:(text-base justify-center);

  .tags {
    @apply rounded-5px text-sm p-0 py-1 text-dark-700 dark:text-jis-blue:500 hover:-translate-y-0.5;
    a {
      @apply py-1 px-3 transition-all  whitespace-nowrap hover:(bg-jis-blue:50 text-white:50 underline);
    }
  }

  .router-link-active,
  .router-link-exact-active {
    @apply text-white bg-jis-blue:500 px-3;
  }
}
</style>
