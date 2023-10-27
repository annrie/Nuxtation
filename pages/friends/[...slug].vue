<script setup lang="ts">
import type { FriendsPost } from "~/types";

const { path } = useRoute();
const cleanPath = path.replace(/\/$/, "");
const { data } = await useAsyncData(`content-${cleanPath}`, async () => {
  // fetch document where the document path matches with the cuurent route
  let article = queryContent<FriendsPost>("friends")
    .where({ _path: cleanPath })
    .findOne();
  // get the surround information,
  // which is an array of documeents that come before and after the current document
  let surround = queryContent<FriendsPost>("friends")
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
  console.log({ data, prev, next });
}

definePageMeta({
  layout: "blog",
});
// replaceHyphenを自分で定義する
const replaceHyphen = (tags: string) => tags.replace(/-/g, " ");
// set the meta
useHead({
  title: data?.value?.article.title,
  meta: [
    { name: "description", content: data?.value?.article.description },
    {
      property: "og:image",
      content: `https://nuxtation.vercel.app/${data?.value?.article.img}`,
    },
    {
      property: "og:title",
      content: data?.value?.article.title,
    },
  ],
});
</script>
<template>
  <div>
    <!-- Breadcrumbs -->
    <div
      class="pt-10 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
    >
      <!-- <SBreadcrumb :items="items" :ui="ui" /> -->
      <!-- Publish date -->
      <span class="font-light text-text-jis-blue/75 dark:text-white/75 mt-2 md:mt-0">{{
        $formatDate(data?.article.publishedAt)
      }}</span>
    </div>
    <header class="article-header">
      <NuxtPicture
        provider="imgix"
        :src="data?.article.img"
        :alt="data?.article.title"
        format="avif,webp"
        preset="cover"
        class="rounded mt-4 text-center mb-8 w-full sm:max-h-200px tb:max-h-500px lg:max-h-700px"
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
          v-if="data && data.surround?.filter((elem) => elem !== null)?.length > 0"
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
    <footer>
      <!-- Author -->
      <div
        v-if="data?.article.author !== null"
        class="container mx-auto my-8 grid gap-x-4 lt-md:grid-cols-1 tb:grid-cols-2"
      >
        <!-- <NuxtLink :to="`/friends/author/${author}`"> -->
        <p class="grid grid-cols-1">
          <nuxt-picture
            provider="imgix"
            :src="data?.article?.author?.photo"
            :alt="data?.article.title"
            preset="cover"
            format="avif,webp"
            fit="cover"
            class="rounded h-auto w-full transition-all duration-400 lt-md:(h-a uto text-center)"
          />
        </p>
        <div class="mt-4 grid grid-cols-1 row-span -6">
          <p>{{ data?.article?.author?.name }}</p>
          <p class="mt-8">{{ data?.article?.author?.bio }}</p>
        </div>
        <!-- </NuxtLink> -->
      </div>
    </footer>
    <!-- PrevNext Component -->
    <PrevNext :prev="prev" :next="next" />
  </div>
</template>

<style scoped lang="scss">
.article-header {
  @apply: text-center p-4 pb-12;
}

.article-header .heading {
  @apply: font-extrabold mt-8 lt-md: text-3xl tb:text-5xl;
}

.article-header .supporting {
  @apply: font-medium text-lg sm: mt-4 tb:my-8;
}

.article-section {
  @apply: relative m-auto max-w-5xl grid p-4 grid-cols-8;
}

.article-tags {
  --uno: border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-0 text-white text-sm w-full gap-2 items-center justify-center uppercase lt-md:text-base;

  .tag {
    @apply: rounded-md bg-pink-100 border-zinc-600 text-sm p-2 py-1 text-dark-700 items-center justify-center dark: (bg-slate-100 text-slate-700) hover:-translate-y-0.5;
  }
}

aside {
  @apply: w-full col-span-full sm:(order-1 col-span-full) lg:(order-2 col-span-2);
}

.aside {
  @apply: sticky pt-10 z-0;

  @screen sm {
    top: calc(theme("spacing.nav_sm") - 4.3rem);
  }


  @screen tb {
    top: calc(theme("spacing.nav") - 3.25rem);
  }
}

.article {
  @apply: mx-auto w-full col-span-full p-4 md:col-start-1 sm:order-2 lg:(order-1 col-span-6);
}
</style>
