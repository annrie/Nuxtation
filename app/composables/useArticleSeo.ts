/**
 * 記事SEO設定の共通ロジック
 */

import type { ComputedRef } from 'vue'

interface ArticleSeoOptions {
  article: any
  route: any
  baseUrl: string
  breadcrumbSection: {
    name: string
    path: string
  }
  schemaType?: 'BlogPosting' | 'Article' | 'Book'
  ogImageOptions?: {
    useBase64?: boolean
    encodedTitle?: ComputedRef<string> | string
    blur?: number
  }
}

/**
 * タイトル長に応じた適切なテキストサイズを計算
 * @param title - 記事タイトル
 * @returns imgixのtxt-sizeパラメータ値
 */
function calculateTextSize(title: string): number {
  const length = title?.length || 0

  // タイトル長に応じて動的に調整
  if (length <= 8) return 180      // 非常に短い（例: "タイトル"）
  if (length <= 15) return 140     // 短い（例: "これは短いタイトルです"）
  if (length <= 25) return 100     // 中程度（例: "これは普通の長さのタイトルです"）
  if (length <= 35) return 80      // やや長い
  if (length <= 45) return 65      // 長い
  return 50                         // 非常に長い
}

/**
 * imgix OG画像URLを生成
 */
function generateOgImageUrl(
  img: string,
  title: string,
  options: ArticleSeoOptions['ogImageOptions'] = {}
): string {
  const { useBase64 = false, encodedTitle = '', blur = 0 } = options
  const txtSize = calculateTextSize(title)
  const baseParams = 'txt-color=white&txt-shad=4&txt-align=middle,center&txt-font=Hiragino%20Sans%20W6&auto=format,compress&fit=crop'

  if (useBase64 && encodedTitle) {
    const blurParam = blur > 0 ? `&blur=${blur}` : ''
    return `https://nuxtation.imgix.net/${img}?txt64=${encodedTitle}&txt-size=${txtSize}&${baseParams}${blurParam}`
  } else {
    const blurParam = blur > 0 ? `&blur=${blur}` : ''
    return `https://nuxtation.imgix.net/${img}?txt=${encodeURIComponent(title)}&txt-size=${txtSize}&${baseParams}${blurParam}`
  }
}

/**
 * 記事のSEO設定を一括適用
 */
export function useArticleSeo(options: ArticleSeoOptions) {
  const { article, route, baseUrl, breadcrumbSection, schemaType = 'Article', ogImageOptions } = options

  // 基本的なHead設定
  useHead({
    title: article?.value?.title || '',
    meta: [
      { name: 'description', content: article?.value?.description },
      { property: 'og:title', content: article?.value?.title },
      { property: 'og:description', content: article?.value?.description },
      {
        property: 'og:image',
        content: article?.value?.img
          ? `https://nuxtation.imgix.net/${article.value.img}?auto=format,compress&fit=crop&w=1200&h=630`
          : ''
      },
      { property: 'og:type', content: 'article' },
    ],
  })

  // SEOメタデータ設定（computed経由でリアクティブ性を確保）
  const ogImageUrl = computed(() => {
    if (!article.value?.img || !article.value?.title) return ''

    // encodedTitleがComputedRefの場合は.valueでアクセス
    const encodedTitleValue = ogImageOptions?.encodedTitle
      ? (typeof ogImageOptions.encodedTitle === 'object' && 'value' in ogImageOptions.encodedTitle)
        ? ogImageOptions.encodedTitle.value
        : ogImageOptions.encodedTitle
      : undefined

    // encodedTitleValueをoptionsに含めて渡す
    const optionsWithEncodedTitle = {
      ...ogImageOptions,
      encodedTitle: encodedTitleValue
    }

    return generateOgImageUrl(article.value.img, article.value.title, optionsWithEncodedTitle)
  })

  useSeoMeta({
    articleModifiedTime: () => article.value?.updatedAt,
    articlePublishedTime: () => article.value?.publishedAt,
    title: () => article.value?.title,
    twitterTitle: () => article.value?.title,
    description: () => article.value?.description,
    ogType: () => 'article',
    ogUrl: () => `${baseUrl}${route.path}`,
    ogImage: () => ogImageUrl.value,
    twitterImage: () => ogImageUrl.value,
    ogTitle: () => article.value?.title,
    ogDescription: () => article.value?.description,
    twitterDescription: () => article.value?.description,
    twitterCard: 'summary_large_image',
  })

  // 構造化データ
  useJsonld(() => {
    const schemas = [
      // BreadcrumbList
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'ホーム',
            'item': baseUrl,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': breadcrumbSection.name,
            'item': `${baseUrl}${breadcrumbSection.path}`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': article.value?.title || '',
            'item': `${baseUrl}${route.path}`,
          },
        ],
      },
    ]

    // Article/BlogPosting/Book schema
    if (schemaType === 'BlogPosting') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${baseUrl}${route.path}`,
        },
        'headline': article.value?.title || '',
        'description': article.value?.description || '',
        'image': article.value?.img ? `https://nuxtation.imgix.net/${article.value.img}` : '',
        'author': {
          '@type': 'Person',
          'name': 'annrie',
          'url': 'https://nuxtation.phantomoon.com',
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Nuxtation',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://nuxtation.phantomoon.com/logo.png',
          },
        },
        'datePublished': article.value?.publishedAt || '',
        'dateModified': article.value?.updatedAt || '',
      })
    } else if (schemaType === 'Article') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${baseUrl}${route.path}`,
        },
        'headline': article.value?.title || '',
        'description': article.value?.description || '',
        'image': article.value?.img ? `https://nuxtation.imgix.net/${article.value.img}` : '',
        'author': {
          '@type': 'Person',
          'name': 'annrie',
          'url': baseUrl,
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Nuxtation',
          'logo': {
            '@type': 'ImageObject',
            'url': `${baseUrl}/logo.png`,
          },
        },
        'datePublished': article.value?.publishedAt || '',
        'dateModified': article.value?.updatedAt || '',
      })
    } else if (schemaType === 'Book') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': ['Book', 'Article'],
        'name': article.value?.title || '',
        'author': {
          '@type': 'Person',
          'name': '山田正紀',
          'sameAs': 'https://ja.wikipedia.org/wiki/山田正紀',
        },
        'description': article.value?.description || '',
        'url': `https://nuxtation.phantomoon.com${route.path}`,
        'datePublished': article.value?.publishedAt || '',
        'articleBody': article.value?.body || '',
        'genre': article.value?.tags?.map((tag: string) => formatTagName(tag)) || [],
      })
    }

    return schemas
  })
}
