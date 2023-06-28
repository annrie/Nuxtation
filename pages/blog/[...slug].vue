<script setup lang="ts">
import type { BlogPost } from "~/types";

const { path } = useRoute();
const { data } = await useAsyncData(`content-${path}`, async () => {
  // fetch document where the document path matches with the cuurent route
  let article = queryContent<BlogPost>().where({ _path: path }).findOne();
  // get the surround information,
  // which is an array of documeents that come before and after the current document
  let surround = queryContent<BlogPost>()
    .only(["_path", "title", "description"])
    .sort({ publishedAt: 1 })
    .findSurround(path);

  return {
    article: await article,
    surround: await surround,
  };
});

// const components = {
//   p: 'CustomParagraph'
// };

// destrucure `prev` and `next` value from data
if (data.value !== null) {
  const [prev, next] = data.value.surround;
  console.log({ data, prev, next });
}
definePageMeta({
  layout: false,
});

if (data.value !== null) {
  // set the meta
  useHead({
    title: data.value.article.title,
    meta: [
      { name: "description", content: data.value.article.description },
      {
        property: "og:image",
        content: `https://nuxtation.phantomoon.com/${data.value.article.img}`,
      },
      {
        property: "og:title",
        content: data.value.article.title,
      },
    ],
  });
}
</script>
<template>
  <div>
    <NuxtLayout name="blog">
      <div class="article-main">
        <!-- Breadcrumbs -->
        <div
          class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
        >
          <ol
            itemscope
            itemtype="https://schema.org/BreadcrumbList"
            class="blog-breadcrumb"
          >
            <li
              itemprop="itemListElement"
              itemscope
              itemtype="https://schema.org/ListItem"
            >
              <NuxtLink itemprop="item" to="/">
                <span itemprop="name">Home</span></NuxtLink
              >
              <meta itemprop="position" content="1" />
            </li>
            <li class="separator">/</li>
            <li
              itemprop="itemListElement"
              itemscope
              itemtype="https://schema.org/ListItem"
            >
              <NuxtLink
                itemscope
                itemtype="https://schema.org/WebPage"
                itemprop="item"
                itemid="/blog/"
                to="/blog/"
              >
                <span itemprop="name">Blog</span></NuxtLink
              >
              <meta itemprop="position" content="2" />
            </li>
            <li class="separator">/</li>
            <li
              itemprop="itemListElement"
              itemscope
              itemtype="https://schema.org/ListItem"
            >
              <span itemprop="name">{{ data.article.title }}</span>
              <meta itemprop="position" content="3" />
            </li>
          </ol>
        </div>

        <header class="article-header">
          <nuxt-img
            :src="data.article.img"
            :alt="data.article.title"
            preset="blog"
            class="rounded mt-4 text-center mb-8 w-full sm:max-h-200px tb:max-h-500px lg:max-h-700px"
          />
          <h1 class="heading">{{ data.article.title }}</h1>
          <p class="supporting">{{ data.article.description }}</p>
          <ul class="article-tags">
            <li class="tag" v-for="(tag, n) in data.article.tags" :key="n">
              {{ replaceHyphen(tag) }}
            </li>
          </ul>
        </header>
        <hr class="dark:bg-light-300" />
        <section class="article-section">
          <aside class="aside">
            <!-- Toc Component -->
            <Toc :links="data.article.body.toc.links" />
          </aside>
          <article class="article prose dark:prose-invert">
            <!-- render document coming from query -->
            <ContentRenderer :value="data.article">
              <!-- render rich text from document -->
              <!-- <ContentRendererMarkdown :value="data.article" :components="components" /> -->
              <ContentRendererMarkdown :value="data.article" />
              <!-- display if document content is empty -->
              <template #empty>
                <p>No content found.</p>
              </template>
            </ContentRenderer>
          </article>
        </section>
        <!-- PrevNext Component -->
        <PrevNext :prev="prev" :next="next" />
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
// .article-main {
// @apply m-auto max-w-5xl p-4;
// }

.article-header {
  --at-apply: text-center p-4 pb-12;
}

.article-header .heading {
  --at-apply: font-extrabold lt-md: text-3xl tb:text-5xl;
}

.article-header .supporting {
  --at-apply: font-medium text-lg sm: mt-4 tb:my-8;
}

.article-section {
  --at-apply: m-auto max-w-5xl grid p-4 grid-cols-8;
}

.article-tags {
  --uno: border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-0 text-white text-sm w-full gap-2 items-center justify-center uppercase <md: text-base;

  .tag {
    --at-apply: rounded-md bg-pink-100 border-zinc-600 text-sm p-2 py-1 text-dark-700 items-center justify-center dark: (bg-slate-100 text-slate-700) hover:-translate-y-0.5;
  }
}

.aside {
  --at-apply: w-full col-span-full pt-14 lg: order-2 lg:col-span-2;
  &.toc {
    --uno: top-24 z-2 sticky;
  }
}

.article {
  --at-apply: mx-auto w-full col-span-full p-4 md:col-start-1 lg:order-1 lg:col-span-6;
}
</style>
