<script setup lang="ts">
import type { BlogPostPreview, Sections } from '~/types/index.ts'
import { parseDate } from "~/utils/format";

const props = defineProps<{
  item: BlogPostPreview
  section: Sections
  showImages?: boolean
}>()

const isWithinTenDays = useIsWithinTenDays(computed(() => props.item.updatedAt));
</script>

<template>
  <article class="blogCard grid mt-3rem items-center gap-x-1rem pt-10 lt-lg:grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
    <div v-if="showImages !== false" class="h-full w-full object-cover">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <NuxtPicture
          provider="imgix"
          :src="item.img"
          :alt="item.title"
          format="avif,webp"
          loading="lazy"
          :modifiers="{
            auto: 'format,enhance',
            crop: 'entropy',
            q: '60',
            w: '1280',
            h: '640',
            fit: 'crop',
          }"
          :img-attrs="{
            class:
              'rounded transition-all duration-400 at-sm:(mt-0 block text-center w-full) ',
          }"
        />
      </NuxtLink>
    </div>

      <header class="text-left lt-lg:p-20 mt-5">
      <p>
            <Icon pr-0.5rem mr-0.25rem text-0.7rem name="streamline:chat-bubble-square-write" />{{
              parseDate(item.publishedAt)
            }}<span v-if="item.updatedAt" ml-0.5rem
              ><Icon text-0.7rem v-if="isWithinTenDays" name="eos-icons:arrow-rotate" />
              <Icon
                pr-0.5rem
                mr-0.25rem
                text-0.7rem
                name="streamline:chat-bubble-square-write-solid"
              />{{ parseDate(item.updatedAt) }}</span
            >
            </p>
        <h1 class="font-semibold text-1.5rem tb:text-1.2rem lg:text-2xl">
          {{ item.title }}
        </h1>
        <p
          mt-5px
          lg:text-lg
          tb:text-14px
          at-sm:lh-1.5
          lg:line-height-base
          tb:line-height-tight
        >
          {{ item.description }}
        </p>
      <TagsList v-if="item.tags" :tags="item.tags" :section="section" />
        <NuxtLink
          :to="item.path"
          class="linkButton at-sm:(mx-auto mb-4 text-white) lt-tb:translate-x-50% lt-lg:translate-x-150% hover:(scale-110 text-white duration-400)"
        >
          読んでみる
        </NuxtLink>
      </header>

  </article>
</template>
