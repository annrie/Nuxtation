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
          class="border border-white rounded-md text-white p-1 hover:border-blue hover:bg-blue hover:text-white"
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
  @apply w-full my-1.5rem rounded-md border border-blue:50 pt-2rem relative overflow-hidden;
}
:slotted(pre) {
  @apply flex overflow-x-auto px-1rem pb-1rem text-sm md:text-base;
  counter-reset: lines;
}
// @screen md {
//   :slotted(pre) {
//     @apply text-base;
//   }
// }
:slotted(pre code) {
  @apply w-full flex flex-col line-height-normal text-black dark:text-white;
}
:slotted(pre.language-json code span) {
  @apply text-gray-600 dark:text-rose-200;
}
.container pre > code .line {
  @apply break-words;
}
.bottom-container {
  @apply absolute right-0 bottom-1rem pr-0.5rem pb-0.5rem md:top-2.5rem;
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
  @apply absolute top-0 left-1rem py-0.25rem text-xs text-dark:75 dark:text-white:75 lt-md:text-base;
}
// @screen lt-md {
//   .filename-text {
//     @apply text-base;
//   }
// }
.language-text {
  @apply absolute right-0 top-0 text-dark px-0.5rem py-0.25rem rounded-bl-md at-sm:text-xs dark:text-white;
}
// :slotted(pre) {
//   @apply prose;
// }
:slotted(pre code .line > *) {
  @apply inline-block;
  min-height: 1rem;
}
:slotted(pre code .line::before) {
  @apply w-1rem mr-1.5rem inline-block text-left;
  line-height: 1.825;
  counter-increment: lines;
  content: counter(lines);
  color: rgb(115 138 148 /0.4);
}
:slotted(pre code .highlight) {
  @apply block -mx-1rem pr-1rem pl-0.75rem border-l-1rem border-blue bg-neutral-100:10 content-empty;
}
</style>
