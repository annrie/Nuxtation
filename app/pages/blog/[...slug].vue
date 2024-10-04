<script setup lang="ts">
import type { BlogPost } from "~~/types/index.ts";

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
      <ContentRenderer v-if="data" :value="data">
        <div
          class="mb-6 lt-lg:(mb-2 flex-none pt-2) lg:(w-full mb-8 flex flex-row justify-between pt-8)"
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
          <div
            class="mt-2 font-light at-sm:mt--2 md:mt-0 lt-lg:text-right dark:text-white/75"
          >
        <Icon pr-2 name="streamline:chat-bubble-square-write" />{{
          $formatDate(data?.article.publishedAt)
        }}<span v-if="data?.article.updatedAt"
          ><Icon name="eos-icons:arrow-rotate" />
          <Icon pr-2 name="streamline:chat-bubble-square-write-solid" />{{
            $formatDate(data?.article.updatedAt)
          }}</span
        ></div
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
      <div class="mb-6 mt-6 flex justify-center md:mt-0">
        <NavShareIcons
          :headline="data?.article.title"
          :excerpt="data?.article.description"
          :path="`${data?.article._path}/`"
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
          <article class="article prose dark:prose-invert mx-10px">
            <!-- render rich text from document -->
            <ContentRendererMarkdown :value="data?.article">
              <!-- display if document content is empty -->
              <template #empty>
                <DocumentDrivenEmpty :value="toValue" />
              </template>
            </ContentRendererMarkdown>
          </article>
    </section>
    <!-- PrevNext Component -->
    <PrevNext :prev="prev" :next="next" :section="'blog'" class="w-90% mx-auto" />
      </ContentRenderer>
      <DocumentDrivenNotFound v-else />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.article-header {
  @apply: text-center p-4 pb-12;
}

.article-header .heading {
  @apply font-extrabold mt-8 lt-md:text-xl tb:text-3xl lg:text-5xl;
}

.article-header .supporting {
  @apply font-medium text-lg sm:mt-4 tb:my-8 leading-normal;
}

.article-tags {
  @apply border border-transparent rounded-lg flex flex-nowrap font-normal my-4 mx-2 text-white text-sm w-full gap-2 justify-center uppercase;

  .tag {
    @apply rounded-lg bg-pink-300 border-zinc-600 text-base line-height-normal align-text-bottom whitespace-nowrap px-2 py-1.5 text-dark-700 dark:(bg-slate-100 text-slate-700) hover:-translate-y-0.5;
  }
}

.prose {
  @apply max-w-100vw;
}

.article-section {
  @apply relative mx-auto grid grid-cols-12 gap-col-lg  p-4 sm:(w-full) lg:(w-full px-10);
}

.article {
  @apply p-4 sm:(order-2 col-span-full mt-1) md:mt-0 lg:(order-1 col-span-8 mt-4rem);
}

.aside {
  @apply sticky pt-10 z-0 sm:(order-1 col-span-full grid-items-center top-6) tb:(top-2.25rem col-span-full) lg:(order-2 col-span-4 w-full);
}

:deep(.video-player) {
  @apply w-full;
}

:deep(.video-player img) {
  @apply w-full;
}
:deep(li) {
  @apply text-left;
  :deep(img) {
    @apply block mx-auto text-center;
  }
}
:deep(p) {
  @apply text-black dark:text-white;
  .prose-img {
    @apply mx-auto max-w-full px-10px;
  }
}

:deep(h2) {
  @apply my-0 mx-0 p-0.8em text-center font-bold tb:text-2.75rem border-2 border-#b92a2c rounded-10px sm:text-h3_sm text-black dark:text-white;
  a {
    @apply no-underline leading-snug;
  }
}
:deep(h3),
:deep(h4),
:deep(h5) {
  @apply text-black dark:text-white text-h4 leading-relaxed;

  a {
    @apply no-underline;
  }
}
:deep(h3 :not(.link-card-content)) {
  @apply relative text-20px leading-base mt-30px mb-0 mx-0 pt-14px pb-10px pl-10px pr-5px at-sm:ml-10px;

  &::before {
    @apply content-empty absolute top-0 left--5px bg-#999 w-12px h-12px transform-rotate-45;
  }

  &::after {
    @apply content-empty absolute top-15px left--10px bg-#777 w-8px h-8px transform-rotate-15;
  }
}
:deep(h4) {
  @apply relative mt-0 mb-0.8em py-0.5em pl-1.5em pr-0 border-2 border-solid border-#b92a2c font-bold text-h4_sm;

  &::before {
    @apply content-empty absolute top-50% left-0.5em mt--15px bg-#b92a2c w-8px h-30px border-rd-2px;
  }
}
:deep(h5)  {
  @apply ml-3rem;
  a {
    @apply relative pt-15px pr-5px pb-10px pl-0 mt-30px mx--30px mb-10px;

    &::after {
      @apply absolute bottom-0 left-0 w-100% content-empty border-b-1 border-b-dashed border-b-#777;
    }
  }
  }
</style>
