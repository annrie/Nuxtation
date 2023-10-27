<template>
  <!-- <div
    class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
  >
    <SBreadcrumb flex>
      <template #breadcrumb="{ to, title }">
        <NuxtLink :to="to">
          {{ title }}
        </NuxtLink>
      </template>
    </SBreadcrumb>
  </div> -->
  <header class="pt-10 sm:mt-5 lt-md:prose-sm tb:mt-20 tb:prose-lg">
    <div class="mx-auto text-center w-full">
      <h1 class="font-extrabold mb-4 text-5xl dark:text-light-500">All Blog Posts</h1>
      <p class="font-medium text-lg dark:text-light-500">
        Here's a list of all my blog posts
      </p>
    </div>
  </header>
</template>
