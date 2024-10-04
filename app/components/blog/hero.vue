<script setup lang="ts">
const props = defineProps<{
  pageNo: Number;
}>();
</script>

<template>
  <header class="pt-10 sm:mt-5 lt-md:prose-sm tb:mt-20 tb:prose-lg">
    <div class="mx-auto text-center w-full">
      <h1 class="font-extrabold mb-4 text-5xl dark:text-light-500">
        All Blog Posts({{ props.pageNo }})
      </h1>
      <p class="font-medium text-lg dark:text-light-500">
        Here's a list of all my blog posts
      </p>
    </div>
  </header>
</template>
