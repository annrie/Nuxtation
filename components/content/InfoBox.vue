<!-- ./components/content/InfoBox.vue -->

<script setup>
// define props in <script>
const props = defineProps(["type"]);
</script>

<template>
  <!-- Access `type` prop in Dynamic class  -->
  <div class="info-box not-prose" :class="[type]">
    <!-- Conditionally render icons based on prop -->
    <div
      i-carbon-checkmark-filled-warning
      v-if="type == 'warning'"
      class="icon solid"
    ></div>
    <!-- <ExclamationCircleIcon v-if="type == 'warning'" class="icon solid" /> -->
    <div
      i-carbon-checkmark-filled-error
      v-else-if="type == 'error'"
      class="icon solid"
    ></div>
    <!-- <XCircleIcon v-else-if="type == 'error'" class="icon solid" /> -->
    <div i-carbon-checkmark-filled v-else class="icon solid"></div>
    <!-- <InformationCircleIcon v-else class="icon solid" /> -->

    <details>
      <summary>
        <!-- Unnamed Slot to render component content -->
        <slot />
      </summary>
      <div class="pt-2 details">
        <!-- Named ContentSlot component to render rich-text -->
        <ContentSlot :use="$slots.details" unwrap="p"></ContentSlot>
      </div>
    </details>
  </div>
</template>

<style scoped lang="scss">
.info-box {
  @apply border rounded-lg flex bg-hex-1f2937 border-slate-200 my-8 p-4 pt-20px text-slate-500 gap-2 items-start;
}
details summary {
  @apply cursor-pointer flex font-semibold leading-tight lt-md: w-280px;
}

details {
  @apply -ml-20px;
}
details .details {
  @apply text-sm;
}

.info-box .icon {
  @apply flex-shrink-0 z-2;
}

.info-box.warning {
  @apply bg-yellow-200 border-yellow-400 text-yellow-600;
}

.info-box.warning .icon.solid {
  @apply fill-yellow-600;
}

.info-box.error {
  @apply bg-red-200 border-red-400 text-red-600;
}

.info-box.error .icon.solid {
  @apply fill-red-600;
}
</style>
