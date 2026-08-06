export const SiteName = 'Nuxtation'
export const SiteDescription = 'Nuxt 4で構築したブログサイト'
export const ogTitle = 'annrie\'s Nuxtation'
export const twitterDescription = 'Nuxt 4で構築したブログサイト'
export const twitterCard = 'summary_large_image'
export const twitterImage = 'https://nuxtation.imgix.net/ogp.png'
export const twitterSite = '@muraie_jin'
/**
 * サイトの正規オリジン。**末尾スラッシュを付けない。**
 * `${SiteUrl}${route.path}` の形で連結する箇所が多いため。
 *
 * URL をここ以外に直書きしないこと。2026-08-06 に、この定数がありながら
 * 24箇所がリテラルを直書きしていたため、docustation のドメインが
 * 全ページの canonical / og:url に出力される事故が起きた。
 */
export const SiteUrl = 'https://nuxtation.vercel.app'

/** 末尾スラッシュ付きが要る箇所向け。 */
export const MySite = `${SiteUrl}/`
export const SiteLanguage = 'ja'
export const SiteImage = 'https://nuxtation.imgix.net/ogp.png'
export const SiteLogo = '/icon.png'
export const SameAs = [
  'https://x.com/muraie_jin',
  'https://github.com/annrie',
  'https://www.facebook.com/muraiejin',
  'https://www.instagram.com/muraie_jin/',
  'https://www.linkedin.com/in/muraie-jin/',
  MySite,
  'https://phantomoon.com/',
]

export const categories = [
  { categoryName: 'Nuxt', categorySlug: 'nuxt' },
  { categoryName: 'Twitter', categorySlug: 'twitter' },
  { categoryName: 'Web Development', categorySlug: 'web development' },
  { categoryName: 'Youtube', categorySlug: 'youtube' },
]
