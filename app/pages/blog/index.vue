<script setup lang="ts">
import { Buffer } from "buffer";
import type { ParsedContent, Sections } from "~~/types";

definePageMeta({
  layout: false,
});

const route = useRoute();
const appConfig = useAppConfig();

// 1ページに表示する記事の数
const limit = 6;

// クエリパラメータから現在のページ番号を取得（?page= がなければ1ページ目）
const currentPage = computed(() => {
  const page = route.query.page;
  // pageが配列の場合は最初の要素を、そうでなければその値を使い、数値に変換
  const pageNumber = Number(Array.isArray(page) ? page[0] : page || 1);
  // 不正な値の場合は1を返す
  return isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber;
});

// 記事の総数を効率的に取得
const { data: totalArticles } = await useAsyncData('blog-total-count', () =>
  queryCollection('blog').count()
);

// 総ページ数を計算
const totalPages = computed(() =>
  Math.ceil((totalArticles.value || 0) / limit)
);

// 現在のページに表示する記事を取得
const { data: articles, refresh } = await useAsyncData(`blog-list-page-${currentPage.value}`,
  () => queryCollection('blog')
    .order('updatedAt', 'DESC')
    .skip((currentPage.value - 1) * limit) // 表示する記事の開始位置を計算
    .limit(limit) // 1ページ分の記事を取得
    .all()
);

// ページ番号（クエリパラメータ）が変わったら、記事データを再取得する
watch(() => route.query.page, () => {
  // totalPagesを超えたり、不正なページ番号にアクセスしようとした場合は1ページ目にリダイレクト
  if (currentPage.value > totalPages.value || currentPage.value < 1) {
    useRouter().push({ path: '/blog', query: { page: 1 } });
  }
  refresh();
});


const filteredArticles = ref<BlogPost[]>([]);

const title: string = 'All Blog Posts';
const description: string = "Here's a list of all my blog posts";
const section: Sections = "blog";

// SEO関連のメタ情報
useHead({
  title: computed(() => `All Blog Posts - Page ${currentPage.value}`),
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
  ogDescription: () => description,
  twitterTitle: () => `All Blog Posts - Page ${currentPage.value}`,
  ogImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
  twitterImage: () =>
    `https://nuxtation.imgix.net/ogp.png?txt64=${encoded1}&txt-size=62&txt-color=blue&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=cover&blur=50`,
});
</script>

<template>
  <div>
    <NuxtLayout name="blog">
      <div class="article-list mt-0 pt-2.5rem text-left">
        <ol
          itemscope
          itemtype="https://schema.org/BreadcrumbList"
          class="blog-breadcrumb"
        >
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <NuxtLink itemprop="item" to="/">
              <span itemprop="name">
                <Icon mb-5px align-top name="line-md:home-md-twotone" />
              </span>
            </NuxtLink>
            <meta itemprop="position" content="1" />
          </li>
          <li class="separator">&gt;</li>
          <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <span itemprop="name">Blog</span>
            <meta itemprop="position" content="2" />
          </li>
        </ol>
        <BlogHero :pageNo="currentPage" />
        <section class="page-section">
          <Tags :section="section" />
          <BlogSearch
            :articles="articles || []"
            v-model:filteredArticles="filteredArticles"
            :showImages="false"
          />
          <BlogItemList v-if="filteredArticles.length > 0" :list="filteredArticles" :section="section" :showImages="true" />
          <div v-else class="text-center py-8">
            <p class="text-gray-600">No articles found.</p>
          </div>
          <Pagination
            v-if="totalPages > 1"
            class="mt-8"
            :current-page="currentPage"
            :total-pages="totalPages"
            base-url="/blog"
            :page-url="null"
            :use-query="true"
          />
        </section>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.blog-breadcrumb {
  @apply flex text-base text-gray-500;
}

.blog-breadcrumb .separator {
  @apply mx-0.5rem;
}
</style>