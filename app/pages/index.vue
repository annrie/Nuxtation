<script setup lang="ts">
import type { BlogPostPreview } from "~~/types/index.ts";

const { data: pageVisits } = await useFetch(() => `/api/kv`);
const refreshPage = () => {
  window.location.reload();
};

// defineOgImageComponent("BlogPost", {
//   title: "Nuxtation  👋",
//   borderColor: "green-300",
//   description: "annrie's blog",
// });

const { data: featuredPost } = await useAsyncData('featured-article', () => queryCollection<BlogPostPreview>("blog")
	.order('updatedAt', 'DESC')
	//    .select('feature', '=', true)
	.limit(1)
	.first()
);

const { data: articles } = await useAsyncData('articles-home',
	() => queryCollection<BlogPostPreview>('blog')
	.order('updatedAt', 'DESC')
	.skip(1)
	.limit(6)
	.all()
)

useHead({
  title: null,
  //   bodyAttrs: {
  //     class: 'home'
  //  }
});
useSeoMeta({
  ogUrl: () => "https\://nuxtation.vercel.app/",
});
</script>
<template>
  <div>
      <AppLogo class="mb-6 sm:ml-100px tb:ml-70px lg:ml-80px" />
      <AppSubtitle id="featured-posts">注目記事</AppSubtitle>
      <FeaturedSection
        v-if="featuredPost !== null"
        aria-labelledby="featured-posts"
        :item="featuredPost"
        section="blog"
      />

      <section aria-labelledby="recent-posts">
        <NuxtLink to="/blog">
          <AppSubtitle id="recent-posts">最近のブログ記事</AppSubtitle>
        </NuxtLink>
        <CardList
		  v-if="articles !== null"
          id="recnet-posts"
          :list="articles"
          section="blog"
        />
      </section>

      <section aria-labelledby="vercel-kv" class="mt-10">
        <button
          @click="refreshPage()"
          class="mb-6 font-bold underline opacity-70 hover:opacity-100"
        >
          Refresh page
        </button>
        <div class="" text-5xl font-bold>{{ pageVisits?.pageVisits }}</div>
      </section>
  </div>
</template>
