<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from "vue";
import type { BlogPost, PrevNext, Sections } from "~~/types/index.ts";
import { parseDate } from "~/utils/format";

const route = useRoute()
const path    = route.path
const slug = computed(() => route.params.slug as string)
const keyPost    = `post-${slug.value}`
const keyRelated = `related-${slug.value}`
const keyBlog    = `blog-${slug.value}`

const section: Sections = "blog";

// 関連記事データを取得
const { data: relatedBlogArticles } = await useAsyncData( keyRelated,
	() => queryCollection('blog',  route.path)
	.select('title', 'path')
	.where('path', '<>', route.path)
	.order('updatedAt', 'DESC')
	.limit('5')
	.all()
)

const { data: article } = await useAsyncData(keyBlog,
	() =>
	queryCollection('blog').path(`/blog/${slug.value}`).first()
)

const { data: surroundData } = await useAsyncData(`surround-blog-${path}`, () =>
	queryCollectionItemSurroundings('blog', path)
	.order('publishedAt', 'ASC')
)

// destrucure `prev` and `next` value from data
// findSurroundメソッドの返す配列はnullを含む場合があるので、配列の分割代入をするときには、nullを考慮する必要がある
let prev: any, next: any;
if (surroundData.value) [prev, next] = surroundData.value || [];

definePageMeta({
  layout: 'blog',
});

// replaceHyphenを自分で定義する
const replaceHyphen = (tags: string) => tags.replace(/-/g, " ");

useHead({
		title: article?.value?.title || '',
		meta: [
		{ name: "description", content: article?.value?.description },
		{
			property: "og:image",
			content: `https://nuxtation.imgix.app/${article?.value?.img}`,
		},
		{
			property: "og:title",
			content: article?.value?.title,
		},
		],
});

useSeoMeta({
		title: () => article.value?.title,
		ogTitle: () => article?.value?.title,
		ogType: () => "article",
		ogUrl: () => `https://nuxtation.phantomoon.com/${article?.value?.path}`,
		twitterTitle: () => article?.value?.title,
		description: () => article?.value?.description,
		ogImage: () =>
		`https://nuxtation.imgix.net/${article?.value?.img}?txt=${article?.value?.title}&txt-size=132&txt-color=white&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=crop&blur=50`,
		twitterImage: () =>
		`https://nuxtation.imgix.net/${article?.value?.img}?txt=${article?.value?.title}&txt-size=132&txt-color=white&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&blur=50&auto=format,compress&fit=crop`,
		ogDescription: () => article?.value?.description,
		twitterDescription: () => article?.value?.description,
});
const { $formatDate } = useNuxtApp();

// updatedAt を ref として扱う
const isWithinTenDays = useIsWithinTenDays(computed(() => article?.value?.updatedAt));
</script>
<template>
      <article v-if="article !== null">
        <div
          class="mb-1.5rem sm:(pt-3rem) tb:(mb-0.5rem flex-none text-left pt-2.5rem pl-10) lg:(w-full mb-2rem flex flex-row justify-between pt-2rem)"
        >
      <!-- Breadcrumbs -->
      <ol
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
        class="blog-breadcrumb at-sm:border-r-none lt-lg:text-left"
      >
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <NuxtLink itemprop="item" to="/">
            <span itemprop="name"
              ><Icon mb-5px align-top name="line-md:home-md-twotone" /></span
          ></NuxtLink>
          <meta itemprop="position" content="1" />
        </li>
        <li class="separator">&gt;</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <NuxtLink
            itemscope
            itemtype="https://schema.org/WebPage"
            itemprop="item"
            itemid="/blog/"
            to="/blog"
          >
            <span itemprop="name">Blog</span></NuxtLink
          >
          <meta itemprop="position" content="2" />
        </li>
        <li class="separator">&gt;</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">{{ article.title }}</span>
          <meta itemprop="position" content="3" />
        </li>
      </ol>
          <!-- Publish date -->
          <div
            class="mt-0.5rem font-light at-sm:mt--0.5rem md:mt-0 lt-lg:text-right dark:text-white/75"
          >
            <Icon pr-0.5rem mr-0.25rem name="streamline:chat-bubble-square-write" />
            <Date :date="article.publishedAt" />
            <span v-if="article.updatedAt" ml-0.5rem
              ><Icon v-if="isWithinTenDays" name="eos-icons:arrow-rotate" />
              <Icon
                pr-0.5rem
                mr-0.25rem
                name="streamline:chat-bubble-square-write-solid"
              />
              <Date :date="article.updatedAt" />
              </span
            >
          </div>
    </div>

    <header class="article-header">
      <NuxtPicture
        provider="imgix"
        :src="article.img"
        :alt="article.title"
        format="avif,webp"
        :modifiers="{
          auto: 'format,enhance',
        }"
        :imgAttrs="{
              class:
                'rounded mt-1rem text-center mb-2rem w-full sm:max-h-200px tb:max-h-500px lg:max-h-700px',
        }"
      />
      <h1 class="heading">{{ article.title }}</h1>
      <p class="supporting">{{ article.description }}</p>
      <ul class="article-tags">
            <li v-for="(tag, n) in article.tags" :key="n" class="tag">
              <NuxtLink
                :to="`/blog/tags/${tag}`"
                class="whitespace-nowrap rounded-md bg-slate-600 px-0.5rem transition-all hover:bg-blue-500 !py-0.375rem sm:text-base tb:text-lg hover:-translate-y-0.5"
              >
                {{ replaceHyphen(tag) }}
              </NuxtLink>
            </li>
      </ul>
      <!-- Social Share -->
          <div class="mt-2.5rem flex justify-center md:mt-0">
            <ShareIcons
              :headline="article.title"
              :excerpt="article.description"
              :path="`${article.path}/`"
            />
          </div>
    </header>
        <hr class="bg-dark-500:50 h-2 dark:bg-light-300" />
    <section class="article-section">
      <aside class="aside h-fit">
        <!-- Toc Component -->
        <Toc :links="article?.body?.toc?.links" />
        <!-- Related articles -->
            <div
              v-if="relatedBlogArticles"
              class="related lt-lg:hidden"
            >
              <BlogRelatedArticles :related="relatedBlogArticles" :limit="5" />
            </div>
      </aside>
          <article class="article prose dark:prose-invert mx-10">
            <!-- render rich text from document -->
            <ContentRenderer :value="article">
              <!--template v-if="article.url">
                <a :href="article.url" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full text-primary hover:text-primary/80 transition-colors py-4">
                  <span>Read on external site</span>
                  <span class="ml-1">→</span>
                </a>
              </template>
              <template v-else>
                <p>No content found.</p>
              </template-->
            </ContentRenderer>
          </article>
    </section>
    <!-- PrevNext Component -->
    <PrevNext :prev="prev" :next="next" :section="section" class="w-90% mx-auto" />
	</article>
