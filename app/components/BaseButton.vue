<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'genre' | 'cta' | 'ghost'
  genre?: 'sf' | 'adv' | 'mys' | 'horror' | 'jedi' | 'short'
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

const genreClass = computed(() => {
  if (props.variant === 'genre' && props.genre) {
    return `genre-${props.genre}`
  }
  return ''
});

const computedAriaLabel = computed(() => {
  return props.ariaLabel || undefined
});
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    :target="target"
    class="base-button" :class="[`variant-${variant}`, `size-${size}`, genreClass, { disabled }]"
    :aria-label="computedAriaLabel"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    class="base-button" :class="[`variant-${variant}`, `size-${size}`, genreClass]"
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

/* variant: genre（ジャンル別）- CSS変数使用 */
.variant-genre {
  @apply text-white shadow-md;
  background: linear-gradient(to bottom right, var(--color-sf-600), var(--color-sf-600));
}

.variant-genre:hover {
  background: linear-gradient(to bottom right, var(--color-sf-600), var(--color-sf-700));
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
  transform: translateY(-2px);
}

.variant-genre:focus {
  outline-color: var(--color-sf-active);
}

/* ジャンル別カラー */
.variant-genre.genre-sf {
  background: linear-gradient(to bottom right, var(--color-sf-600), var(--color-sf-600));
}

.variant-genre.genre-sf:hover {
  background: linear-gradient(to bottom right, var(--color-sf-600), var(--color-sf-700));
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.5);
}

.variant-genre.genre-adv {
  background: linear-gradient(to bottom right, var(--color-adv-600), var(--color-adv-600));
}

.variant-genre.genre-adv:hover {
  background: linear-gradient(to bottom right, var(--color-adv-600), var(--color-adv-700));
  box-shadow: 0 6px 16px rgba(102, 153, 0, 0.5);
}

.variant-genre.genre-adv:focus {
  outline-color: var(--color-adv-active);
}

.variant-genre.genre-mys {
  background: linear-gradient(to bottom right, var(--color-mys-600), var(--color-mys-600));
}

.variant-genre.genre-mys:hover {
  background: linear-gradient(to bottom right, var(--color-mys-600), var(--color-mys-700));
  box-shadow: 0 6px 16px rgba(237, 24, 30, 0.5);
}

.variant-genre.genre-mys:focus {
  outline-color: var(--color-mys-active);
}

.variant-genre.genre-horror {
  background: linear-gradient(to bottom right, var(--color-horror-600), var(--color-horror-600));
}

.variant-genre.genre-horror:hover {
  background: linear-gradient(to bottom right, var(--color-horror-600), var(--color-horror-700));
  box-shadow: 0 6px 16px rgba(82, 82, 82, 0.5);
}

.variant-genre.genre-horror:focus {
  outline-color: var(--color-horror-active);
}

.variant-genre.genre-jedi {
  background: linear-gradient(to bottom right, var(--color-jedi-600), var(--color-jedi-600));
}

.variant-genre.genre-jedi:hover {
  background: linear-gradient(to bottom right, var(--color-jedi-600), var(--color-jedi-700));
  box-shadow: 0 6px 16px rgba(75, 85, 99, 0.5);
}

.variant-genre.genre-jedi:focus {
  outline-color: var(--color-jedi-active);
}

.variant-genre.genre-short {
  background: linear-gradient(to bottom right, var(--color-short-600), var(--color-short-600));
}

.variant-genre.genre-short:hover {
  background: linear-gradient(to bottom right, var(--color-short-600), var(--color-short-700));
  box-shadow: 0 6px 16px rgba(101, 163, 13, 0.5);
}

.variant-genre.genre-short:focus {
  outline-color: var(--color-short-active);
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

.dark .variant-genre {
  background: linear-gradient(to bottom right, var(--color-sf-700), var(--color-sf-800));
}

.dark .variant-genre:hover {
  background: linear-gradient(to bottom right, var(--color-sf-800), var(--color-sf-900));
}

.dark .variant-genre:focus {
  outline-color: var(--color-link-dark);
}

/* ダークモード - ジャンル別カラー */
.dark .variant-genre.genre-sf {
  background: linear-gradient(to bottom right, var(--color-sf-700), var(--color-sf-800));
}

.dark .variant-genre.genre-sf:hover {
  background: linear-gradient(to bottom right, var(--color-sf-800), var(--color-sf-900));
}

.dark .variant-genre.genre-adv {
  background: linear-gradient(to bottom right, var(--color-adv-700), var(--color-adv-800));
}

.dark .variant-genre.genre-adv:hover {
  background: linear-gradient(to bottom right, var(--color-adv-800), var(--color-adv-900));
}

.dark .variant-genre.genre-mys {
  background: linear-gradient(to bottom right, var(--color-mys-700), var(--color-mys-800));
}

.dark .variant-genre.genre-mys:hover {
  background: linear-gradient(to bottom right, var(--color-mys-800), var(--color-mys-900));
}

.dark .variant-genre.genre-horror {
  background: linear-gradient(to bottom right, var(--color-horror-700), var(--color-horror-800));
}

.dark .variant-genre.genre-horror:hover {
  background: linear-gradient(to bottom right, var(--color-horror-800), var(--color-horror-900));
}

.dark .variant-genre.genre-jedi {
  background: linear-gradient(to bottom right, var(--color-jedi-700), var(--color-jedi-800));
}

.dark .variant-genre.genre-jedi:hover {
  background: linear-gradient(to bottom right, var(--color-jedi-800), var(--color-jedi-900));
}

.dark .variant-genre.genre-short {
  background: linear-gradient(to bottom right, var(--color-short-700), var(--color-short-800));
}

.dark .variant-genre.genre-short:hover {
  background: linear-gradient(to bottom right, var(--color-short-800), var(--color-short-900));
}

/* disabled 状態 */
.disabled {
  @apply opacity-50 cursor-not-allowed pointer-events-none;
}
</style>
