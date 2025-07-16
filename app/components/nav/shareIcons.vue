<script setup lang="ts">
import X from "../icons/x.vue";
import Pinterest from "../icons/pinterest.vue";
import Linkedin from "../icons/linkedin.vue";
import Facebook from "../icons/facebook.vue";
import Gmail from "../icons/gmail.vue";

const props = defineProps({
  headline: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

const baseUrl = "https://nuxtation.vercel.app";
const encodedUrl = encodeURIComponent(baseUrl + props.path);

const icons = [
   {
    icon: X,
    alt: "Share this story on X.",
    getHref: () => {
      return `https://x.com/intent/tweet?text=${encodeURIComponent(
        "Check out this article about " + props.headline
      )}&url=${encodedUrl}`;
    },
  },
 {
    icon: Facebook,
    alt: "Share this story on Facebook.",
    getHref: () => {
      return `https://facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    },
  },
  {
    icon: Linkedin,
    alt: "LinkedIn profile.",
    getHref: () => {
      return `https://www.linkedin.com/sharing/share-offsite/?mini=true&url=${encodedUrl}&title=${encodeURI(
        props.headline
      )}&summary=${encodeURI(props.excerpt)}`;
    },
  },
  {
    icon: Gmail,
    alt: "Share this story via email.",
    getHref: () => {
      return `mailto:?subject=${encodeURI(
        props.headline
      )}&body=Check%20out%20this%20article%20about%20${encodeURI(
        props.headline
      )},%20${encodedUrl}`;
    },
  },
  {
    icon: Pinterest,
    alt: "Share this story on Pinterest.",
    getHref: () => {
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}`;
    },
  },
];
</script>

<template>
  <div class="flex flex-row">
    <template v-for="icon in icons" :key="icon.href">
      <a
        :href="icon.getHref()"
        target="_blank"
        rel="noopener"
        class="shared mr-5 mx-0.5rem hover:(scale-125 transition-transform duration-100)"
      >
        <component
          :is="icon.icon"
          :alt="icon.alt"
          :aria-label="icon.alt"
          class="h-2rem w-2rem"
        />
      </a>
    </template>
  </div>
</template>