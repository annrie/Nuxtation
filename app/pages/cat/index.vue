<script lang="ts" setup>
import type { CatResponse } from "~~/types/index.ts";

const { pending, data, refresh } = useFetch<CatResponse[]>(
  "https://api.thecatapi.com/v1/images/search?limit=9&order=rand&api_key=CAT_API_KEY"
);

definePageMeta({
  layout: false,
});

useHead({
  title: "Cats",
});
</script>

<template>
  <div>
    <NuxtLayout name="blog">
      <div
        class="md:(flex flex-row justify-between mb-4 pt-8) mb-6 at-sm:(flex-none text-center pt-12 mb-8)"
      >
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
            <span itemprop="name">Cats</span>
            <meta itemprop="position" content="2" />
          </li>
        </ol>
      </div>
      <div class="container cat-wrapper">
        <h1 class="font-extrabold text-center mb-8 text-5xl dark:text-light-500">cats</h1>
        <!-- refresh関数に引数を渡す必要がないので、refresh関数を無名関数でラップして、引数を無視するようにしている。 -->
        <button @click="() => refresh()" class="btn-alertex text-secondaryex mb-4 w-50vw">Refresh</button>
        <div v-if="pending" grid place-items-center>Loading ...</div>
        <div v-else="!pending && data">
          <CatCardList :cat-list="data" />
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.cat-wrapper {
  @apply mx-auto grid grid-col-3 gap-4 justify-items-center px-0;
}
</style>
