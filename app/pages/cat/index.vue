<script lang="ts" setup>
import type { CatResponse } from "~~/types/index.ts";

const { pending, data: rawData, refresh } = useFetch<CatResponse[]>(
  "https://api.thecatapi.com/v1/images/search?limit=9&order=rand&api_key=CAT_API_KEY"
);

// API側が10個返すため、クライアント側で9個に制限
const data = computed(() => rawData.value?.slice(0, 9));

useHead({
  title: "Cats",
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Breadcrumb -->
    <div class="mb-8">
      <ol
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
        class="flex items-center gap-2 text-sm"
      >
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="flex items-center">
          <a itemprop="item" href="/" class="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-gray-600 dark:text-gray-400">
            <span itemprop="name" class="flex items-center">
              <Icon class="w-5 h-5" name="line-md:home-md-twotone" />
            </span>
          </a>
          <meta itemprop="position" content="1" />
        </li>
        <li class="flex items-center text-gray-400">&gt;</li>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" class="flex items-center">
          <span itemprop="name" class="font-medium text-gray-900 dark:text-gray-100">Cats</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </div>

    <!-- Page Title -->
    <h1 class="text-5xl font-extrabold text-center mb-8 text-gray-900 dark:text-gray-100">
      Cats
    </h1>

    <!-- Refresh Button -->
    <div class="flex justify-center mb-8">
      <button
        @click="() => refresh()"
        class="px-6 py-3 font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      >
        Refresh Cats
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
      <div class="text-xl text-gray-600 dark:text-gray-400">Loading cats...</div>
    </div>

    <!-- Cat Grid -->
    <div v-else-if="!pending && data" class="w-full">
      <CatCardList :cat-list="data" />
    </div>

    <!-- Error State -->
    <div v-else class="flex justify-center items-center min-h-[400px]">
      <div class="text-xl text-red-600 dark:text-red-400">Failed to load cats. Please try again.</div>
    </div>
  </div>
</template>
