import { computed, type Ref } from 'vue'

export function useIsWithinTenDays(dateRef: Ref<string | undefined>) {
  return computed(() => {
    const raw = dateRef.value
    if (!raw) return false
    const parsed = new Date(raw)
    if (Number.isNaN(parsed.getTime())) return false
    const diff = Date.now() - parsed.getTime()
    const diffInDays = diff / (1000 * 60 * 60 * 24)
    return diffInDays <= 10
  })
}
