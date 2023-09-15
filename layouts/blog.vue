<template>
  <div>
    <main id="main" class="mx-auto px-2 md:px-4 lg:container">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  redirect: "/",
  scrollToTop: true,
});
</script>
