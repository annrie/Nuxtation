<template>
  <div class="youtube">
    <LiteYoutube :videoid="id" :playlabel="label"></LiteYoutube>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  id: String;
  label: String;
}>();

//fetchOnServer: false;

onMounted(() => {
  const target = document.getElementsByClassName("youtube")[0];
  setTimeout(() => {
    // target を unknown 型にキャストする
    const unknownTarget = target as unknown;
    // unknownTarget を HTMLIFrameElement 型にキャストする
    const iframeTarget = unknownTarget as HTMLIFrameElement;
    // iframeTarget.contentWindow が null でないことを確認する
    // if (iframeTarget.contentWindow) {
    //   iframeTarget.contentWindow.focus();
    // }
    // オプショナルチェーン演算子（?.）を使って null の場合は focus() メソッドを呼び出さない
    iframeTarget.contentWindow?.focus();
  }, 0);
});
</script>
