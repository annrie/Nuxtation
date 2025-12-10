/**
 * タグ関連の文字列処理ユーティリティ
 */

/**
 * タグ名のハイフンをスペースに置換
 * @param text - 置換対象の文字列
 * @returns ハイフンがスペースに置換された文字列
 */
export function replaceHyphen(text: string): string {
  return text.replace(/-/g, ' ')
}

/**
 * タグ名のマッピング定義
 */
const TAG_NAME_MAP: Record<string, string> = {
  // ブログ用タグマッピング（必要に応じて追加）
}

/**
 * タグ名を日本語表記に変換
 * @param tag - タグ名（英数字）
 * @returns 日本語表記のタグ名（マッピングがない場合は元の文字列）
 */
export function formatTagName(tag: string): string {
  return TAG_NAME_MAP[tag] || tag
}

/**
 * タグに対応するCSSクラス名を生成
 * @param tag - タグ名
 * @param prefix - クラス名のプレフィックス（デフォルト: 'tag-link'）
 * @returns CSSクラス名
 */
export function getTagClass(tag: string, prefix = 'tag-link'): string {
  return `${prefix} ${prefix}--${tag}`
}
