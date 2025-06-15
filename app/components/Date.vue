<script setup lang="ts">
import { parseDate } from "~/utils/format";

defineProps<{
  date: string;
}>();
</script>

<template>
  <time
    :datetime="date"
    class="title-font mb-1 text-xs text-gray-400 font-medium tracking-widest"
  >
    {{ parseDate(date) }}
  </time>
</template>
