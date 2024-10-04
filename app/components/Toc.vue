<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  links: {
    type: Array as PropType<Link[]>,
    required: true,
  },
})
// define Link type
interface Link {
  label: string
  url: string
  children?: Link[]
  id?: string
  depth?: number
  text?: string
}
// flatten TOC links nested arrays to one array
function flattenLinks(links: Link[]) {
  const _links = links
    .map((link: Link) => {
      let _link = [link]
      if (link.children) {
        const flattened = flattenLinks(link.children)
        _link = [link, ...flattened]
      }
      return _link
    })
    .flat(1)

  // console.log({ _links });
  return _links
}
const isVisible = ref(true)
function toggleToc() {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <nav class="toc">
    <header
      class="toc-header flex flex-row cursor-pointer items-center justify-between" :class="[
        isVisible ? 'mb-2' : '',
      ]"
      aria-label="Expand the table of contents."
      @click="toggleToc"
    >
      <h3 class="text-xl font-bold">
        Table of contents
      </h3>
      <icons-chevron-down
        class="h-6 w-6 transform" :class="[isVisible ? '' : 'rotate-180']"
        width="24"
        height="24"
      />
    </header>
    <ul v-if="links" :class="[isVisible ? 'block' : '!hidden']" class="toc-links">
      <!-- render each link with depth class -->
      <li
        v-for="link of flattenLinks(links)"
        :key="link.id"
        :class="`toc-link_${link.depth} first:mt-0 mt-2 md:mt-1`"
      >
        <NuxtLink :href="`#${link.id}`" class="hover:text-success hover:underline">
          {{ link.text }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.toc {
  @apply max-h-[calc(100vh-6rem)] overflow-auto border rounded-lg bg-slate-50 border-slate-200 text-dark-700 mt-8 mx-[10px] px-4 pt-8 pb-4 dark:(bg-slate-600 border-slate-600 text-sky-300);
}

.toc-header {
  @apply border-b border-slate-200 -mt-4 mb-2 pb-2 lt-lg:text-center;
}

.toc-links {
  @apply flex flex-col px-2 gap-2 text-left first:mt--2rem;
}

.toc-link {
  @apply text-left text-slate-500;
}

.toc-link_2 {
  @apply pl-3 dark:text-sky-400;
}

.toc-link_3 {
  @apply pl-6 dark:text-neutral-400;
  &::before {
    content: '- ';
  }
}

.toc-link_4 {
  @apply pl-8 dark:text-yellow-600;
  &::before {
    content: '* ';
  }
}

.toc-link_5 {
  @apply pl-10 dark:text-green-600;
  &::before {
    content: '・ ';
  }
}

.toc-link_undefined {
  @apply pl-10 dark: text-light-50;
}
</style>
