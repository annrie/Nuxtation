<!--https://github.com/Mokkapps/nuxt-content-v2-custom-code-blocks/blob/master/components/content/ProseCode.vue-->

<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
const { copy, copied, text } = useClipboard();

const props = withDefaults(
  defineProps<{
    code?: string;
    language?: string | null;
    filename?: string | null;
    highlights?: Array<number> | [];
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
  <div class="container">
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
      <div class="bottom-container">
        <div class="copy-container">
          <span class="copied-text" v-if="copied">Copied code!</span>
          <button @click="copy(code)" bg-transparent text-right>
            <Icon name="uil:copy-landscape" text-2xl text-blue-400 />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.container {
  @apply rounded-lg bg-hex-1f2937 mt-0 mb-0 w-full pt-0 relative dark: bg-hex-1b1917 ;
}

.filename-text {
  position: absolute;
  top: 0;
  left: 1rem;
  padding: 0.25rem 0.5rem;
  color: white;
  font-size: 14px;
  font-weight: bolder;
}

.language-text {
  position: absolute;
  top: 0;
  right: 1rem;
  padding: 0.25rem 0.5rem;
  font-size: 14px;
  text-transform: uppercase;
  border-bottom-right-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
}

.bottom-container {
  display: flex;
  justify-content: flex-end;
}

.copy-container {
  display: flex;

  button {
    @apply bottom-0 relative sm: -right-2.5rem tb:-right-4.5rem lg:-right-7rem ;
  }
}

.copied-text {
  margin-right: 1em;
  font-size: 0.8rem;
}

:slotted(pre) {
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex: 1 1 0%;
  overflow-x: auto;
  padding: 1rem;
  line-height: 1.625;
  counter-reset: lines;
}

:slotted(pre code) {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

:slotted(pre code .line) {
  display: inline-table;
  min-height: 1rem;
}

:slotted(pre code .line::before) {
  counter-increment: lines;
  content: counter(lines);
  width: 1rem;
  margin-right: 1.5rem;
  display: inline-block;
  text-align: left;
  color: rgba(115, 138, 148, 0.4);
}

:slotted(pre code .highlight) {
  background-color: #363b46;
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid red;
}
</style>
