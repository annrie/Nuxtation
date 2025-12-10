<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info'
  },
  icon: {
    type: String,
    default: ''
  }
})

// typeに応じたデフォルトアイコンを設定
const defaultIcons = {
  primary: 'heroicons:information-circle',
  secondary: 'heroicons:information-circle',
  success: 'heroicons:check-circle',
  info: 'heroicons:information-circle',
  warning: 'heroicons:exclamation-triangle',
  alert: 'heroicons:exclamation-circle',
  list: 'heroicons:list-bullet'
}

// iconが指定されていない場合はtypeに応じたデフォルトを使用
const displayIcon = computed(() => {
  return props.icon || defaultIcons[props.type] || defaultIcons.info
})

// typeに応じたスタイルクラスを返す（ダークモードのバリエーションを含む）
const styles = computed(() => {
  const base = 'border-1 border-solid rounded-2 border-transparent pt-16px pb-8px px-16px line-height-loose text-base [&_a]:underline [&_a]:font-medium [&_a]:underline-offset-2 [&_a]:transition-colors mb-5'

  const typeStyles = {
    primary: 'bg-blue-50 text-blue-900 border-blue-200 mb-10px [&_a]:text-blue-700 [&_a:hover]:text-blue-800 dark:bg-blue-500/25 dark:text-blue-100 dark:border-blue-400 dark:[&_a]:text-blue-200 dark:[&_a:hover]:text-blue-100',
    secondary: 'bg-violet-50 text-violet-900 border-violet-200 mb-10px [&_a]:text-violet-700 [&_a:hover]:text-violet-800 dark:bg-indigo-500/25 dark:text-violet-100 dark:border-indigo-400 dark:[&_a]:text-violet-200 dark:[&_a:hover]:text-violet-100',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200 mb-10px [&_a]:text-emerald-700 [&_a:hover]:text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-200 dark:border-emerald-500 dark:[&_a]:text-emerald-200 dark:[&_a:hover]:text-emerald-100',
	info: 'bg-sky-50 text-sky-900 border-sky-200 p-4 pl-2px mb-10px [&_a]:text-sky-700 [&_a:hover]:text-sky-800 dark:bg-sky-500/25 dark:text-sky-100 dark:border-sky-400 dark:[&_a]:text-sky-200 dark:[&_a:hover]:text-sky-100',
	warning: 'bg-amber-50 text-amber-900 dark:text-amber-100 p-4 border-amber-200 pl-2px mb-10px [&_a]:text-amber-700 [&_a:hover]:text-amber-800 dark:bg-amber-500/20 dark:border-amber-500/40 dark:[&_a]:text-amber-200 dark:[&_a:hover]:text-amber-100',
    alert: 'bg-red-50 text-red-900 p-4 border-red-200 pl-2px mb-10px [&_a]:text-red-700 [&_a:hover]:text-red-800 dark:bg-red-500/25 dark:text-red-200 dark:border-red-500/50 dark:[&_a]:text-red-200 dark:[&_a:hover]:text-red-100',
    list: 'bg-slate-50 text-slate-900 [&_a]:text-blue-700 [&_a:hover]:text-blue-800 dark:bg-slate-800/60 dark:text-slate-100 dark:border-slate-600 dark:[&_a]:text-blue-300 dark:[&_a:hover]:text-blue-200'
  }

  return `${base} ${typeStyles[props.type] || typeStyles.info}`
})
</script>

<template>
  <div :class="styles">
    <div class="flex items-start gap-2">
      <Icon :name="displayIcon" class="text-xl shrink-0 mt-1" />
      <div class="flex-1">
        <slot unwrap="p" />
      </div>
    </div>
  </div>
</template>
