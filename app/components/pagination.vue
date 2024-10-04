<script setup lang="ts">
const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  nextPage: {
    type: Boolean,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  pageUrl: {
    type: String,
    required: true,
  },
});

const getPageUrl = (pageNo: any) => {
  return `${props.pageUrl}${pageNo}`;
};
// Calculate the page range to show
const pageRange = [
  Math.max(1, props.currentPage - 1),
  props.currentPage,
  Math.min(props.totalPages, props.currentPage + 1),
];

const prevLink = computed(() => {
  return props.currentPage === 2
    ? props.baseUrl
    : `${props.pageUrl}${props.currentPage - 1}/`;
});
</script>

<template>
  <div class="pagination-list dark:text-white">
    <!-- Chevron -->
    <NuxtLink
      v-show="currentPage > 1"
      class="pagination-item pagination-icon"
      :to="prevLink"
      ><IconsChevronDown class="transform rotate-90 h-6 w-6" width="24" height="24"
    /></NuxtLink>
    <!-- First Page -->
    <NuxtLink
      :class="['pagination-item', currentPage === 1 ? 'active' : '']"
      :to="baseUrl"
      >1</NuxtLink
    >
    <!-- ... -->
    <span v-show="currentPage > 2" class="pagination-extra"> ... </span>
    <template v-for="page in pageRange" :key="page">
      <NuxtLink
        v-show="page !== 1 && page !== totalPages"
        :class="['pagination-item', currentPage === page ? 'active' : '']"
        :to="getPageUrl(page)"
        >{{ page }}</NuxtLink
      >
    </template>
    <!-- ... -->
    <span v-show="currentPage < totalPages - 1" class="pagination-extra"> ... </span>

    <!-- Last Page -->
    <NuxtLink
      v-show="totalPages > 1"
      :class="['pagination-item', currentPage === totalPages ? 'active' : '']"
      :to="getPageUrl(totalPages)"
      >{{ totalPages }}</NuxtLink
    >
    <!-- Chevron -->
    <NuxtLink
      v-show="currentPage < totalPages"
      class="pagination-item pagination-icon"
      :to="getPageUrl(currentPage + 1)"
      ><IconsChevronDown class="transform -rotate-90 h-6 w-6" width="24" height="24"
    /></NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  @apply font-body font-light mx-0 mt-4rem text-base text-center mb-0 w-full;
}

a {
  @apply bg-transparent border-solid border-dark-50 border-1 rounded-1/2 h-3rem my-0 mx-0.5rem text-center px-0 pt-6px pb-1px text-2xl w-3rem inline-block dark:border-white hover:bg-sky-500;
}

a[aria-current="page"] {
  @apply bg-sky-500 text-dark-300 hover:(text-sky-900 bg-sky-100);
}
.pagination-item.active {
  @apply bg-jis-blue:50 text-white;
}
.pagination-list {
  @apply flex flex-row w-full items-center justify-center;
}
.pagination-item {
  @apply rounded-md border border-black px-2 py-1 mx-1 w-8 text-center h-full;
}
.pagination-item:not(.active):hover {
  @apply text-sky-900 bg-sky-100;
}
.pagination-extra {
  @apply w-8 text-lg leading-lg text-center;
}
.pagination-icon {
  @apply w-10 text-center hover:bg-alert:25;
}
</style>
