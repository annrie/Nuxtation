<script setup lang="ts">
const { data } = await useAsyncData("header", () =>
    queryCollectionNavigation("docs"),
);
</script>

<template>
  <ul v-if="data">
    <li v-for="link of data" :key="link.path">
      <NuxtLink :to="link.path" class="link">{{ link.title }}</NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
ul {
  list-style: none;
  display: flex;
  gap: 1rem;
  font-size: 1.25rem;
  padding: 0;
}

.link {
  color: inherit;
}
.router-link-active {
  font-weight: bold;
}
</style>