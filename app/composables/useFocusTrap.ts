/**
 * モーダルダイアログ内でフォーカスをトラップするコンポーザブル
 * WCAG 2.1 - 2.1.2 キーボードトラップなしに準拠
 *
 * @param containerRef - フォーカスをトラップするコンテナ要素のref
 * @param isActive - フォーカストラップを有効化するかどうかの制御
 */
export const useFocusTrap = (
  containerRef: Ref<HTMLElement | null>,
  isActive: Ref<boolean>
) => {
  let previouslyFocusedElement: HTMLElement | null = null

  // フォーカス可能な要素を取得
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.value) return []

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    return Array.from(
      containerRef.value.querySelectorAll<HTMLElement>(focusableSelectors)
    )
  }

  // Tabキーでのフォーカス移動を制御
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isActive.value || event.key !== 'Tab') return

    const focusableElements = getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Shift+Tab: 最初の要素から最後の要素へ
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    }
    // Tab: 最後の要素から最初の要素へ
    else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  // モーダルが開いたときに最初の要素にフォーカス
  const setInitialFocus = () => {
    if (!isActive.value || !containerRef.value) return

    // 現在のフォーカス要素を保存（モーダルを閉じたときに戻すため）
    previouslyFocusedElement = document.activeElement as HTMLElement

    // 最初のフォーカス可能要素を探す
    nextTick(() => {
      const focusableElements = getFocusableElements()
      if (focusableElements.length > 0) {
        // 入力フィールドがあればそれにフォーカス、なければ最初の要素
        const inputElement = focusableElements.find(
          el => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
        )
        const targetElement = inputElement || focusableElements[0]
        targetElement.focus()
      }
    })
  }

  // モーダルが閉じたときに元の要素にフォーカスを戻す
  const restoreFocus = () => {
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      previouslyFocusedElement.focus()
      previouslyFocusedElement = null
    }
  }

  // isActiveの変化を監視
  watch(isActive, (newValue) => {
    if (newValue) {
      setInitialFocus()
    } else {
      restoreFocus()
    }
  })

  // イベントリスナーの登録と解除
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    restoreFocus()
  })

  return {
    setInitialFocus,
    restoreFocus,
  }
}
