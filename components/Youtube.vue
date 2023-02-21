<template>
  <div class="youtube">
    <lite-youtube :videoid="id"
      :playlabel="label" />
  </div>
</template>
<script setup lang="ts">
defineProps<{
  id: String;
  label: String;
}>();

fetchOnServer: false;

onMounted(() => {
  const target = document.getElementsByClassName("youtube");
  setTimeout(() => {
    target.contentWindow.focus();
  }, 0);
});
</script>
