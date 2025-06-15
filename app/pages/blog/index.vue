<script setup lang="ts">
import { Buffer } from "buffer";
import type { ParsedContent, PrevNext, Sections } from "~~/types/index.ts";
import { parseDate } from "~/utils/format";

definePageMeta({
  layout: false,
});

// Find the number of blogs present
const blogCountLimit = 6;
const { data: articles } = await useAsyncData('blog',
	() => queryCollection('blog')
	.order('updatedAt', 'DESC')
	//    .limit(blogCountLimit)
	.all()
)

const { data } = await useAsyncData('surround', () => {
		return queryCollectionItemSurroundings('blog', path)
		.order('updatedAt', 'DESC')
		.all()
})

const filteredArticles = ref<BlogPost[]>([])

const title: string = 'All Blog Posts';
const description: string = "Here's a list of all my blog posts";
const section: Sections = "blog";
const [prev, next] = data.value || []

// set meta for page
useHead({
  title,
  meta: [
    { property: "og:type", content: "article" },
    { name: "description", content: description },
  ],
});
const encoded1 = Buffer.from(`${title}`)
  .toString("base64")
  .replace(/\s/g, "%20")
  .replace(/=/g, "");

useSeoMeta({
  description: () => description,
  twitterDescription: () => description,
  ogType: () => "article",
  ogLocale: () => "ja_JP",
  // ogUrl: () => "https://nuxtation.vercel.app/blog",
  ogDescription: () => description,
  twitterTitle: () => "All Blog Posts",
  twitterImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
  ogImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
});
</script>
<template>
  <div>
    <NuxtLayout name="blog">
      <div class="article-list mt-0 pt-10">
        <!-- Breadcrumbs -->
        <ol
          itemscope
          itemtype="https://schema.org/BreadcrumbList"
          class="blog-breadcrumb"
        >
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <NuxtLink itemprop="item" to="/">
              <span itemprop="name"
                ><Icon align-top mb-5px name="line-md:home-md-twotone" /></span
            ></NuxtLink>
            <meta itemprop="position" content="1" />
          </li>
          <li class="separator">&gt;</li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name">Blog</span>
            <meta itemprop="position" content="2" />
          </li>
        </ol>
        <BlogHero />
        <section class="page-section">
          <Tags :section="section" />
    			<BlogSearch
      			:articles="articles || []"
      			v-model:filteredArticles="filteredArticles"
      			:showImages="false"
    			/>
    			<BlogItemList v-if="filteredArticles.length> 0" :list="filteredArticles" :section="section" :showImages="true" />
    			<div v-else class="text-center py-8">
    				<p class="text-gray-600">No articles found matching your search.</p>
    			</div>
        </section>
      </div>
    </NuxtLayout>
  </div>
</template>
