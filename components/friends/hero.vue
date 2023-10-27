<template>
  <!-- <div
    class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
  >
    <SBreadcrumb :items="items" :ui="ui" />
  </div> -->
  <header class="pt-10 sm:mt-5 lt-md:prose-sm tb:mt-20 tb:prose-lg">
    <div class="mx-auto text-center w-full">
      <h1 class="font-extrabold mb-4 text-5xl dark:text-light-500">All Friends Posts</h1>
      <p class="font-medium text-lg dark:text-light-500">
        Here's a list of all my friends great posts
      </p>
    </div>
  </header>
</template>

<script setup lang="ts">
const ui = {
  nav: "max-w-full block mb-0",
  ol:
    "max-w-full flex justify-start gap-2 m-0 p-0 list-none border-blue-100 border-2 px-3 py-2 dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden",
  li:
    "inline-flex relative items-center justify-start text-sm whitespace-nowrap leading-loose group",
  liLast: "overflow-hidden",
  liMultiLine: "w-full",
  item: {
    icon:
      "text-blue-300 dark:text-gray-400 h-5 w-5 group-hover:opacity-80 transition-all",
    iconWithLabel: "mr-1",
    default:
      "mt-0 mb-0 relative text-gray-600 inline-flex items-center dark:text-gray-400 focus:underline hover:underline hover:text-gray-700",
    current: "text-blue-700 leading-loose font-bold dark:text-gray-400 hover:none",
    disabled: "text-gray-400 dark:text-gray-700 outline-none",
    separator: "ml-2 text-blue-400 dark:text-gray-600",
    last: "overflow-hidden text-ellipsis truncate !block",
  },
};
const items = useBreadcrumbItems();
</script>
