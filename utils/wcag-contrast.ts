/**
 * WCAG 2.1 コントラスト比計算ユーティリティ
 * W3C アルゴリズムを直接実装 — 外部ライブラリ不要
 */

/** sRGB → 相対輝度 */
function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/** hex → [r, g, b] */
function parseRGB(hex: string): [number, number, number] {
  hex = hex.replace('#', '')
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ]
}

/** コントラスト比 (1:1 ~ 21:1) */
export function contrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = parseRGB(hex1)
  const [r2, g2, b2] = parseRGB(hex2)
  const l1 = luminance(r1, g1, b1)
  const l2 = luminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG AA 判定 (通常テキスト 4.5:1, 大きいテキスト 3.0:1) */
export function meetsAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 3.0 : ratio >= 4.5
}

/** WCAG AAA 判定 (通常テキスト 7.0:1, 大きいテキスト 4.5:1) */
export function meetsAAA(ratio: number, isLargeText = false): boolean {
  return isLargeText ? ratio >= 4.5 : ratio >= 7.0
}

/** hex カラー文字列をパース (#RGB or #RRGGBB) */
export function parseHexColor(color: string): string | null {
  if (/^#[0-9a-f]{6}$/i.test(color))
    return color
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`
  }
  return null
}

/** rgb(r, g, b) 文字列を hex に変換 */
export function rgbToHex(rgb: string): string | null {
  const match = rgb.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!match)
    return null
  const [, r, g, b] = match
  return (
    `#${
      [r, g, b]
        .map(v => Number(v).toString(16).padStart(2, '0'))
        .join('')}`
  )
}
