<script setup>
const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  blank: {
    type: Boolean,
    default: false,
  },
  rel: {
    type: String,
    default: "",
  },
});
function isHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
const isExternal = isHttpUrl(props.href);
const bindProps = {
  to: props.href,
};
if (isExternal || props.blank)
  (bindProps.target = "_blank"), (bindProps.rel = "noopener");
</script>

<template>
  <NuxtLink v-bind="bindProps">
    <slot />
  </NuxtLink>
</template>
