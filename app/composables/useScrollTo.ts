/**
 * スムーズスクロール処理の共通ロジック
 */

/**
 * ヘッダー高さを含めたオフセットを計算
 * @returns ヘッダー高さ + 追加オフセット
 */
function calculateScrollOffset(): number {
  if (process.server) return 80 // SSR時のデフォルト

  const header = document.querySelector('header.custom-header')
  const headerHeight = header ? header.getBoundingClientRect().height : 0
  const extraOffset = 16 // 追加の余白
  return headerHeight + extraOffset
}

/**
 * 指定された要素までスムーズスクロール
 * @param element - スクロール先のDOM要素
 * @param customOffset - カスタムオフセット（省略時は自動計算）
 */
export function scrollToElement(element: HTMLElement | null, customOffset?: number) {
  if (!element || process.server) return

  const offset = customOffset ?? calculateScrollOffset()
  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset

  window.scrollTo({
    top: Math.max(offsetPosition, 0),
    behavior: 'smooth',
  })
}

/**
 * IDを指定して要素までスムーズスクロール
 * @param id - 要素のID（#なし）
 * @param customOffset - カスタムオフセット（省略時は自動計算）
 */
export function scrollToHeading(id: string, customOffset?: number) {
  if (process.server) return

  const element = document.getElementById(id)
  if (element) {
    scrollToElement(element, customOffset)
  }
}

/**
 * スムーズスクロール機能を提供するcomposable
 * @param options - オプション設定
 * @returns スクロール関数
 */
export function useScrollTo(options: { offset?: number } = {}) {
  const { offset } = options

  const scrollTo = (target: string | HTMLElement) => {
    if (typeof target === 'string') {
      scrollToHeading(target, offset)
    } else {
      scrollToElement(target, offset)
    }
  }

  return {
    scrollTo,
    scrollToElement: (element: HTMLElement) => scrollToElement(element, offset),
    scrollToHeading: (id: string) => scrollToHeading(id, offset),
  }
}
