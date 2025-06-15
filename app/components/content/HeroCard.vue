<template>
  <section>
    <h1 class="text-4xl">
      <slot />
    </h1>
    <span class="text-sky-300">
      <slot name="description" />
    </span>
  </section>
</template>
