<script setup lang="ts">
const color = useColorMode()

function toggleDark() {
  color.value = color.value === 'dark' ? 'light' : 'dark'
}
// type Theme = 'light' | 'dark'
// const setColorTheme = (newTheme: Theme) => {
//   useColorMode().preference = newTheme
// }
</script>

<template>
  <div class="cursor-pointer !outline-dotted-none" @click="toggleDark">
    <div class="i-carbon-sun dark:i-carbon-moon" />
  </div>
</template>
