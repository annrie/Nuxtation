<template>
  <header class="hero">
    <p class="hero-label">Stories &amp; Speculation on Nuxt with Docus</p>
    <h1 class="hero-title">
      Nuxtation
    </h1>
    <p class="hero-subtitle">
      技術ブログと僭越図書館の知見を Nuxt に集約したリーディングルーム。
      発見と考察の旅は、ここから始まります。
    </p>
  </header>
</template>

<style scoped>
@reference "tailwindcss";

.hero {
  @apply text-center mx-auto max-w-[720px] grid gap-1;
  margin: clamp(2rem, 4vw, 3rem) auto clamp(0.5rem, 2vw, 1rem);
  color: rgb(10 18 32);
}

.dark .hero {
  color: rgb(226, 232, 240);
}

.hero-label {
  @apply inline-flex items-center justify-center mx-auto py-1.5 px-5 rounded-full text-[0.85rem] tracking-[0.18em] uppercase border;
  color: rgba(30, 41, 59, 0.88);
  background: rgba(226, 232, 240, 0.5);
  border-color: rgba(203, 213, 225, 0.6);
  backdrop-filter: blur(16px);
}

.dark .hero-label {
  color: #ffffff;
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(51, 65, 85, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-title {
  @apply font-bold tracking-[0.06em];
  font-family: 'Lato', 'Noto Sans JP', system-ui, sans-serif;
  font-size: clamp(3.2rem, 6.5vw, 4.8rem);
  color: #0f172a;
  text-shadow: 0 2px 10px rgba(148, 163, 184, 0.4);
}

.dark .hero-title {
  color: rgb(241, 245, 249);
  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.4),
    0 8px 32px rgba(14, 165, 233, 0.25);
}

.hero-title::after {
  @apply block h-1 mx-auto mt-2 rounded-full;
  content: '';
  width: clamp(4rem, 9vw, 7rem);
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.75), rgba(16, 185, 129, 0.75));
}

.dark .hero-title::after {
  background: linear-gradient(90deg, rgba(14, 165, 233, 0.8), rgba(6, 182, 212, 0.8));
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.4);
}

.hero-subtitle {
  @apply leading-[1.68];
  color: rgba(55, 65, 81, 0.92);
  font-size: clamp(1.08rem, 2.7vw, 1.42rem);
  text-shadow: none;
}

.dark .hero-subtitle {
  color: rgba(203, 213, 225, 0.85);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
</style>
