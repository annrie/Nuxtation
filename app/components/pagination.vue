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

function getPageUrl(pageNo: any) {
  return `${props.pageUrl}${pageNo}`;
}
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
  <div class="pagination-list">
    <!-- Chevron -->
    <NuxtLink
      v-show="currentPage > 1"
      class="pagination-item pagination-icon"
      :to="prevLink"
    >
      <IconsChevronDown class="h-32px w-28px pl-0 pt-5 rotate-90 transform" />
    </NuxtLink>
    <!-- First Page -->
    <NuxtLink
      class="pagination-item" :class="[currentPage === 1 ? 'active' : '']"
      :to="baseUrl"
    >
      1
    </NuxtLink>
    <!-- ... -->
    <span v-show="currentPage > 2" class="pagination-extra"> ... </span>
    <template v-for="page in pageRange" :key="page">
      <NuxtLink
        v-show="page !== 1 && page !== totalPages"
        class="pagination-item" :class="[currentPage === page ? 'active' : '']"
        :to="getPageUrl(page)"
      >
        {{ page }}
      </NuxtLink>
    </template>
    <!-- ... -->
    <span v-show="currentPage < totalPages - 1" class="pagination-extra"> ... </span>

    <!-- Last Page -->
    <NuxtLink
      v-show="totalPages > 1"
      class="pagination-item" :class="[currentPage === totalPages ? 'active' : '']"
      :to="getPageUrl(totalPages)"
    >
      {{ totalPages }}
    </NuxtLink>
    <!-- Chevron -->
    <NuxtLink
      v-show="currentPage < totalPages"
      class="pagination-item pagination-icon"
      :to="getPageUrl(currentPage + 1)"
    >
      <IconsChevronDown class="h-32px w-28px  pr-0 transform -rotate-90" />
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.pagination {
  @apply font-body font-light mx-0 mt-4rem text-base text-center mb-0 w-full;
}

a {
  @apply bg-transparent border-solid border-dark-50 text-black border-1px rounded-1/2-a my-0 mx-0.5rem text-center px-0 pt-6px pb-1px text-2xl w-3rem inline-block;
    background-color: rgb(242, 242, 242);
    border: 1px solid rgb(217, 217, 217);
}

a[aria-current='page'] {
  @apply bg-sky-500 text-dark-300 hover:(text-sky-900 bg-sky-100);
}
.pagination-list {
  @apply flex flex-row w-full items-center justify-center;
}
.pagination-item {
  @apply rounded-20px border border-black px-0.5rem py-0.25rem mx-0.25rem h-40 w-40 text-center;
}
.pagination-item:not(.active):hover {
  @apply text-black bg-#d8d8d8;
}
.pagination-item.active {
  @apply bg-#3498db text-white hover:(text-white bg-#2988c8);
    border: 1px solid #3498db;
}
.pagination-extra {
  @apply w-2rem text-lg leading-lg text-center;
}
.pagination-icon {
  @apply w-40 h-40 text-center;
}
</style>
