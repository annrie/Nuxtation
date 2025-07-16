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

const maxLength = 20

const limitedTitle = computed(() => {
  const base = ogpData.value.ogTitle || props.title || ''
  return base.length > maxLength ? base.substr(0, maxLength) + '...' : base
})
</script>

<template>
  <div v-if="ogpData" class="link-card">
    <a :href="propsUrl" target="_blank" rel="noopener">
      <div class="link-card-content">
        <div self-stretch>
          <img :src="ogpData.ogImage?.[0]?.url || '/img/ogp.png'" alt="OG Image" tb:mt-10 />
        </div>
        <div class="at-sm:(flex-grow-2) tb:pl-2">
          <h3 class="m-0 p-0">{{ limitedTitle }}</h3>
          <!-- p class="mt-1 mb-2 p-0 underline text-sm">{{ ogpData.ogUrl || props.siteUrl }}</p -->
          <p class="m-0 p-0 txt-limit">{{ ogpData.ogDescription || props.description }}</p>
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
  box-shadow: 3px 4px 8px rgb(0 0 0 /0.6);
}
.link-card-content {
  display: grid;
 @screen sm {
    grid-template-rows: 50% 50%;
    gap: 0;
    h3 {
      @apply text-h5_sm line-height-h5;
    }
  }
  @screen tb {
    grid-template-columns: 40% 60%;
    gap: 10px;
    h3 {
      @apply text-h4_sm line-height-h3;
    }
  }
  @screen lg {
    h3 {
      @apply text-1.5rem leading-lg;
    }
  }
  .txt-limit {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 任意の行数を指定 */
  }
}
</style>
