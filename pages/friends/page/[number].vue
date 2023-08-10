<script setup lang="ts">
const { path, params } = useRoute();
const blogCountLimit = 6;

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
        router.replace('/blog/');
    }
} catch (err) {
    console.error(err);
    router.replace('/blog/');
}
</script>

<template>
<div>
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
          <BlogHero />
          <BlogList :data="data" />
              <ContentQuery
                        path="/blog"
                        :only="['title']"
                    >
                        <template v-slot="{ data }">
                            <BlogPagination
                                v-if="getPageLimit(data.length) > 1"
                                class="mt-8"
                                :currentPage="getPageNumber()"
                                :totalPages="getPageLimit(data.length)"
                                :nextPage="getPageNumber() < getPageLimit(data.length)"
                                baseUrl="/blog/"
                                pageUrl="/blog/page/"
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
                  <BlogHero />
                  <FriendsList id="main" :data="[]" message="There are no posts in this page, maybe try searching on another one."/>
               </template>
        </ContentQuery>
        </div>
</template>
