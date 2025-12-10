/**
 * Base64エンコード処理の共通ロジック
 * ブラウザネイティブ API (btoa) を使用
 */

/**
 * UTF-8テキストをBase64エンコード
 * @param text - エンコードするテキスト
 * @returns Base64エンコード文字列
 */
function encodeBase64(text: string): string {
  if (!text) return ''
  // UTF-8対応: encodeURIComponent → unescape → btoa
  return btoa(unescape(encodeURIComponent(text)))
}

/**
 * imgix txt64パラメータ用のBase64エンコード
 * URL-safe形式（+ → -, = を削除）
 * @param text - エンコードするテキスト
 * @returns URL-safe Base64エンコード文字列
 */
export function encodeBase64ForImgix(text: string): string {
  if (!text) return ''
  return encodeBase64(text)
    .replace(/\+/g, '-')
    .replace(/=/g, '')
}

/**
 * スペースを+に置き換えるBase64エンコード
 * @param text - エンコードするテキスト
 * @returns スペース→+形式のBase64エンコード文字列
 */
export function encodeBase64WithPlus(text: string): string {
  if (!text) return ''
  return encodeBase64(text)
    .replace(/\s/g, '+')
    .replace(/=/g, '')
}

/**
 * スペースを%20に置き換えるBase64エンコード（URL encode形式）
 * @param text - エンコードするテキスト
 * @returns スペース→%20形式のBase64エンコード文字列
 */
export function encodeBase64WithPercent(text: string): string {
  if (!text) return ''
  return encodeBase64(text)
    .replace(/\s/g, '%20')
}
