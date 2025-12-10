<template>
  <component
    :is="props.as"
    :class="subtitleClass"
    v-bind="attrsWithoutClass"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    as?: 'h2' | 'h3'
    variant?: 'plain' | 'pill'
  }>(),
  {
    as: 'h2',
    variant: 'plain'
  }
)

const attrs = useAttrs()

const subtitleClass = computed(() => [
  'home-subtitle',
  props.variant === 'pill' ? 'home-subtitle--pill' : 'home-subtitle--plain',
  attrs.class,
])

const attrsWithoutClass = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

</script>

<style scoped>
@reference "tailwindcss";

.home-subtitle {
  @apply mx-auto text-center font-semibold uppercase transition-transform duration-400 max-sm:tracking-[0.05em];
  margin: clamp(1.5rem, 3.5vw, 2.5rem) auto clamp(1rem, 2.5vw, 2rem);
  font-family: 'Lato', 'Noto Sans JP', system-ui, sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.15;
  letter-spacing: 0.08em;
  color: #111827;
}

.home-subtitle--plain::after {
  @apply block mx-auto rounded-full;
  content: '';
  margin-top: clamp(0.9rem, 2vw, 1.5rem);
  width: clamp(3.5rem, 8vw, 6rem);
  height: 3px;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.85), rgba(5, 150, 105, 0.6));
}

.dark .home-subtitle--plain::after {
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.9), rgba(20, 184, 166, 0.8));
}

.home-subtitle--pill {
  @apply inline-block rounded-full max-sm:py-3 max-sm:px-9;
  padding: 0.85rem 2.75rem;
  background: linear-gradient(120deg, #2563eb, #1d4ed8);
  color: #f8fafc;
  letter-spacing: 0.06em;
  font-size: clamp(1.6rem, 3.8vw, 2.4rem);
  text-transform: none;
  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.25);
}

.home-subtitle--pill:hover {
  @apply -translate-y-0.5;
  box-shadow: 0 22px 45px rgba(37, 99, 235, 0.35);
}

.dark .home-subtitle--pill {
  background: linear-gradient(120deg, #1e3a8a, #1d4ed8);
  box-shadow: 0 18px 35px rgba(37, 99, 235, 0.35);
}

.dark .home-subtitle {
  color: #ffffff;
  text-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
}

.dark .home-subtitle--plain {
  @apply bg-none border-none;
}

.home-subtitle:hover {
  @apply scale-105;
}
</style>
