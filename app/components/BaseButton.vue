<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'cta' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  target?: '_self' | '_blank'
  disabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  target: '_self',
  disabled: false,
})

const computedAriaLabel = computed(() => {
  return props.ariaLabel || undefined
})
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    :target="target"
    class="base-button" :class="[`variant-${variant}`, `size-${size}`, { disabled }]"
    :aria-label="computedAriaLabel"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    class="base-button" :class="[`variant-${variant}`, `size-${size}`]"
    :disabled="disabled"
    :aria-label="computedAriaLabel"
  >
    <slot />
  </button>
</template>

<style scoped>
@reference "tailwindcss";

.base-button {
  @apply inline-flex items-center gap-2 rounded-lg font-semibold transition-all duration-200 ease-in-out outline-none;
  touch-action: manipulation;
}

.base-button:focus {
  @apply outline outline-[3px] outline-offset-2;
  outline-color: var(--color-link-light);
}

.dark .base-button:focus {
  outline-color: var(--color-link-dark);
}

/* サイズバリアント */
.size-sm {
  @apply px-3 py-1.5 text-sm min-h-[36px];
}

.size-md {
  @apply px-5 py-2.5 text-base min-h-[44px];
}

.size-lg {
  @apply px-6 py-3 text-lg min-h-[52px];
}

/* variant: primary */
.variant-primary {
  @apply text-white shadow-md;
  background: linear-gradient(to bottom right, var(--color-primary-600), var(--color-primary-700));
}

.variant-primary:hover {
  @apply shadow-lg -translate-y-0.5;
  background: linear-gradient(to bottom right, var(--color-primary-700), var(--color-primary-800));
}

/* variant: cta (緑系) */
.variant-cta {
  @apply text-white shadow-md;
  background: linear-gradient(to bottom right, #059669, #047857);
}

.variant-cta:hover {
  @apply shadow-lg -translate-y-0.5;
  background: linear-gradient(to bottom right, #047857, #15803d);
}

/* variant: ghost */
.variant-ghost {
  @apply border-2 border-current bg-transparent;
}

.variant-ghost:hover {
  @apply bg-current/10;
}

/* ダークモード */
.dark .variant-primary {
  background: linear-gradient(to bottom right, var(--color-primary-700), var(--color-primary-800));
}

.dark .variant-primary:hover {
  background: linear-gradient(to bottom right, var(--color-primary-800), var(--color-primary-900));
}

.dark .variant-cta {
  background: linear-gradient(to bottom right, #059669, #047857);
}

.dark .variant-cta:hover {
  background: linear-gradient(to bottom right, #047857, #15803d);
}

/* ダークモード - ジャンル別カラー */
/* disabled 状態 */
.disabled {
  @apply opacity-50 cursor-not-allowed pointer-events-none;
}
</style>
