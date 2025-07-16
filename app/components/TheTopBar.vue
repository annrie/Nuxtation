<script setup lang="ts">
import { ref } from "vue";
const isOpen = ref(false);


const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <header class="AppHeader">
    <nav class="AppHeader__nav" aria-label="グローバルメニュー">
      <div class="AppHeader__list" role="list">
        <div class="AppHeader__home" role="listitem">
          <NuxtLink to="/" class="AppHeader__homeLink">
            <span class="AppHeader__homeLogo">
              <NuxtImg
                provider="imgix"
                src="logo.png"
                sizes="50vw sm:20vw md:85px"
                alt="Nuxtationロゴ"
                :modifiers="{
                  auto: 'format,enhance',
                }"
                quality="80"
                loading="lazy"
              />
            </span>
            <!-- <span class="AppHeader__homeText">
              <span class="AppHeader__homeTextMain">
                <span>Nuxtation</span>
              </span>
            </span> -->
            <span class="visually-hidden">ホーム</span>
          </NuxtLink>
        </div>
        <div class="text-white lt-md:hidden">
          <TheNavigation class="text-white" />
        </div>
        <div class="inline-flex justify-between lt-md:hidden">
          <TopBarSocial />
        </div>
        <button
          class="block tb:hidden"
          aria-label="open menu"
          type="button"
          unstyled
          @click="toggle"
        >
          <ul v-if="!isOpen" class="hamburger text-white">
            <li class="bg-white" />
            <li class="bg-white" />
            <li class="bg-white" />
          </ul>
          <span v-if="isOpen" class="text-2xl text-white" aria-label="close menu">
            <i class="pi pi-times"></i>
          </span>
        </button>
      </div>
    </nav>

    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="mb-2.5rem mt-2.5rem h-full w-full bg-var(--bg) px-2.25rem text-center text-white"
      @click="isOpen = false"
    >
      <TheNavigation />
      <TopBarSocial />
    </div>
    <!-- /Dropdown -->
  </header>
</template>

<style lang="scss" scoped>
/* Header */
.AppHeader {
  @apply bg-hex-0B0A0A border-dark-50 border-b-2 w-full py-1rem mb-0 top-0 right-0 left-0 z-100 fixed dark:(border-white border-opacity-10);
}
.AppHeader__nav {
  @apply container mx-auto sm:(flex justify-between my--10px) tb:(py-10 pr-83 pl-24) lg:(py-10 pr-50 pl-38);
}

.AppHeader__list {
  @apply flex h-auto w-full px-0.75rem items-center justify-between tb:h-70;
}
.AppHeader__home {
  @apply text-white w-auto;
  > a {
    &:focus {
      outline: 2px solid #42b883;
      outline-offset: 6px;
    }
  }
}

.AppHeader__homeLink {
  @apply flex flex-col items-center no-underline;
}
.AppHeader__homeLogo {
  @apply text-white inline-block mt-0 sm:py-0.25rem tb:(ml-0.43em text-0.8em) w-5rem;
}

.hamburger li {
  width: 35px;
  height: 5px;
  margin: 6px 0;
}
</style>
