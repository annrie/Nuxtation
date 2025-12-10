<script lang="ts" setup>
import type { CatResponse } from "~/types/index.ts";

interface Props {
  catList: CatResponse[];
}

defineProps<Props>();
</script>

<template>
  <div
    class="masonry-grid mt-4 mx-4"
    data-testid="cat-list"
  >
    <CatCard v-for="(cat, i) in catList" :key="i" :cat-data="cat" />
  </div>
</template>

<style scoped>
.masonry-grid {
  column-count: 1;
  column-gap: 1rem;
}

@media (min-width: 768px) {
  .masonry-grid {
    column-count: 3;
  }
}

.masonry-grid > * {
  break-inside: avoid;
  margin-bottom: 1rem;
}
</style>
