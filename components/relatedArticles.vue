<template>
  <nav class="toc">
    <header class="toc-header">
      <h3 class="font-bold text-xl">続けて読む</h3>
    </header>
    <!-- <span class="blog-aside-title mb-2 block">続けて読む</span> -->
    <ul class="list-disc">
      <template v-for="(other, index) in surround" :key="index">
        <li v-if="other" class="first:mt-0 mt-4 md:mt-1 toc-links list-inside">
          <NuxtLink
            :to="other._path + '/'"
            class="hover:underline hover:text-success"
            :aria-label="other.title"
          >
            {{ other.title }}
          </NuxtLink>
          <p
            class="!no-underline md:hidden text-sm leading-sm md:text-xs md:leading-xs mt-1"
          >
            {{ other.description }}
          </p>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  surround: {
    type: Array,
    required: true,
  },
});
</script>
<style scoped lang="scss">
.toc {
  @apply border rounded-lg bg-slate-50 border-slate-200 mt-8 px-4 pt-8 pb-4 dark:(bg-slate-600 border-slate-600 text-sky-300);
  @apply max-h-[calc(100vh-6rem)] overflow-auto;
}

.toc-header {
  @apply border-b border-slate-200 mb-2 pb-2 lt-lg:text-center;
}

.toc-links {
  @apply px-2 gap-2;
}

.toc-link {
  @apply text-left text-slate-500;
}
</style>
