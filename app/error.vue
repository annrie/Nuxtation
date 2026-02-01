<script setup lang="ts">
import { clearError, useError } from "#app";

// エラーページを表示する原因になったエラーオブジェクトを取得
const error = useError();

// Vue Routerのインスタンスを取得
const router = useRouter();

// エラーをクリアして元のページにリダイレクトする関数
const clear = () => {
  clearError();
  router.push({ path: router.currentRoute.value.path });
};
</script>
<template>
  <div text-4xl mx-auto mt-50 w-lg text-center>
    <div i-carbon-warning inline-block />
    <h1 text-5xl>エラーが発生しました</h1>
    <p class="text-jis-blue dark:text-jis-red">{{ error.message }}</p>
    <div>
      <button text-sm btn m="3 t8" @click="clear">エラーをクリアする</button>
    </div>
  </div>
</template>
