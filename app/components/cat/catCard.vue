<script lang="ts" setup>
import type { CatResponse } from "~~/types/index.ts";

interface Props {
  catData: CatResponse;
}

defineProps<Props>();
</script>

<template>
  <div>
    <img
      class="rounded-lg w-full h-auto"
      :src="catData.url"
      alt="cute cat"
      :data-testid="catData.id"
    />
  </div>
</template>
