<script setup lang="ts">
import { ref } from "vue";
import { NavLinks } from "~/utils/navigation";
import NavItem from "./NavItem.vue";

const activeIndex = ref(-1);

const setActiveIndex = (index: number) => {
  activeIndex.value = index;
};

const clearActiveIndex = () => {
  activeIndex.value = -1;
};
</script>

<template>
  <nav>
    <div class="max-w-6xl mx-a px-16ptr py-8ptr">
      <ul
        class="flex flex-row at-sm:(flex-col items-center) justify-between items-start text-left"
        role="menubar"
      >
        <NavItem
          v-for="(nav, index) in NavLinks"
          :key="index"
          :nav="nav"
          :is-active="activeIndex === index"
          @mouse-enter="setActiveIndex(index)"
          @mouse-leave="clearActiveIndex"
        />
      </ul>
    </div>
  </nav>
</template>

<style scoped>
ul {
  list-style-type: none;
}
</style>