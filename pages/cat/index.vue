<script lang="ts" setup>
import type { CatResponse } from "~/types/index.ts";

const { pending, data, refresh } = useFetch<CatResponse[]>(
  "https://api.thecatapi.com/v1/images/search?limit=9&order=rand&api_key=CAT_API_KEY"
);

definePageMeta({
  layout: "blog",
});

useHead({
  title: "Cats",
});
</script>

<template>
  <div pt-10>
    <!-- <div
      class="border-t-2 pt-8 border-jis-blue flex flex-col md:(flex-row justify-between text-right mb-8) items-center mb-6"
    >
      <SBreadcrumb flex>
        <template #breadcrumb="{ to, title }">
          <NuxtLink :to="to">
            {{ title }}
          </NuxtLink>
        </template>
      </SBreadcrumb>
    </div> -->
    <div class="cat-wrapper">
      <div class="container">
        <h1 class="font-extrabold text-center mb-8 text-5xl dark:text-light-500">cats</h1>
        <!-- refresh関数に引数を渡す必要がないので、refresh関数を無名関数でラップして、引数を無視するようにしている。 -->
        <button @click="() => refresh()" class="btn-blue mb-4 w-[1200px]">Refresh</button>
        <div v-if="pending" grid place-items-center>Loading ...</div>
        <div v-else="!pending && data">
          <CatCardList :cat-list="data" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cat-wrapper {
  @apply w-[1200px] mx-auto grid grid-col-3 align-items-center justify-items-center px-0;
}
</style>
