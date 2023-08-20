<script setup lang="ts">
const { path, params } = useRoute();
const blogCountLimit = 6;

definePageMeta({
  layout: "blog",
});

const getPageLimit = (totalPosts: any) => {
  return Math.ceil(totalPosts / blogCountLimit);
};

const getPageNumber = () => {
  return Number((params as any).number);
};

// Attempt to get the number
const router = useRouter();
let pageNo;
try {
  pageNo = getPageNumber();
  if (isNaN(pageNo) || pageNo <= 0) {
    router.replace("/friends/");
  }
} catch (err) {
  console.error(err);
  router.replace("/friends/");
}
</script>

<template>
  <ContentQuery
    path="/friends"
    :only="[
      'title',
      'description',
      'tags',
      '_path',
      'img',
      'author',
      'publishedAt',
      'name',
      'photo',
    ]"
    :sort="{ publishedAt: -1 }"
    :skip="blogCountLimit * (getPageNumber() - 1)"
    :limit="blogCountLimit"
  >
    <!-- In case it is found -->
    <template v-slot="{ data }">
      <FriendsHero />
      <FriendsList v-slot="{ data }" />
      <ContentQuery path="/friends" :only="['title']">
        <template v-slot="{ data }">
          <Pagination
            v-if="getPageLimit(data.length) > 1"
            class="mt-8"
            :currentPage="getPageNumber()"
            :totalPages="getPageLimit(data.length)"
            :nextPage="getPageNumber() < getPageLimit(data.length)"
            baseUrl="/friends/"
            pageUrl="/friends/page/"
          />
        </template>
        <template #not-found>
          <!-- Nothing -->
        </template>
      </ContentQuery>
    </template>
    <!-- In case not found -->
    <template #not-found>
      <!-- Show hero and message -->
      <FriendsHero />
      <FriendsList
        :data="[]"
        message="There are no posts in this page, maybe try searching on another one."
      />
    </template>
  </ContentQuery>
</template>
