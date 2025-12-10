<script setup lang="ts">
const props = defineProps<{
  videoId: string;
  playLabel?: string;
}>();
</script>

<template>
  <div class="my-8 rounded-lg overflow-hidden aspect-video bg-black [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-none">
    <ScriptYouTubePlayer
      :video-id="videoId"
      :player-vars="{
        modestbranding: 1,
        rel: 0
      }"
    />
  </div>
</template>
