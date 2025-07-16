<script setup lang="ts">
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  baseUrl: { type: String, required: true },
})

const pageRange = computed(() => {
  const range = []
  for (let i = 1; i <= props.totalPages; i++) {
    range.push(i)
  }
  return range
})

/**
 * ページ番号に応じたリンク先オブジェクトを生成します。
 * 1ページ目はクエリなし、2ページ目以降は ?page=n のクエリを付けます。
 * @param {number} page - ページ番号
 */
function getPageUrl(page: number) {
  if (page === 1) {
    // 1ページ目の場合は、クエリパラメータを付けずにベースURLに遷移
    return { path: props.baseUrl }
  }
  // 2ページ目以降は、クエリパラメータを付けて遷移
  return { path: props.baseUrl, query: { page: page } }
}
</script>

<template>
  <nav class="pagination-list" v-if="totalPages > 1">
    <NuxtLink
      v-if="currentPage > 1"
      :to="getPageUrl(currentPage - 1)"
      class="pagination-item"
    >&lt;</NuxtLink>

    <NuxtLink
      v-for="page in pageRange"
      :key="page"
      :to="getPageUrl(page)"
      :class="['pagination-item', { active: currentPage === page }]"
    >{{ page }}</NuxtLink>

    <NuxtLink
      v-if="currentPage < totalPages"
      :to="getPageUrl(currentPage + 1)"
      class="pagination-item"
    >&gt;</NuxtLink>
  </nav>
</template>

<style scoped>
.pagination-list {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
.pagination-item {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: 1px solid #aaa;
  text-decoration: none;
  transition: background-color 0.3s ease; /* ホバー効果を滑らかにするためのトランジション */
}
.pagination-item:hover {
 background-color: #f0f0f0; /* ホバー時の背景色 */
 color: black;
 cursor: pointer; /* ホバー時にカーソルを指マークにする */
}
.pagination-item.active {
 background: #2b6cb0;
 color: #fff;
}
.pagination-item.active:hover {
 background: #2b6cb0; /* アクティブなアイテムにホバーしても背景色は変わらないように */
 cursor: default; /* アクティブなアイテムはカーソルをデフォルトに戻す */
}</style>