<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  propsUrl: String,
  title: String,
  siteUrl: String,
  description: String,
});

// 環境変数を取得
const isDev = import.meta.env.VITE_APP_ENV === 'development'

// リアクティブなデータとしてogpDataを定義
const ogpData = ref(null);

if (isDev) {
  // dev時

  onMounted(async () => {
    try {
      const data = await $fetch(`/api/ogp?url=${encodeURIComponent(props.propsUrl)}`);
    //  console.log("APIレスポンス:", data);
      ogpData.value = data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  });
} else {
  // generate時
  const { data, error } = await useFetch(
    `/api/ogp?url=${encodeURIComponent(props.propsUrl)}`,
  );

  if (error.value) {
    console.error("Fetch error:", error.value);
  } else {
    ogpData.value = data.value;
  }
}
</script>

<template>
  <div v-if="ogpData" class="link-card">
    <a :href="propsUrl" target="_blank" rel="noopener">
      <div class="link-card-content">
        <div class="sm:basis-1/4 tb:basis-5/7 self-center">
          <img :src="ogpData.ogImage?.[0]?.url || '/img/ogp.png'" alt="OG Image">
        </div>
        <div class="sm:(flex-grow-2 pt-2) tb:pl-2">
          <h3 class="text-24px m-0 p-0">{{ ogpData.ogTitle || props.title }}</h3>
          <p class="mt-1 mb-2 p-0 underline text-sm">{{ ogpData.ogUrl || props.siteUrl }}</p>
          <p class="m-0 p-0">{{ ogpData.ogDescription || props.description }}</p>
        </div>
      </div>
    </a>
  </div>
  <div v-else>
    <p>Link Card Loading...</p>
  </div>
</template>

<style scoped lang="scss">
.link-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.3s;
  a {
    text-decoration: none;
    &::after {
      content: none;
    }
  }
}
.link-card img {
  display: block;
  max-width: 100%;
  height: auto;
}
.link-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.link-card-content {
  text-align: left;
  display: flex;
  /* display: grid; */
}
.link-card-content {
  @screen at-sm {
    flex-direction: column;
    align-self: start;
    & h3 {
      @apply text-h5_sm line-height-h5;
    }
  }
  @screen tb {
    /* display: flex; */
    flex-direction: row;
    align-self: center;
    & h3 {
      @apply text-h4_sm line-height-h3;
    }
  }
  /*   .first {
         grid-row: 1 / 2;
         grid-column: 1/ 2;
      }
      .second {
        grid-row: 2 / 3;
        grid-column: 1 / 2;
      } */
}
/*.link-card-content {
      display: grid;
      grid-template-columns: 30% 70%;
      gap: 20px;
    }*/
</style>
