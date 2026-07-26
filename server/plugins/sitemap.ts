export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('sitemap:resolved', async (ctx) => {
    // 各URLの優先度と更新頻度をカスタマイズ
    for (const url of ctx.urls) {
      const path = url.loc

      // ブログ記事: 高優先度、週次更新
      if (path.startsWith('/blog/') && !path.includes('/tags/')) {
        url.priority = 0.8
        url.changefreq = 'weekly'
      }
      // ブログタグページ: 中優先度、月次更新
      else if (path.startsWith('/blog/tags/')) {
        url.priority = 0.6
        url.changefreq = 'monthly'
      }
    }
  })
})
