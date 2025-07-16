<script setup lang="ts">
import { ref } from "vue";
import type { BlogPostPreview, Sections } from "~~/types/index.ts";

const props = defineProps<{
  item: BlogPostPreview;
  section: Sections;
}>();

// updatedAt を ref として扱う
const isWithinTenDays = useIsWithinTenDays(computed(() => props.item.updatedAt));
</script>

<template>
  <article
    class="blogCard sm:item-center lg:items-left mx-auto my-1.25rem flex flex-1 flex-col gap-0.5rem rounded-2xl bg-white p-3.25rem p-5 lg:(-mx-6) dark:(bg-gray-900)"
  >
    <div>
      <NuxtLink :to="item.url || item.path" :target="item.url ? '_blank' : '_self'">
        <NuxtPicture
          provider="imgix"
          :src="item.img"
          :alt="item.title"
          fit="cover"
          format="avif,webp,png"
          loading="lazy"
          :modifiers="{ auto: 'format,enhance', q: 60 }"
          :img-attrs="{
            class:
              'rounded w-full transition-all duration-400 hover:scale-110',
          }"
        />
      </NuxtLink>
    </div>
    <div class="sm:text-center tb:(ml-30 text-left)">
      <NuxtLink :to="item.url || item.path" :target="item.url ? '_blank' : '_self'">
        <h3
          class="mb-0.5rem text-lg text-gray-600 font-medium leading-tight dark:text-gray-300"
        >
          {{ item.title }}
        </h3>
        <p v-if="item.updatedAt">
          <Icon
            v-if="isWithinTenDays"
            class="mr-10px inline-block"
            name="eos-icons:arrow-rotate"
          />
          <Date :date="item.updatedAt" />
        </p>
        <p v-else>
          <Date :date="item.publishedAt" />
        </p>
      </NuxtLink>
      <TagsList
        :tags="item.tags"
        :section="section"
        class="lg:(mx-1 mt-2) sm:(mt-0 text-0.8rem) hover:text-red"
      />
    </div>
  </article>
</template>

<style scoped lang="scss">
.clip {
  clip-path: circle();
}
:deep(ul) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 10px;
}
</style>
