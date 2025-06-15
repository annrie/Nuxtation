<!--
https://stackoverflow.com/questions/76812295/how-do-i-render-a-partial-in-markdown-content-using-nuxt-content -->
<!-- 使い方
::partial{content=reuse}
::
を挿入する
-->

<script setup>
defineProps({
  content: {
    default: 'default',
  },
})
</script>

<template>
  <div>
    <ContentQuery v-slot="{ data }" :path="`/_partials/${content}`" find="one">
      <ContentRenderer :value="data">
        <template #empty>
          <p>No content found.</p>
        </template>
      </ContentRenderer>
    </ContentQuery>
  </div>
</template>
