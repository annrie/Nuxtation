// server/error.ts
export default defineEventHandler((error) => {
  console.error('Nitro error:', error)

  // robots.txtに関連するエラーの場合
  if (error.url?.includes('robots.txt')) {
    // デフォルトのrobots.txtを返す
    return new Response(
      'User-agent: *\nAllow: /\nSitemap: https://nuxtation.phantomoon.com/sitemap.xml',
      {
        headers: {
          'content-type': 'text/plain',
          'cache-control': 'public, max-age=86400'
        }
      }
    )
  }

  // その他のエラーは通常通り処理
  return error
})