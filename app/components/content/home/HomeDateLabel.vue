<script setup lang="ts">
import { computed } from 'vue'
import { parseDate } from '~/utils/format'

const props = defineProps<{
  date?: string
}>()

const formatted = computed(() => parseDate(props.date))
</script>

<template>
  <time v-if="formatted" :datetime="date" class="inline-block mt-1 text-base text-slate-500 dark:text-indigo-200 tracking-wide">
    {{ formatted }}
  </time>
</template>
