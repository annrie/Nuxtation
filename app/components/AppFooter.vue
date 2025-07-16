<script setup lang="ts">
const thisYear = new Date().getFullYear();
</script>

<template>
  <div class="footer">
    <footer class="AppFooter">
      Copyright &copy; 2015 - {{ thisYear }} phantomoon project.
    </footer>
    <ScrollTopIcon />
  </div>
</template>

<style lang="scss" scoped>
.AppFooter {
  @apply bg-hex-0B0A0A  text-0.8rem border-slate-50 border-t-2 border-opacity-10 h-70px mt-20px text-center text-white py-21px px-0 tb:(mt-60px text-base);
  line-height: 1.5;
}
</style>
