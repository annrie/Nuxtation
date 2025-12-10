<template>
  <div class="directory-comparison-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.directory-comparison-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin: 2rem 0;
  width: 100%;
}

@media (min-width: 768px) {
  .directory-comparison-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
}

/* code-tree コンポーネントのスタイル調整 */
.directory-comparison-wrapper :deep(.code-tree) {
  margin: 0 !important;
  width: 100% !important;
}

.directory-comparison-wrapper > :deep(*) {
  margin: 0 !important;
}
</style>
