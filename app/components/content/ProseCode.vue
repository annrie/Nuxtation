<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    code?: string;
    language?: string | null;
    filename?: string | null;
    highlights?: Array<number>;
  }>(),
  { code: "", language: null, filename: null, highlights: () => [] }
);
const { copy, copied } = useClipboard();

const languageMap: Record<
  string,
  { text: string; color: string; backgroundColor: string }
> = {
  vue: {
    text: "vue",
    backgroundColor: "#42b883",
    color: "white",
  },
  html: {
    text: "html",
    backgroundColor: "#42b883",
    color: "white",
  },
  md: {
    text: "md",
    backgroundColor: "#42b883",
    color: "white",
  },
  js: {
    text: "js",
    backgroundColor: "#f7df1e",
    color: "white",
  },
  ts: {
    text: "ts",
    backgroundColor: "#f7df1e",
    color: "black",
  },
  css: {
    text: "css",
    backgroundColor: "red",
    color: "white",
  },
  less: {
    text: "less",
    backgroundColor: "orange",
    color: "white",
  },
  bash: {
    text: "bash",
    backgroundColor: "gray",
    color: "white",
  },
  json: {
    text: "json",
    backgroundColor: "#1779ba",
    color: "white",
  },
};

const languageText = computed(() =>
  props.language ? languageMap[props.language]?.text : null
);
const languageBackground = computed(() =>
  props.language ? languageMap[props.language]?.backgroundColor : null
);
const languageColor = computed(() =>
  props.language ? languageMap[props.language]?.color : null
);
</script>

<template>
  <div class="group container">
    <span v-if="filename" class="filename-text">
      {{ filename }}
    </span>
    <span
      v-if="languageText"
      :style="{ backgroundColor: languageBackground, color: languageColor }"
      class="language-text"
    >
      {{ languageText }}
    </span>
    <slot />
    <div
      class="bottom-container opacity-100 transition-opacity duration-150 md:opacity-0 group-hover:md:opacity-100"
    >
      <div class="copy-container">
        <span v-if="copied" class="copied-text">Copied code!</span>
        <button
          class="border border-white rounded-md text-white p-1 hover:border-jis-blue hover:bg-jis-blue hover:text-white"
          @click="copy(code)"
        >
          <IconsCheck v-if="copied" class="h-5 w-5" width="20" height="20" />
          <IconsCopy v-else class="h-5 w-5" width="20" height="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  @apply w-full my-6 rounded-md border border-jis-blue:50 pt-8 relative overflow-hidden;
}
:slotted(pre) {
  @apply flex overflow-x-auto px-4 pb-4 text-sm md:text-base;
  counter-reset: lines;
}
// @screen md {
//   :slotted(pre) {
//     @apply text-base;
//   }
// }
:slotted(pre code) {
  @apply w-full flex flex-col line-height-normal;
}
.container pre > code .line {
  @apply break-words;
}
.bottom-container {
  @apply absolute right-0 bottom-4 pr-2 pb-2 md:top-10;
}
// @screen md {
//   .bottom-container {
//     @apply top-10;
//   }
// }
.copy-container {
  @apply flex;
}
.copied-text {
  @apply text-white;
}
.filename-text {
  @apply absolute top-0 left-4 py-1 text-xs text-dark:75 dark:text-white:75 lt-md:text-base;
}
// @screen lt-md {
//   .filename-text {
//     @apply text-base;
//   }
// }
.language-text {
  @apply absolute right-0 top-0 text-dark px-2 py-1 rounded-bl-md at-sm:text-xs dark:text-white;
}
// :slotted(pre) {
//   @apply prose;
// }
:slotted(pre code .line > *) {
  @apply inline-block;
  min-height: 1rem;
}
:slotted(pre code .line::before) {
  @apply w-4 mr-6 inline-block text-left;
  line-height: 1.825;
  counter-increment: lines;
  content: counter(lines);
  color: rgba(115, 138, 148, 0.4);
}
:slotted(pre code .highlight) {
  @apply block -mx-4 pr-4 pl-3 border-l-4 border-jis-blue bg-neutral-100:10 content-empty;
}
</style>
