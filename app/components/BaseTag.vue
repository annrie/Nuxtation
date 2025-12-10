<script setup lang="ts">
interface Props {
  href?: string
  label: string
}

const props = defineProps<Props>()

const computedAriaLabel = computed(() => {
  return `${props.label}タグの記事一覧へ移動`
})
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="tag-link"
    :aria-label="computedAriaLabel"
  >
    <span class="tag-pill">
      {{ label }}
    </span>
  </NuxtLink>
  <span v-else class="tag-pill">
    {{ label }}
  </span>
</template>

<style scoped>
@reference "tailwindcss";

.tag-link {
  @apply outline-none rounded-full inline-block;
}

.tag-link:focus {
  @apply outline outline-2 outline-offset-2 outline-blue-500;
}

.dark .tag-link:focus {
  @apply outline-blue-400;
}

.tag-pill {
  @apply inline-flex items-center gap-1 py-2 px-3.5 min-h-[44px] rounded-full text-[0.85rem] leading-[1.2] text-white transition-all duration-300;
  touch-action: manipulation;
  background: linear-gradient(to bottom right, rgb(37 99 235), rgb(29 78 216));
}

.tag-link:hover .tag-pill {
  @apply -translate-y-0.5;
  background: linear-gradient(to bottom right, rgb(59 130 246), rgb(30 58 138));
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
}

/* ダークモード */
.dark .tag-pill {
  background: linear-gradient(to bottom right, rgb(29 78 216), rgb(30 58 138));
}

.dark .tag-link:hover .tag-pill {
  background: linear-gradient(to bottom right, rgb(37 99 235), rgb(23 37 84));
}
</style>
