<script setup lang="ts">
import { Buffer } from "buffer";
import type { BlogPost, Sections } from "~~/types/index.ts";

type Params = {
  slug: string;
};

// get current route
// useRoute()の戻り値をParams型にキャストする
const {
  params: { slug },
} = useRoute() as { params: Params };

const route = useRoute();
const { data: articles } = await useAsyncData(`articles-${slug}`,
	() => queryCollection('blog')
	.where('tags', 'LIKE', `%${slug}%`)
	.order('updatedAt', 'DESC')
	.all(),
)

// get current route
// useRoute()の戻り値をParams型にキャストする
//const {
//  params: { slug },
//} = useRoute() as { params: Params };

// const filtered = slug.split(",");
const filtered = ref(slug ? (Array.isArray(slug) ? slug : slug.split(",")) : []);


// const topic: string = replaceHyphen(slug as string);
const title: string = `Blog Posts on ${slug.toUpperCase()}`;
const description: string = `Here\'s a list of all my blog posts with the ${slug.toUpperCase()} tag`;
const section: Sections = "blog";

definePageMeta({
		layout: false,
});

const encoded1 = Buffer.from(`${title}`)
.toString("base64")
.replace(/\s/g, "%20")
.replace(/=/g, "");
	// set meta for page
	useHead({
			title,
			meta: [{ name: "description", content: description }],
	});

	useSeoMeta({
			ogType: () => "article",
			// ogUrl: () => `https://nuxtation.phantomoon.com/blog/tags/${slug}`,
			twitterDescription: () => description,
			twitterImage: () =>
			`https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
			ogImage: () =>
			`https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
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
              <span>All</span> <span>articles</span> <span>with</span> <span uppercase underline underline-wavy>{{ slug }}</span>
            </h1>
            <p class="text-lg font-medium">Here's a list of all my great articles</p>
          </div>
        </header>
        <section class="page-section">
          <Tags :section="section" />
          <NuxtLink to="/blog">
            <p class="ml-1 text-center text-2xl underline">Back to All Articles</p>
          </NuxtLink>
			<BlogItemList v-if="articles !== null" :list="articles" :showImages="true" :section="section" />
			<NotFound v-else />
        </section>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scope lang="scss">
h1 span:not(:last-child) {
  @apply at-sm:(block lh-0.75);
}
h1 span:last-child {
  @apply at-sm:(block lh-loose);
}
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
