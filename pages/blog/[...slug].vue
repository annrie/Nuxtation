<script setup lang="ts">
import type { BlogPost } from "~/types/index.ts";

const { path } = useRoute();
const cleanPath = path.replace(/\/$/, "");
const { data } = await useAsyncData(`content-${cleanPath}`, async () => {
  // fetch document where the document path matches with the cuurent route
  let article = queryContent<BlogPost>("blog").where({ _path: cleanPath }).findOne();
  // get the surround information,
  // which is an array of documeents that come before and after the current document
  let surround = queryContent<BlogPost>("blog")
    .only(["_path", "title", "description"])
    .sort({ publishedAt: -1 })
    .findSurround(path, { before: 1, after: 1 });

  return {
    article: await article,
    surround: await surround,
  };
});

// const components = {
//   p: 'CustomParagraph'
// };

// destrucure `prev` and `next` value from data
// findSurroundメソッドの返す配列はnullを含む場合があるので、配列の分割代入をするときには、nullを考慮する必要がある
let prev: any, next: any;
if (data?.value && data?.value?.surround) {
  [prev, next] = data?.value?.surround;
}

definePageMeta({
  layout: false,
});
// replaceHyphenを自分で定義する
const replaceHyphen = (tags: string) => tags.replace(/-/g, " ");

useHead({
  title: data?.value?.article.title,
  meta: [
    { name: "description", content: data?.value?.article.description },
    {
      property: "og:image",
      content: `https://nuxtation.imgix.app/${data?.value?.article.img}`,
    },
    {
      property: "og:title",
      content: data?.value?.article.title,
    },
  ],
});

useSeoMeta({
  title: () => data?.value?.article.title,
  ogTitle: () => data?.value?.article.title,
  ogType: () => "article",
  ogUrl: () => `https://nuxtation.phantomoon.com/${data?.value?.article._path}`,
  twitterTitle: () => data?.value?.article.title,
  description: () => data?.value?.article.description,
  ogImage: () =>
    `https://nuxtation.imgix.net/${data?.value?.article.img}?txt=${data?.value?.article.title}&txt-size=132&txt-color=white&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=crop&blur=50`,
  twitterImage: () =>
    `https://nuxtation.imgix.net/${data?.value?.article.img}?txt=${data?.value?.article.title}&txt-size=132&txt-color=white&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&blur=50&auto=format,compress&fit=crop`,
  ogDescription: () => data?.value?.article.description,
  twitterDescription: () => data?.value?.article.description,
});
const { $formatDate } = useNuxtApp();
</script>
<template>
    <div>
      <NuxtLayout name="blog">
          <!-- Breadcrumbs -->
    <div
      class="md:(flex flex-row justify-between mb-8 pt-8) mb-6 at-sm:(flex-none text-center pt-12 mb-8)"
    >
      <!-- Breadcrumbs -->
      <ol
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
        class="blog-breadcrumb at-sm:(border-r-none)"
      >
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <a itemprop="item" href="/">
            <span itemprop="name"
              ><Icon align-top mb-5px name="line-md:home-md-twotone" /></span
          ></a>
          <meta itemprop="position" content="1" />
        </li>
        <li class="separator">&gt;</li>
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
        <li class="separator">&gt;</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">{{ data?.article.title }}</span>
          <meta itemprop="position" content="3" />
        </li>
      </ol>
      <!-- Publish date -->
      <span
        class="font-light text-text-jis-blue/75 dark:text-white/75 mt-2 md:mt-0 at-sm:block"
        ><Icon pr-2 name="streamline:chat-bubble-square-write" />{{
          $formatDate(data?.article.publishedAt)
        }}<span v-if="data?.article.updatedAt"
          ><Icon name="eos-icons:arrow-rotate" />
          <Icon pr-2 name="streamline:chat-bubble-square-write-solid" />{{
            $formatDate(data?.article.updatedAt)
          }}</span
        ></span
      >
    </div>

    <header class="article-header">
      <NuxtPicture
        provider="imgix"
        :src="data?.article.img"
        :alt="data?.article.title"
        format="avif,webp"
        :modifiers="{
          auto: 'format,enhance',
        }"
        :imgAttrs="{
          class:
            'rounded mt-4 text-center mb-8 w-full sm:max-h-200px tb:max-h-500px lg:max-h-700px',
        }"
      />
      <h1 class="heading">{{ data?.article.title }}</h1>
      <p class="supporting">{{ data?.article.description }}</p>
      <ul class="article-tags">
        <li class="tag" v-for="(tag, n) in data?.article.tags" :key="n">
          {{ replaceHyphen(tag) }}
        </li>
      </ul>
      <!-- Social Share -->
      <div class="flex mt-6 mb-6 md:mt-0 justify-center">
        <NavShareIcons
          :headline="data?.article.title"
          :excerpt="data?.article.description"
          :path="data?.article._path + '/'"
        />
      </div>
    </header>
    <hr class="dark:bg-light-300" />
    <section class="article-section">
      <aside class="aside h-fit">
        <!-- Toc Component -->
        <Toc :links="data?.article?.body?.toc?.links" />
        <!-- Related articles -->
        <div
          v-if="data && data?.surround?.filter((elem: any) => elem !== null)?.length > 0"
          class="related lt-lg:hidden"
        >
          <RelatedArticles :surround="data?.surround" class="blog-post-text" />
        </div>
      </aside>
      <article class="article prose dark:prose-invert">
        <!-- render document coming from query -->
        <ContentRenderer :value="data?.article">
          <!-- render rich text from document -->
          <!-- <ContentRendererMarkdown :value="data.article" :components="components" /> -->
          <ContentRendererMarkdown :value="data?.article" />
          <!-- display if document content is empty -->
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </article>
    </section>
    <!-- PrevNext Component -->
    <PrevNext :prev="prev" :next="next" />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.article-header {
  @apply: text-center p-4 pb-12;
}

.article-header .heading {
  @apply: font-extrabold mt-8 lt-md:text-3xl tb:text-5xl;
}

.article-header .supporting {
  @apply font-medium text-lg sm:mt-4 tb:my-8;
}

.article-section {
  @apply relative m-auto max-w-5xl grid p-4 grid-cols-8;
}

.article-tags {
  @apply border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-0 text-white text-sm w-full gap-2 items-center justify-center uppercase lt-md:text-base;

  .tag {
    @apply rounded-md bg-pink-100 border-zinc-600 text-sm p-2 py-1 text-dark-700 items-center justify-center dark: (bg-slate-100 text-slate-700) hover:-translate-y-0.5;
  }
}

aside {
  @apply w-full col-span-full sm:(order-1 col-span-full) lg:(order-2 col-span-2);
}

.aside {
  @apply sticky pt-10 z-0;
  @screen sm {
    top: calc(theme("spacing.nav_sm") - 4.3rem);
  }
  @screen tb {
    top: calc(theme("spacing.nav") - 3.25rem);
  }
}
.article {
  @apply mx-auto w-full col-span-full p-4 md:col-start-1 sm:order-2 lg:(order-1 col-span-6);
}
</style>
