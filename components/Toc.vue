<!-- ./components/Toc.vue -->

<script setup lang="ts">
// define links prop
defineProps(["links"]);

// flatten TOC links nested arrays to one array
const flattenLinks = (links: String) => {
  let _links = links
    .map((link) => {
      let _link = [link];
      if (link.children) {
        let flattened = flattenLinks(link.children);
        _link = [link, ...flattened];
      }
      return _link;
    })
    .flat(1);

  console.log({ _links });

  return _links;
};
</script>

<template>
  <nav class="toc">
    <header class="toc-header">
      <h3 class="font-bold text-xl">Table of contents</h3>
    </header>
    <ul class="toc-links">
      <!-- render each link with depth class -->
      <li
        v-for="link of flattenLinks(links)"
        :key="link.id"
        :class="`toc-link _${link.depth}`"
      >
        <a :href="`#${link.id}`">
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.toc {
  @apply border rounded-lg bg-slate-50 border-slate-200 mt-8 px-4 pt-8 pb-4 dark:(bg-slate-600 border-slate-600 text-sky-300) ;
  @apply max-h-[calc(100vh-6rem)] overflow-auto;
}

.toc-header {
  @apply border-b border-slate-200 mb-2 pb-2 <lg:text-center;
}

.toc-links {
  @apply flex flex-col px-2 gap-2;
}

.toc-link {
  @apply text-left text-slate-500;
}

.toc-link._2 {
  @apply pl-3 dark: text-lime-400 ;
}

.toc-link._3 {
  @apply pl-6 dark: text-neutral-400 ;
}

.toc-link._4 {
  @apply pl-8 dark: text-yellow-200 ;
}

.toc-link._undefined {
  @apply pl-10 dark: text-light-50 ;
}
</style>
