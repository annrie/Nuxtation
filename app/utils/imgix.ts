import { ImgixBaseUrl } from '~/logic/constants'

/**
 * imgix の画像の指定（記事の frontmatter の img など）を、パスとパラメータに分ける。
 * img は `blog/004.webp?mark-pad=0&mark64=…` のように、文字入れのパラメータを含むことがある。
 * そのまま後ろに `?…` を足すと `?` が 2 つ並び、2 つ目の直後のパラメータが前の値に飲み込まれる
 * （`mark-align=center,middle?auto=…` となって auto が消える）
 * @param src - 画像の指定（パス、またはパスとパラメータ）
 * @returns パスと、パラメータのオブジェクト（無ければ空）
 */
export function splitImgixSource(src: string): { path: string, params: Record<string, string> } {
  const index = src.indexOf('?')
  if (index === -1)
    return { path: src, params: {} }
  return {
    path: src.slice(0, index),
    params: Object.fromEntries(new URLSearchParams(src.slice(index + 1))),
  }
}

/**
 * imgix の URL を組み立てる。画像の指定に含まれるパラメータと extra を 1 つの `?` にまとめる（同じキーは extra が勝つ）
 * @param src - 画像の指定（パス、またはパスとパラメータ）
 * @param extra - 足すパラメータ
 * @returns imgix の URL
 */
export function buildImgixUrl(src: string, extra: Record<string, string | number> = {}): string {
  const { path, params } = splitImgixSource(src)
  const query = new URLSearchParams({
    ...params,
    ...Object.fromEntries(Object.entries(extra).map(([key, value]) => [key, String(value)])),
  }).toString()
  return `${ImgixBaseUrl}${path}${query ? `?${query}` : ''}`
}
