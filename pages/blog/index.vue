<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="blog">
      <Blog :page="1" />
    </NuxtLayout>
  </div>
</template>
