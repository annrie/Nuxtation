<script lang="ts" setup>
import { CatResponse } from "~/types";

interface Props {
  catList: CatResponse[];
}

defineProps<Props>();
</script>

<template>
  <div
    class="card-list gap-4 at-sm:(grid grid-cols-1) tb:(grid grid-cols-3) mt-4"
    data-testid="cat-list"
  >
    <cat-card v-for="(cat, i) in catList" :key="i" :cat-data="cat" />
  </div>
</template>
