<script lang="ts" setup>
import { CatResponse } from "~/types";

const { pending, error, data, refresh } = useFetch<CatResponse[]>(
  "https://api.thecatapi.com/v1/images/search?limit=9&order=rand"
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
      <div class="cat-wrapper">
        <div class="container mx-auto w-full">
          <h1 class="font-extrabold text-center mb-8 text-5xl dark:text-light-500">
            cats
          </h1>
          <button @click="refresh" class="btn-blue mb-4">Refresh</button>
          <div v-if="pending" grid place-items-center>Loading ...</div>
          <div v-else="!pending && data">
            <cat-card-list :cat-list="data" />
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
.cat-wrapper {
  padding: 7rem 0 5rem;
}
</style>
