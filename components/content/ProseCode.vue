<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
const { copy, copied, text } = useClipboard();

const props = withDefaults(
  defineProps<{
    code?: string;
    language?: string | null;
    filename?: string | null;
    highlights?: Array<number>;
  }>(),
  { code: "", language: null, filename: null, highlights: [] }
);

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
    color: "black",
  },
  ts: {
    text: "ts",
    backgroundColor: "#f7df1e",
    color: "black",
  },
  css: {
    text: "css",
    backgroundColor: "red",
    color: "black",
  },
  less: {
    text: "less",
    backgroundColor: "orange",
    color: "black",
  },
  bash: {
    text: "bash",
    backgroundColor: "gray",
    color: "black",
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
  <div class="container group">
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
      class="bottom-container opacity-100 group-hover:md:opacity-100 md:opacity-0 transition-opacity duration-150"
    >
      <div class="copy-container">
        <span class="copied-text" v-if="copied">Copied code!</span>
        <button
          @click="copy(code)"
          class="p-1 text-white border rounded-md border-white hover:border-jis-blue hover:bg-jis-blue hover:text-white"
        >
          <IconsCheck v-if="copied" class="w-5 h-5" width="20" height="20" />
          <IconsCopy v-else class="w-5 h-5" width="20" height="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  @apply w-full my-6 bg-zinc-800 dark:bg-middlegray:10 rounded-md border border-jis-blue:50 pt-8 relative overflow-hidden;
}
:slotted(pre) {
  @apply flex overflow-x-auto px-4 pb-4 text-sm text-white;
  counter-reset: lines;
}
@screen md {
  :slotted(pre) {
    @apply text-base;
  }
}
.container pre > code .line {
  @apply break-words;
}
.bottom-container {
  @apply absolute right-0 bottom-4 pr-2 pb-2;
}
@screen md {
  .bottom-container {
    @apply top-10;
  }
}
.copy-container {
  @apply flex;
}
.copied-text {
  @apply text-white;
}
.filename-text {
  @apply absolute top-0 left-4 py-1 text-xs text-white:75;
}
@screen md {
  .filename-text {
    @apply text-sm;
  }
}
.language-text {
  @apply absolute right-0 top-0 text-white px-2 py-1 rounded-bl-md;
}
:slotted(pre code) {
  @apply w-full flex flex-col;
}
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
  @apply block -mx-4 pr-4 pl-3 border-l-4 border-jis-blue bg-neutral-100:10;
  content: "";
}
</style>
