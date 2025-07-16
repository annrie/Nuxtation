<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:modelValue'])

const isOn = ref(false)

const toggle = () => {
  isOn.value = !isOn.value
  emit('update:modelValue', isOn.value)
}
</script>

<template>
  <div
    class="cursor-pointer select-none transition-transform duration-200 hover:scale-110"
    @click="toggle"
  >
    <div
      v-if="!isOn"
      class="i-fa6-solid-toggle-off h-2.5rem w-2.5rem text-gray-400 hover:text-gray-600 transition-colors duration-300 vertical-bottom"
    />
    <div
      v-else
      class="i-fa6-solid-toggle-on h-2.5rem w-2.5rem text-teal-500 hover:text-teal-700 transition-colors duration-300 vertical-bottom"
    />
  </div>
</template>
