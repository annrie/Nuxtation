import type { Ref } from 'vue'
import { computed } from 'vue'

export function useIsWithinTenDays(updatedAt: Ref<string>) {
  return computed(() => {
    const now = new Date()
    const updatedAtDate = new Date(updatedAt.value)
    const diffInDays = (now.getTime() - updatedAtDate.getTime()) / (1000 * 60 * 60 * 24)
    return diffInDays <= 10
  })
}
