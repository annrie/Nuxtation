<script setup lang="ts">
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
            <span class="AppHeader__homeText">
              <span class="AppHeader__homeTextMain">
                <!-- <span>Nuxtation</span> -->
              </span>
            </span>
            <span class="_VisuallyHidden">ホーム</span>
          </NuxtLink>
        </div>
        <div class="text-white lt-md:hidden">
          <TheNavigation class="text-white" />
        </div>
        <div class="inline-flex justify-between lt-md:hidden tb:block">
          <TopBarSocial />
        </div>
        <button
          class="block tb:hidden"
          aria-label="open menu"
          type="button"
          @click="toggle"
        >
          <ul v-if="!isOpen" class="text-white hamburger">
            <li class="bg-white" />
            <li class="bg-white" />
            <li class="bg-white" />
          </ul>
          <span v-if="isOpen" class="text-white text-2xl" aria-label="close menu">
            X
          </span>
        </button>
      </div>
    </nav>
    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="bg-dark h-full mt-6 text-white text-center mb-6 w-full px-10"
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
  @apply bg-dark-500 border-dark-50 border-b-2 w-full py-4 mb-0 top-0 right-0 left-0 z-100 fixed dark:(border-white border-opacity-10);
}

.AppHeader__nav {
  @apply container mx-auto tb:(py-0 pr-83px pl-24px) lg:(py-0 pr-140px pl-38px) at-sm:(flex justify-between mt--20px mb--20px);
}

.AppHeader__list {
  @apply flex h-auto w-full px-3 items-center justify-between;

  @screen tb {
    @apply h-70px;
  }
}

.AppHeader__home {
  @apply text-white w-auto;

  > a {
    &:focus {
      @include focus-base;
    }
  }
}

.AppHeader__homeLink {
  @apply flex flex-col items-center no-underline;
}

// .AppHeader__homeLogo {
//   @apply flex-shrink-0 h-[53px] w-[80px];

//   @screen lt-tb {
//     @apply w-46px;
//   }
// }
.AppHeader__homeLogo {
  @apply text-white inline-block mt-5;

  @screem sm {
    font-size: em(20, 20);
  }

  @screen tb {
    margin-left: em(6, 14);
    font-size: em(14, 16);
  }

  @screen lg {
    font-size: em(30, 30);
  }

  > span {
    @apply text-white inline-block;

    @include lg(max) {
      @apply block w-40 h-40;
    }
  }
}

.AppHeader__homeText {
  @apply text-white;

  font-size: em(18, 16);

  @screen tb {
    margin-left: em(6, 14);
    font-size: em(14, 16);

    @screen lg {
      font-size: em(16, 16);
    }
  }

  > span {
    @apply text-white inline-block;

    @include lg(max) {
      @apply block;
    }
  }
}

.hamburger li {
  width: 35px;
  height: 5px;
  margin: 6px 0;
}
</style>
