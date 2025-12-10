<script setup lang="ts">
import type { PageCollections } from '@nuxt/content'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>()

const isSearchModalOpen = computed({
  get: () => props.isOpen,
  set: (value) => emit('update:isOpen', value)
})

const searchQuery = ref('')
const searchResults = ref<any[]>([])
const selectedIndex = ref(-1)
const searchInputRef = ref<HTMLInputElement | null>(null)
const modalContentRef = ref<HTMLElement | null>(null)

// フォーカストラップの適用
useFocusTrap(modalContentRef, isSearchModalOpen)

// Search data from all collections
const { data: files } = useLazyAsyncData('search', async () => {
  const blogFiles = await queryCollection('blog' as keyof PageCollections).all()
  return blogFiles || []
})

// Extract text from body object
const extractTextFromBody = (body: any): string => {
  if (!body) return ''
  if (typeof body === 'string') return body

  let text = ''
  const traverse = (node: any) => {
    if (!node) return

    if (node.type === 'text' && node.value) {
      text += node.value + ' '
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse)
    }
  }

  if (body.children && Array.isArray(body.children)) {
    body.children.forEach(traverse)
  }

  return text
}

// Get snippet around search query
const getSnippet = (text: string, query: string, maxLength: number = 150): string => {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return ''

  const start = Math.max(0, index - maxLength / 2)
  const end = Math.min(text.length, index + query.length + maxLength / 2)

  let snippet = text.substring(start, end)

  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'

  return snippet
}

// Highlight search query in text
const highlightQuery = (text: string, query: string): string => {
  if (!query || !text) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-white px-0.5 rounded">$1</mark>')
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = -1
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

// Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (!searchResults.value.length) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, searchResults.value.length - 1)
      scrollToSelected()
      break

    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      scrollToSelected()
      break

    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < searchResults.value.length) {
        const selected = searchResults.value[selectedIndex.value]
        navigateTo(selected.path)
        isSearchModalOpen.value = false
      }
      break

    case 'Escape':
      isSearchModalOpen.value = false
      break
  }
}

// Scroll to selected item
const scrollToSelected = () => {
  nextTick(() => {
    const selectedElement = document.querySelector(`[data-search-index="${selectedIndex.value}"]`)
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'auto' })
    }
  })
}

// Search function
const performSearch = () => {
  if (!searchQuery.value || !files.value) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = files.value
    .map((file: any) => {
      const title = (file.title || '').toLowerCase()
      const description = (file.description || '').toLowerCase()
      const subtitle = (file.subtitle || '').toLowerCase()
      const bodyText = extractTextFromBody(file.body)
      const bodyLower = bodyText.toLowerCase()

      const matchInTitle = title.includes(query)
      const matchInDescription = description.includes(query)
      const matchInSubtitle = subtitle.includes(query)
      const matchInBody = bodyLower.includes(query)

      if (!matchInTitle && !matchInDescription && !matchInSubtitle && !matchInBody) {
        return null
      }

      // Generate snippet
      let snippet = ''
      let matchType = ''

      if (matchInDescription) {
        snippet = file.description
        matchType = 'description'
      } else if (matchInSubtitle) {
        snippet = file.subtitle
        matchType = 'subtitle'
      } else if (matchInBody) {
        snippet = getSnippet(bodyText, query)
        matchType = 'body'
      } else if (matchInTitle) {
        // Fallback snippet for title match
        snippet = file.description || file.subtitle || getSnippet(bodyText, query)
        matchType = 'title'
      }

      return {
        ...file,
        snippet,
        matchType
      }
    })
    .filter(Boolean)
}

// Watch search query
watch(searchQuery, () => {
  selectedIndex.value = -1 // Reset selection on new search
  performSearch()
})

// Reset selection when modal closes and focus input when opening
watch(isSearchModalOpen, async (newValue) => {
  if (newValue) {
    await nextTick()
    searchInputRef.value?.focus()
    return
  }

  selectedIndex.value = -1
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isSearchModalOpen"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
        class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4"
        @click.self="isSearchModalOpen = false"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/80" @click="isSearchModalOpen = false" />

        <!-- Modal Content -->
        <div ref="modalContentRef" class="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 max-sm:bg-gray-900 max-sm:text-white">
          <!-- Close button -->
          <button
            aria-label="検索を閉じる"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full !border-0 !border-transparent"
            @click="isSearchModalOpen = false"
          >
            <svg aria-hidden="true" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Search UI -->
          <div v-if="files">
            <h2 id="search-modal-title" class="text-2xl font-bold mb-4 text-gray-900 dark:text-white max-sm:text-white">検索</h2>

            <!-- Search input -->
            <div class="relative">
              <label for="search-input" class="sr-only">検索キーワード</label>
              <input
                id="search-input"
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="検索キーワードを入力... (↑↓で選択、Enterで移動)"
                aria-describedby="search-help"
                class="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-sm:bg-gray-800 max-sm:text-gray-100 max-sm:border-gray-700"
                @keydown="handleKeyDown"
              />
              <span id="search-help" class="sr-only">↑↓キーで選択、Enterキーで移動、Escapeキーで閉じる</span>
              <button
                v-if="searchQuery"
                type="button"
                aria-label="検索キーワードをクリア"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors border-none focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-full !border-0 !border-transparent"
                @click="clearSearch"
              >
                <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Search results -->
            <div class="mt-6 max-h-96 overflow-y-auto">
              <p v-if="!searchQuery" class="text-sm text-gray-600 dark:text-gray-400 max-sm:text-gray-400">
                {{ files.length }} 件のドキュメントから検索できます
              </p>

              <p v-else-if="searchResults.length === 0" class="text-sm text-gray-600 dark:text-gray-400 max-sm:text-gray-400">
                「{{ searchQuery }}」の検索結果: 0件
              </p>

              <div v-else>
                <p class="text-sm text-gray-600 dark:text-gray-400 max-sm:text-gray-400 mb-4">
                  「{{ searchQuery }}」の検索結果: {{ searchResults.length }}件
                </p>

                <div class="space-y-3">
                  <NuxtLink
                    v-for="(result, index) in searchResults"
                    :key="result.path || result._path"
                    :to="result.path || result._path"
                    :data-search-index="index"
                    tabindex="0"
                    :class="[
                      'block p-4 rounded-lg border transition-colors focus:outline-none',
                      index === selectedIndex
                        ? 'border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500'
                    ]"
                    @click="isSearchModalOpen = false"
                    @mouseenter="selectedIndex = index"
                    @focus="selectedIndex = index"
                  >
                    <h3
                      class="font-semibold text-gray-900 dark:text-white mb-1"
                      v-html="highlightQuery(result.title, searchQuery)"
                    />
                    <p
                      v-if="result.snippet"
                      class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2"
                      v-html="highlightQuery(result.snippet, searchQuery)"
                    />
                    <div class="flex items-center gap-2">
                      <span
                        v-if="result.matchType === 'subtitle'"
                        class="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded"
                      >
                        サブタイトル
                      </span>
                      <span
                        v-if="result.matchType === 'body'"
                        class="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded"
                      >
                        本文
                      </span>
                      <div v-if="result.tags && result.tags.length" class="flex flex-wrap gap-2">
                        <span
                          v-for="tag in result.tags.slice(0, 3)"
                          :key="tag"
                          class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="p-8 text-center">
            <p class="text-gray-600 dark:text-gray-400">検索データを読み込み中...</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
