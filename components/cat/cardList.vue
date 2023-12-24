<script lang="ts" setup>
import type { CatResponse } from "~/types/index.ts";

interface Props {
  catList: CatResponse[];
}

defineProps<Props>();
</script>

<template>
  <div
    class="card-list grid gap-4 at-sm:grid-cols-1 tb:grid-cols-3 mt-4 mx-4"
    data-testid="cat-list"
  >
    <CatCard v-for="(cat, i) in catList" :key="i" :cat-data="cat" />
  </div>
</template>
