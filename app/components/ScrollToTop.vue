<script setup lang="ts">
const isVisible = ref(false);

function handleScroll(): void {
  const st = window.scrollY || document.documentElement.scrollTop;
  isVisible.value = st > window.innerHeight / 2;
}

function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// クライアント側でのみイベントリスナーを設定
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // 初期状態をチェック
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <UButton
    v-if="isVisible"
    icon="i-lucide-arrow-up"
    color="primary"
    variant="solid"
    aria-label="ページトップへスクロール"
    class="scroll-to-top-btn"
    :ui="{
      base: 'fixed bottom-8 right-8 z-50 !bg-blue-500 hover:!bg-blue-600 !text-white !rounded-full !p-4 !shadow-md hover:!shadow-[0_6px_16px_rgba(37,99,235,0.5)] transition-all duration-200 hover:-translate-y-1 hover:scale-110'
    }"
    @click="scrollToTop"
  />
</template>

<style scoped>
/* ポジショニングはui propで管理 */
</style>
