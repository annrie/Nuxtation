<script setup>
defineProps(['type'])
</script>

<template>
  <div :class="[type]" class="custom-block">
	<slot unwrap="p" />
  </div>
</template>

<style scoped lang="scss">
.info {
  @apply bg-light-blue-100 text-light-blue-800 dark:(bg-dark-100 text-light-blue-500) border-light-blue-500 mb-10px;
}
.warning {
  @apply bg-lime-600/50 text-white-800 p-4 border-red-900 pl-2px mb-10px;
}
.list {
  @apply bg-transparent  p-4;
}
.custom-block {
  @apply border-1 border-solid rounded-2 border-transparent pt-16px pb-8px px-16px line-height-loose text-base;
}
</style>
