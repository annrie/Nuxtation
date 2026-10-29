<script lang="ts" setup>
interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'More Info',
})
</script>

<template>
  <details class="px-4 pt-4 pb-2 my-4 text-sm border rounded-lg np-expand">
    <summary class="mb-2 cursor-pointer">
      {{ props.title }}
    </summary>
    <slot />
  </details>

<!-- // 使用方法

::expand
detail tag 再現
::

::expand{title="How to change title?"}
Customize title of expand via title prop.
::
-->
</template>

<!-- Sass は入れていないので普通の CSS で書く。lang=scss だと、記事で使っていなくても開発サーバーが
     この部品を読み込んだときに「sass-embedded が無い」エラーになっていた（2026-10-29） -->
<style>
.np-expand summary ~ p,
.np-expand summary ~ pre {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
