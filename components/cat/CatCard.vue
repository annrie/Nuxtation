<script lang="ts" setup>
import { CatResponse } from "~/types";

interface Props {
  catData: CatResponse;
}

defineProps<Props>();
</script>

<template>
  <div>
    <img class="card-img" :src="catData.url" alt="cute cat" :data-testid="catData.id" />
  </div>
</template>

<style scoped>
.card-img {
  border-radius: 8px;
  width: 320px;
  height: 320px;
  object-fit: cover;
}
</style>
