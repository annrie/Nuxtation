<script setup lang="ts">
import type { BlogPostPreview, Sections } from "~~/types/index.ts";
import { computed } from "vue";

const props = defineProps<{
  item: BlogPostPreview;
  section: Sections;
}>();

// updatedAt を利用して、記事の更新日時が直近かどうかを判定する
const isWithinTenDays = useIsWithinTenDays(computed(() => props.item.updatedAt));
</script>

<template>
  <article
    class="blogCard mx-auto mt-10 lg:(grid grid-cols-[1.5fr_1fr] text-left) sm:items-center dark:bg-gray-900">
    <NuxtLink :to="item.path" :aria-label="item.title">
      <NuxtPicture
        provider="imgix"
        :src="item.img"
        :alt="item.title"
        fit="cover"
        format="avif,webp,png"
        :modifiers="{ auto: 'format,compress', q: 60 }"
        :img-attrs="{
          class:
            'rounded inline-block sm:w-90% tb:w-full transition-all duration-400 mx-auto lg:(hover:scale-110)',
        }"
      />
    </NuxtLink>
    <div class="mt-1.5rem lg:(mx-1.5rem text-left mt-0)">
      <TagsList
        :tags="item.tags"
        :section="section"
        class="lg:(justify-start pt-10) sm:justify-center hover:text-red"
      />
      <div v-if="item.updatedAt" pt-4>
        <Icon v-if="isWithinTenDays" class="mr-10" name="eos-icons:arrow-rotate" />
                <Date :date="item.updatedAt" />

        <!--span>{{ parseDate(item.updatedAt) }}</span-->
        <!--NuxtTime :datetime="`${item.updatedAt}`" locale="ja-JP" weekday="short" /-->
      </div>
      <div v-else pt-1rem>
        <div> {{ parseDate(item.publishedAt) }}</div>
        <!--NuxtTime :datetime="`${item.publishedAt}`" locale="ja-JP" weekday="short" /-->
      </div>
      <p>
        <NuxtLink
          :to="item.path"
          class="text-gray-800 font-semibold mt-4 sm:(text-1.1rem mx-10) tb:text-2xl dark:text-white hover:underline"
        >
          {{ item.title }}
        </NuxtLink>
      </p>
      <p
        class="text-sm text-gray-500 mt-10 dark:text-gray-300 lg:leading-base md:leading-base sm:leading-snug lt-lg:mx-20"
      >
        {{ item.description }}
      </p>
      <NuxtLink
        :to="item.path"
        :aria-label="`read more about ${item.title}`"
        class="linkButton text-white mt-10 hover:(scale-110 text-pink-100 duration-400) at-sm:text-white"
      >
        読んでみる
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped lang="scss">
ul {
  @apply sm:(w-full text-center) lg:text-left;
}

.clip {
  clip-path: circle();
}
</style>
