<script setup lang="ts">
import type { BlogPostPreview } from "~/types/index.ts";
// import type { BlogPostPreview, FriendsPostPreview } from "~/types";

const { data: pageVisits } = await useFetch(() => `/api/kv`);
const refreshPage = () => {
  window.location.reload();
};

// defineOgImageComponent("BlogPost", {
//   title: "Nuxtation  👋",
//   borderColor: "green-300",
//   description: "annrie's blog",
// });

const { data: featuredPost } = await useAsyncData("featured-post", () =>
  queryContent<BlogPostPreview>("/blog")
    .where({ published: { $ne: false } })
    .without("body")
    .sort({ publishedAt: -1 })
    .limit(1)
    .findOne()
);

const { data: articles } = await useAsyncData("articles-home", () =>
  queryContent<BlogPostPreview>("/blog")
    // .where({ published: { $ne: false } })
    .without("body")
    .skip(1)
    .sort({ publishedAt: -1 })
    .limit(6)
    .find()
);

useHead({
  title: null,
  //   bodyAttrs: {
  //     class: 'home'
  //  }
});
useSeoMeta({
  ogUrl: () => "https\://nuxtation.vercel.app/",
});
// const ogImageOptions = {
//   title: "Nuxtation",
//   width: 1200,
//   height: 630,
//   fit: "cover",
//   format: "png",
//   background: "rgb:ffffff",
// };

// defineOgImage(ogImageOptions);
</script>
<template>
  <div>
    <NuxtLayout>
      <TopAppLogo class="mb-6 sm:ml-100px tb:ml-70px lg:ml-80px" />
      <TopAppSubtitle id="featured-posts">注目記事</TopAppSubtitle>
      <TopFeaturedSection
        v-if="featuredPost !== null"
        aria-labelledby="featured-posts"
        :item="featuredPost"
        section="blog"
      />

      <section aria-labelledby="recent-posts">
        <NuxtLink to="/blog">
          <TopAppSubtitle id="recent-posts">最近のブログ記事</TopAppSubtitle>
        </NuxtLink>
        <TopCardList
          id="recnet-posts"
          v-if="articles !== null"
          :list="articles"
          section="blog"
        />
      </section>

      <!-- <section aria-labelledby="recent-friends">
      <NuxtLink to="/friends">
        <TopAppSubtitle id="recent-friends">最新のメンバー記事</TopAppSubtitle>
      </NuxtLink>

      <TopCardList
        id="recent-friends"
        v-if="friendsPost !== null"
        :list="friendsPost"
        section="friends"
      />
    </section> -->

      <section aria-labelledby="vercel-kv" class="mt-10">
        <button
          @click="refreshPage()"
          class="mb-6 font-bold underline opacity-70 hover:opacity-100"
        >
          Refresh page
        </button>
        <div class="" text-5xl font-bold>{{ pageVisits?.pageVisits }}</div>
      </section>
      <!-- <template #fallback>
    <div op50 italic>
      <span animate-pulse>Loading...</span>
    </div>
  </template> -->
    </NuxtLayout>
  </div>
</template>