</template>

<style scoped lang="scss">
.article-header {
  @apply: text-center p-1rem pb-3rem;
}

.article-header .heading {
  @apply font-extrabold mt-2rem lt-md:text-xl tb:text-3xl lg:text-5xl;
}

.article-header .supporting {
  @apply font-medium text-lg sm:mt-1rem tb:my-2rem leading-normal;
}

.article-tags {
  @apply border border-transparent rounded-lg flex flex-nowrap font-normal my-1rem mx-0.5rem text-white text-sm w-full gap-2 justify-center uppercase at-sm:flex-justify-items-center;

  .tag {
    @apply mb-1rem hover:-translate-y-0.5;
  }
}

.prose {
  @apply max-w-100vw text-black dark:text-white;
}

.article-section {
  @apply relative mx-auto grid grid-cols-12 gap-col-lg  p-1rem w-full lg:px-2.5rem;
}

.article {
  @apply p-1rem sm:(order-2 col-span-full mt-0) md:mt-0 lg:(order-1 col-span-8 mt-4rem);
}

.aside {
  @apply sticky pt-2.5rem z-0 sm:(order-1 col-span-full grid-items-center top--1.5rem) tb:(top-2.25rem col-span-full) lg:(order-2 col-span-4 w-full);
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
  .prose-img {
    @apply mx-auto max-w-full px-10px;
  }
}

:deep(h2) {
  @apply my-0 mx-0 p-0.8em text-center font-bold tb:text-1.75rem border-2 border-#b92a2c rounded-10px sm:text-h5_sm;
  a {
    @apply no-underline leading-snug;
  }
}
:deep(h3),
:deep(h4),
:deep(h5) {
  @apply text-h4 leading-relaxed;

  a {
    @apply no-underline;
  }
}
:deep(h3 :not(.link-card-content)) {
  @apply relative text-20px leading-base mt-30 mb-0 mx-0 pt-14 pb-10 pl-30 pr-5 at-sm:ml-10px;

  &::before {
    @apply content-empty absolute top-5 left-10 bg-#999 w-12 h-12 transform-rotate-45;
  }

  &::after {
    @apply content-empty absolute top-20 left-5 bg-#777 w-8 h-8 transform-rotate-15;
  }
}
:deep(h4) {
  @apply relative mt-0 mb-0.8em py-0.5em pl-1.5em pr-0 border-2 border-solid border-#b92a2c font-bold text-h4_sm;

  &::before {
    @apply content-empty absolute top-50% left-0.5em mt--15px bg-#b92a2c w-8px h-30 border-rd-2px;
  }
}
:deep(h5) {
  @apply ml-3rem;
  a {
    @apply relative pt-15 pr-5 pb-10 pl-0 mt-30 mx--30px mb-10;

    &::after {
      @apply absolute bottom-0 left-0 w-100% content-empty border-b-1 border-b-dashed border-b-#777;
    }
  }
}
</style>