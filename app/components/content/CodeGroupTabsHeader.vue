<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface Props {
  tabs: Array<{ label: string }>
  activeTabIndex: number
}
const props = defineProps<Props>()

const emit = defineEmits(['update:activeTabIndex'])

const tabsRef = ref<HTMLElement>()
const highlightUnderline = ref()

function updateHighlightUnderlinePosition(activeTab?: HTMLElement) {
  if (!activeTab)
    return

  highlightUnderline.value.style.left = `${activeTab.offsetLeft}px`
  highlightUnderline.value.style.width = `${activeTab.clientWidth}px`
}

function updateTabs($event: Event, index: number) {
  emit('update:activeTabIndex', index)
  nextTick(() => updateHighlightUnderlinePosition($event.target as HTMLElement))
}

watch(
  tabsRef,
  (newVal) => {
    if (!newVal)
      return

    setTimeout(() => {
      updateHighlightUnderlinePosition(
        tabsRef.value?.children[props.activeTabIndex] as HTMLElement | undefined,
      )
    }, 50)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div
    class="relative bg-gray-200 text-red-700 lt-md:(block w-320px) dark:(bg-gray-800 text-red-500)"
  >
    <div v-if="tabs" ref="tabsRef" class="relative z-0 px-2 pt-1 lt-md:(block px-0 pt-1)">
      <button
        v-for="({ label }, i) in tabs"
        :key="`${i}${label}`"
        :class="[activeTabIndex === i ? 'active' : 'not-active']"
        class="relative select-none px-4 py-2.5 text-sm leading-5 tracking-tight font-mono transition-colors duration-100"
        @click="updateTabs($event, i)"
      >
        {{ label }}
      </button>
      <span ref="highlightUnderline" class="highlight-underline absolute top-0 h-1 -z-1">
        <span class="h-full w-full flex bg-gray-500" />
      </span>
    </div>

    <slot name="footer" />
  </div>
</template>

<style scoped lang="scss">
.highlight-underline {
  @apply absolute z--1 top-0 h-100%;
  transition:
    inset-inline-start 150ms,
    width 150ms;
  .tab {
    @apply flex w-100% h-100% bg-gray-100 dark:bg-gray-900;
  }
}
button {
  &.active {
    @apply text-light-100 dark:(bg-gray-300 text-red-900);
  }
  &.not-active {
    @apply text-gray-700 hover:(text-gray-800 bg-gray-300) dark:(bg-gray-200 text-gray-400 hover:text-gray-200 bg-gray-700);
  }
}
</style>
