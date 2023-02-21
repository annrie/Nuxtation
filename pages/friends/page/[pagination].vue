<script setup lang="ts">
const route = useRoute();
const page = Number(route.params.id || 1);
</script>

<template>
  <FriendsBlog :page="page" />
</template>
