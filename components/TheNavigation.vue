<template>
  <nav>
    <ul class="block tb:flex landscape:hidden font-header">
      <li v-for="(nav, index) in NavLinks" :key="index" class="pr-6 pb-8 text-2xl">
        <nuxt-link
          :to="nav.url"
          class="mt-8 inline-block tb:(decoration-dotted decoration-yellow-500) lg:(no-underline text-lg pb-0 hover:underline )"
        >
          {{ nav.link }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>
