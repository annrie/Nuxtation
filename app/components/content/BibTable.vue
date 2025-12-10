<template>
  <div class="bib-table-wrapper">
    <slot />
  </div>
</template>

<style>
.bib-table-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin: 2rem 0;
  width: 100%;
}

@media (min-width: 768px) {
  .bib-table-wrapper {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }
}

.bib-table-wrapper > p {
  margin: 0 !important;
  padding: 0 !important;
}

.bib-table-wrapper > table {
  margin: 0 !important;
  width: 100% !important;
}

/* 画像のスタイル */
.bib-table-wrapper > p > img {
  width: 100% !important;
  height: auto !important;
  object-fit: contain !important;
  display: block !important;
}

</style>
