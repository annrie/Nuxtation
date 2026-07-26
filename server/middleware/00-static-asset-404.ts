// Vercel では静的ファイルは CDN が配信するため、serverless function に届く
// 画像/アイコンのリクエストは「存在しないファイル」に限られる。これを docus/
// @nuxt/content が提供するキャッチオール([...slug])に渡すと、そこが
// createError({ statusCode: 404, fatal: true }) を投げ、ストリーミング応答中の
// fatal エラーとなって Vercel の function がクラッシュする
// (FUNCTION_INVOCATION_FAILED)。ローカル(node preset)では綺麗な 404 を返すため
// 顕在化しない、Vercel 固有の挙動。
//
// ここで存在しないアセット要求に綺麗な 404 を返し、キャッチオール crash を防ぐ。
// Vercel 限定にすることで、静的ファイルを function 経由で配信するローカル/他preset
// を壊さない（実在アセットや /_ipx/・/api/ 等の動的ハンドラは除外）。
const ASSET_EXT = /\.(?:png|ico|jpe?g|gif|svg|webp|avif|bmp|webmanifest)$/i

export default defineEventHandler((event) => {
  if (!process.env.VERCEL)
    return

  // event.path はクエリ文字列を含むため、拡張子判定($ 終端)が
  // /missing.png?v=1 のようなキャッシュバスト付き要求を素通りさせてしまう。
  // pathname のみで判定する。
  const path = event.path.split('?')[0]
  if (
    path.startsWith('/_ipx/')
    || path.startsWith('/api/')
    || path.startsWith('/__')
    || path.startsWith('/_nuxt/')
  ) {
    return
  }

  if (ASSET_EXT.test(path)) {
    setResponseStatus(event, 404)
    return 'Not Found'
  }
})
