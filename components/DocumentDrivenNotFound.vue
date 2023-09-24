<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div text-4xl>
    <div i-carbon-warning inline-block />
  </div>
  <h1 text-5xl>Page Not found</h1>
  <div>
    <button text-sm btn m="3 t8" @click="router.back()">Back</button>
  </div>
</template>
