<script setup lang="ts">
const color = useColorMode();

function toggleDark() {
  color.value = color.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <div class="mt--0.5px cursor-pointer vertical-top outline-none" @click="toggleDark">
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </div>
</template>
