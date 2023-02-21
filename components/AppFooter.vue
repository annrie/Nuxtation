<script setup lang="ts">
import BackToTop from "@/components/footer/BackToTop.vue";

const thisYear = new Date().getFullYear();
</script>

<template>
  <div class="footer">
    <BackToTop />
    <footer class="AppFooter">
      Copyright &copy; 2020 - {{ thisYear }} nuxtation project. All Rights Reserved.
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.AppFooter {
  @apply bg-dark-500 border-slate-50 border-t-2 border-opacity-10 h-[70px] mt-120px text-center text-white py-21px px-0;
  font-weight: $FONT_WEIGHT_BASE_BOLD;
  font-size: em(12, 16);
  line-height: 1.5;
  @include tb(max) {
    @apply mt-60px;
    font-size: em(10, 16);
  }
}
</style>
