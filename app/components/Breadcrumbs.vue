<template>
  <div v-if="!!route" class="base_wrap">
    <ol
      v-if="route.name !== 'index'"
      class="breadcrumb"
      itemscope
      itemtype="https://schema.org/BreadcrumbList"
    >
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb_item"
        itemprop="itemListElement"
        itemscope
        itemtype="https://schema.org/ListItem"
      >
        <v-icon v-if="index > 0" size="small">mdi-chevron-right</v-icon>

        <NuxtLink v-if="crumb.path" :to="{ path: crumb.path }" itemprop="item">
          <v-icon v-if="index === 0" size="small">mdi-home-outline</v-icon>
          <span itemprop="name">{{ crumb.title }}</span>
        </NuxtLink>
        <span v-else itemprop="name">{{ crumb.title }}</span>
        <meta itemprop="position" :content="String(index + 1)" />
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import type { LocationQueryRaw, RouteLocationNormalizedLoaded } from 'vue-router'

const route = useRoute()
const router = useRouter()
const {
  detailTitle,
  searchQuery,
  searchResultTxt,
  magazineSearchQuery,
  magazineSearchResultTxt,
  teacherId,
  teacherNickname,
} = storeToRefs(useMetaStore())

const exceptionPage = (route: RouteLocationNormalizedLoaded) =>
  String(route.name).includes('class_search') || String(route.name).includes('magazine')

const searchTop = (route: RouteLocationNormalizedLoaded) =>
  route.name === 'class_search' || route.name === 'magazine'

interface Breadcrumb {
  name: string
  title: string
  path: string
  query?: LocationQueryRaw
}

const generateParentBreadcrumbs = (currentPath: string): Breadcrumb[] => {
  const newBreadcrumbs: Breadcrumb[] = []

  while (currentPath) {
    // 現在のページから親ページを見つける
    const parentRoute = router
      .getRoutes()
      .find((r) => currentPath.startsWith(r.path) && currentPath !== r.path)

    if (parentRoute && parentRoute.path !== '/') {
      // 見つかった親ページの情報を先頭に追加
      newBreadcrumbs.unshift({
        name: parentRoute.name as string,
        title: parentRoute.meta.title as string,
        path: parentRoute.path,
      })
      // 次のループでさらに上の親を探すために currentPath を更新
      currentPath = parentRoute.path
    } else {
      break
    }
  }
  return newBreadcrumbs
}

const normalBreadcrumbs = computed<Breadcrumb[]>(() => {
  if (!exceptionPage(route)) {
    return generateParentBreadcrumbs(route.path)
  }
  return []
})

const searchTopBreadcrumbs = computed<Breadcrumb[]>(() => {
  const newBreadcrumbs: Breadcrumb[] = []
  if (searchTop(route)) {
    if (detailTitle.value) {
      // 検索結果がある場合
      newBreadcrumbs.push({
        name: route.name as string,
        title: route.meta?.title as string,
        path: route.path,
      })
    }
  }
  return newBreadcrumbs
})

const classDetailBreadcrumbs = computed<Breadcrumb[]>(() => {
  const newBreadcrumbs: Breadcrumb[] = []
  if (route.name === 'class_search-detail-id') {
    if (teacherId.value && teacherNickname.value) {
      newBreadcrumbs.push({
        name: 'teacher-detail-id',
        title: `${teacherNickname.value}［先生紹介］`,
        path: `/teacher/detail/${teacherId.value}`,
      })
    } else {
      newBreadcrumbs.push({
        name: 'class_search',
        title: 'クラスを探す',
        path: '/class_search',
        ...(searchQuery.value.page &&
          !searchResultTxt.value && { query: { page: searchQuery.value.page } }),
      })
      if (searchResultTxt.value) {
        newBreadcrumbs.push({
          name: 'class_search',
          title: `${searchResultTxt.value}［クラスを探す］`,
          path: '/class_search',
          query: searchQuery.value,
        })
      }
    }
  }
  return newBreadcrumbs
})

const magazineDetailBreadcrumbs = computed<Breadcrumb[]>(() => {
  const newBreadcrumbs: Breadcrumb[] = []
  if (route.name === 'magazine-detail-id') {
    newBreadcrumbs.push({
      name: 'magazine',
      title: 'ユアスタMAGAZINE',
      path: '/magazine',
      ...(magazineSearchQuery.value.page &&
        !magazineSearchResultTxt.value && { query: { page: magazineSearchQuery.value.page } }),
    })
    if (magazineSearchResultTxt.value) {
      newBreadcrumbs.push({
        name: 'magazine',
        title: `${magazineSearchResultTxt.value}［ユアスタMAGAZINE］`,
        path: '/magazine',
        query: magazineSearchQuery.value,
      })
    }
  }
  return newBreadcrumbs
})

const currentBreadcrumb = computed<Breadcrumb[]>(() => [
  {
    name: route.name as string,
    title: detailTitle.value
      ? `${detailTitle.value}［${route.meta.title}］`
      : (route.meta.title as string),
    path: '',
  },
])

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const topBreadcrumb: Breadcrumb[] = [
    {
      name: 'index',
      title: 'TOP',
      path: '/',
    },
  ]
  // console.log('updateBreadcrumbs')

  return [
    ...topBreadcrumb,
    ...normalBreadcrumbs.value,
    ...searchTopBreadcrumbs.value,
    ...classDetailBreadcrumbs.value,
    ...magazineDetailBreadcrumbs.value,
    ...currentBreadcrumb.value,
  ]
})
</script>
<style lang="scss" scoped>
.base_wrap {
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 1200px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 12px 0 16px;
  overflow-x: auto;
  &_item {
    display: flex;
    align-items: center;
    gap: 2px;
    font-weight: bold;
    font-size: 14px;
    color: #999;
    white-space: nowrap;
    > i {
      margin-right: 3px;
      margin-top: 2px;
      color: #c4c4c4;
    }
    a {
      display: flex;
      align-items: center;
      gap: 2px;
      color: #63bed7;
    }
  }
}
</style>