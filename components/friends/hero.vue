<template>
       <div
      class="pt-8 flex flex-col md:flex-row items-center md:justify-between md:text-right mb-6 md:mb-8"
    >
      <ol itemscope itemtype="https://schema.org/BreadcrumbList" class="blog-breadcrumb">
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <NuxtLink itemprop="item" to="/"> <span itemprop="name">Home</span></NuxtLink>
          <meta itemprop="position" content="1" />
        </li>
        <span>&gt;</span>
        <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
          <span itemprop="name">Friends</span>
          <meta itemprop="position" content="2" />
        </li>
      </ol>
    </div>
    <header class="p-12 sm:mt-15 <md:prose-sm tb:mt-30 tb:prose-lg">
      <div class="mx-auto text-center w-full">
        <h1 class="font-extrabold mb-4 text-5xl dark:text-light-500">All Friends Posts</h1>
        <p class="font-medium text-lg dark:text-light-500">Here's a list of all my friends great posts</p>
      </div>
    </header>
</template>
