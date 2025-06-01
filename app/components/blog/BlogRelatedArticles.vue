<script setup>
const props = defineProps({
  related: { type: Array, required: true },
  limit:    { type: Number, default: 5 },
})
</script>

<template>
  <nav class="toc">
    <header class="toc-header">
      <h3 class="text-xl font-bold">
        続けて読む
      </h3>
    </header>
    <ul class="list-disc-outside">
      <template v-for="(other, i) in related.slice(0, props.limit)" :key="other.id">
        <li v-if="other" class="toc-links mt-4 first:mt-0 md:mt-1">
          <NuxtLink
            :to="other.path"
            class="hover:text-success hover:underline"
            :aria-label="other.title"
          >
            {{ other.title }}
          </NuxtLink>
          <p
            class="mt-1 text-sm leading-sm md:hidden md:text-xs md:leading-xs !no-underline"
          >
            {{ other.description }}
          </p>
        </li>
      </template>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.toc {
  @apply max-h-[calc(100vh-6rem)] overflow-auto border rounded-lg bg-slate-50 border-slate-200 text-dark-700 mt-8 mx-10 px-10 pt-8 pb-4 dark:(bg-dark border-slate-600 text-sky-300);
}

.toc-header {
  @apply text-slate-400 text-left border-b border-slate-200 -mt-4 mb-2 pb-2 ml-6 lt-lg:text-center;
}

.toc-links {
  @apply flex flex-col px-2 gap-2 text-left first:mt-5px;

}

.toc-link {
  @apply text-left text-slate-500;
}
</style>
