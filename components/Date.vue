<script setup lang="ts">
defineProps<{
  date: string;
}>();
</script>

<template>
  <time
    :datetime="date"
    class="font-medium text-xs mb-1 tracking-widest text-gray-400 title-font block"
  >
    <!-- {{ date }} -->
    {{ formatDate(date) }}
  </time>
</template>
