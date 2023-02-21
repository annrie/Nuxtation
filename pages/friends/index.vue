<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
<template>
  <div>
    <NuxtLayout name="blog">
      <FriendsBlog :page="1" />
    </NuxtLayout>
  </div>
</template>
