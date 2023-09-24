<script setup lang="ts">
const props = defineProps({
  title: String,
  backgroundColor: String
})
</script>

<template>
  <div :class="[backgroundColor]" class="w-full h-full flex text-white items-center justify-center">
    <h1>
      {{ title }} 👋
    </h1>
  </div>
</template>

<style scoped>
h1 {
  font-size: 70px;
}
</style>
