<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { VideoPreview } from "~~/types";

const props = defineProps<{
//  item: VideoPreview;
   videoId: string;
   playLabel: string;
}>();

onMounted(() => {
  const target = document.getElementsByClassName("youtube")[0];
  setTimeout(() => {
    // target を unknown 型にキャストする
    const unknownTarget = target as unknown;
    // const unknownTarget = document.querySelector("iframe");
    // unknownTarget を HTMLIFrameElement 型にキャストする
    const iframeTarget = unknownTarget as HTMLIFrameElement;
    // iframeTarget.contentWindow が null でないことを確認する
    // if (iframeTarget.contentWindow) {
    //   iframeTarget.contentWindow.focus();
    // }
    // オプショナルチェーン演算子（?.）を使って null の場合は focus() メソッドを呼び出さない
    iframeTarget.contentWindow?.focus();
  }, 300);
});
</script>

<template>
  <div class="youtube" mb-30>
    <lite-youtube :videoId="videoId" :playLabel="playLabel"></lite-youtube>
  </div>
</template>
