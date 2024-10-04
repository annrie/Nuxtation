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
const title: string = `Blog Posts on ${slug.toUpperCase()}`;
const description: string = `Here\'s a list of all my blog posts with the ${slug.toUpperCase()} tag`;
const section: Sections = "blog";

definePageMeta({
  layout: false,
});

// set meta for page
useHead({
  title,
  meta: [{ name: "description", content: description }],
});
</script>
<template>
      <div>
        <NuxtLayout name="blog">
      <div class="mb-6 pt-8 md:mb-8">
        <!-- <Breadcrumbs /> -->
        <ol
          itemscope
          itemtype="https://schema.org/BreadcrumbList"
          class="blog-breadcrumb"
        >
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a itemprop="item" href="/">
              <span itemprop="name"
                ><Icon mb-5px align-top name="line-md:home-md-twotone" /></span
            ></a>
            <meta itemprop="position" content="1" />
          </li>
          <li class="separator">&gt;</li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <a
              itemscope
              itemtype="https://schema.org/WebPage"
              itemprop="item"
              itemid="blog"
              href="/blog"
            >
              <span itemprop="name">Blog</span></a
            >
            <meta itemprop="position" content="2" />
          </li>
          <li class="separator">&gt;</li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name" uppercase>{{ slug }}</span>
            <meta itemprop="position" content="3" />
          </li>
        </ol>
        <header class="lt-md:prose-md tb:prose-lg sm:(mt-5 p-5) tb:mt-15 tb:p-12">
          <div class="mx-auto max-w-3xl text-center">
            <h1
              class="mb-5 mt-10 font-extrabold lt-md:text-3xl tb:text-5xl !line-height-15"
            >
              All articles with <span uppercase underline underline-wavy>{{ slug }}</span>
            </h1>
            <p class="text-lg font-medium">Here's a list of all my great articles</p>
          </div>
        </header>
        <section class="page-section">
          <Tags :section="section" />
          <NuxtLink to="/blog">
            <p class="ml-1 text-center text-2xl underline">Back to All Articles</p>
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
            <template #default="{ list }">
              <ul class="mx-auto w-full">
                <li
                  v-for="article in list"
                  :key="article._path"
                  class="blogCard grid mt-3rem items-center gap-x-2 pt-0 tb:grid-cols-[1.5fr_1fr] lt-md:grid-cols-1"
                >
                  <NuxtPicture
                    provider="imgix"
                    :src="article.img"
                    :alt="article.title"
                    fit="cover"
                    format="avif,webp"
                    class="rounded-5px transition-all duration-400 at-sm:ml-10%"
                  />
                  <header class="pl-0.8rem lt-md:(mt-4 text-center) tb:text-left">
                    <h1 class="text-xl font-semibold">
                      {{ article.title }}
                    </h1>
                    <p text-base>
                      {{ article.description }}
                    </p>
                    <ul class="tags-list">
                      <li v-for="(tag, n) in article.tags" :key="n" class="tags">
                        <NuxtLink :to="`/blog/tags/${tag}`">
                          {{ tag }}
                        </NuxtLink>
                      </li>
                    </ul>
                    <NuxtLink :to="article._path" class="linkButton_s">
                      読んでみる
                    </NuxtLink>
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
    </NuxtLayout>
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
    a:not(.router-link-exact-active, .router-link-active) {
      @apply py-1 px-3 transition-all  whitespace-nowrap bg-gray-300 text-jis-blue p-2 hover:(bg-jis-blue:50 text-white underline);
    }
  }

  .router-link-active,
  .router-link-exact-active {
    @apply text-white bg-jis-blue:500 p-3;
  }
}
</style>
