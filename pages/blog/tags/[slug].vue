<script setup lang="ts">
import type { BlogPost, Sections } from "~/types";

type Params = {
  slug: string;
};

// get current route
// useRoute()の戻り値をParams型にキャストする
const {
  params: { slug },
} = useRoute() as { params: Params };

const filtered = slug.split(",");
console.log({ filtered });

const topic: string = replaceHyphen(slug as string);
const title: string = `Blog Posts on ${slug}`;
const description: string = `Here's a list of all my blog posts with the ${slug} tag`;
const section: Sections = "blog";

definePageMeta({
  key: (route) => route.fullPath,
});

// set meta for page
useHead({
  title,
  meta: [{ name: "description", content: description }],
});
</script>
<template>
  <div>
    <!-- <NuxtLayout> -->
    <header class="lt-md:mt-5 lt-md:p-5 lt-md:prose-md tb:mt-15 tb:p-12 tb:prose-lg">
      <div class="mx-auto text-center max-w-3xl">
        <h1 class="font-extrabold lt-md: text-3xl tb:text-5xl">
          All articles with "{{ slug }}"
        </h1>
        <p class="font-medium text-lg">Here's a list of all my great articles</p>
      </div>
    </header>
    <section class="mx-auto max-w-3xl p-4 py-0">
      <Tags :section="section" />
      <NuxtLink to="/blog">
        <p class="ml-1 text-2xl underline">Back to All Articles</p>
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
              <nuxt-picture
                provider="imgix"
                :src="article.img"
                :alt="article.title"
                fit="cover"
                format="avif,webp"
                class="rounded transition-all duration-400 hover:scale-100"
              />
              <header class="pl-0.8rem lt-md:(text-center mt-4) tb:text-left">
                <h1 class="font-semibold text-2xl">{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <ul class="tags-list">
                  <li class="tags" v-for="(tag, n) in article.tags" :key="n">
                    <NuxtLink :to="`/blog/tags/${tag}`">
                      {{ replaceHyphen(tag) }}
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
.tags-list {
  @apply border border-transparent rounded-lg flex flex-wrap font-normal my-4 mx-0 text-white text-sm w-full gap-2 uppercase lt-md:(text-base justify-center);

  .tags {
    @apply text-sm p-0 py-1 text-dark-700 dark: text-blue-500 hover:-translate-y-0.5;
    a {
      @apply py-1 px-0 transition-all  whitespace-nowrap hover:(bg-blue-500 underline);
    }
  }
  .router-link-active,
  .router-link-exact-active {
    @apply text-white bg-blue-500 px-1;
  }
}
</style>
