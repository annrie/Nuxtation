<script setup lang="ts">
const { data } = await useFetch('/api/pageview')

const time = useTimeAgo(computed(() => data.value!.startAt))
</script>

<template>
  <div text-gray:80>
    <span text-gray font-500>{{ data!.pageview }}</span>
    page views since
    <span text-gray>{{ time }}</span>
  </div>
</template>
