<script setup lang="ts">
import type { BlogPostPreview, FriendsPostPreview } from "~/types";

const { data: articles } = await useAsyncData("articles-home", () =>
  queryContent<BlogPostPreview>("blog")
    .where({ published: { $ne: false } })
    .without("body")
    .skip(1)
    .sort({ publishedAt: -1 })
    .limit(6)
    .find()
);

const { data: featuredPost } = await useAsyncData("featured-article", () =>
  queryContent<BlogPostPreview>("blog")
    .where({ published: { $ne: false } })
    .without("body")
    .sort({ publishedAt: -1 })
    .limit(1)
    .findOne()
);

const { data: friendsPost } = await useAsyncData("friends-home", () =>
  queryContent<FriendsPostPreview>("friends")
    .where({ published: { $ne: false } })
    .without("body")
    .sort({ publishedAt: -1 })
    .limit(3)
    .find()
);

useHead({
  title: null,
  //   bodyAttrs: {
  //     class: 'home'
  //  }
});
</script>
<template>
<div>
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

  <section aria-labelledby="recent-friends">
    <NuxtLink to="/friends">
      <TopAppSubtitle id="recent-friends">最新のメンバー記事</TopAppSubtitle>
    </NuxtLink>

    <TopCardList
      id="recent-friends"
      v-if="friendsPost !== null"
      :list="friendsPost"
      section="friends"
    />
  </section>

  <!-- <template #fallback>
    <div op50 italic>
      <span animate-pulse>Loading...</span>
    </div>
  </template> -->
  </div>
</template>
