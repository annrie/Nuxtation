/**
 * 記事データ取得の共通ロジック
 */
import type { Collections, PageCollections } from '@nuxt/content'

// コレクション名はジェネリクスで受け、`queryCollection` が返す項目の型を呼び出し側まで引き継ぐ。
// `string` で受けると `keyof Collections` に渡せず、戻り値も全コレクションの union になる。
interface ArticleDataOptions<C extends keyof PageCollections> {
  collection: C
  slug: string
  path: string
}

/**
 * メイン記事データを取得
 * @param collection - コレクション名（blog）
 * @param slug - 記事のslug
 * @returns 記事データ
 */
export function useArticle<C extends keyof Collections>(collection: C, slug: string) {
  return useAsyncData(`${collection}-${slug}`, () =>
    queryCollection(collection).path(`/${collection}/${slug}`).first())
}

/**
 * 前後の記事を取得
 * @param collection - コレクション名（blog）
 * @param path - 現在の記事パス
 * @returns 前後の記事データ
 */
export function useSurroundingArticles<C extends keyof PageCollections>(collection: C, path: string) {
  return useAsyncData(`surround-${collection}-${path}`, async () => {
    // まず前後の記事を取得
    const surroundings = await queryCollectionItemSurroundings(collection, path)

    if (!surroundings)
      return null

    const [prev, next] = surroundings

    // 開発環境以外ではdraft記事を除外
    if (import.meta.dev) {
      return surroundings
    }

    return [
      prev && !prev.draft ? prev : null,
      next && !next.draft ? next : null,
    ]
  })
}

/**
 * 全記事リストを取得
 * @param collection - コレクション名（blog）
 * @param orderBy - ソート順のフィールド名（デフォルト: 'publishedAt'）
 * @param orderDirection - ソート方向（'ASC' | 'DESC'、デフォルト: 'DESC'）
 * @returns 全記事リスト
 */
export function useAllArticles<C extends keyof Collections>(
  collection: C,
  orderBy?: keyof Collections[C] & string,
  orderDirection: 'ASC' | 'DESC' = 'DESC',
) {
  const key = orderBy
    ? `${collection}-all-articles-${orderBy}-${orderDirection}`
    : `${collection}-all-articles`

  return useAsyncData(key, () => {
    const query = queryCollection(collection)
    return orderBy ? query.order(orderBy, orderDirection).all() : query.all()
  })
}

/**
 * 記事データを一括取得（メイン記事、前後記事、全記事リスト）
 * @param options - コレクション名、slug、パス
 * @returns 記事データ、前後記事、全記事リスト
 */
export async function useArticleDataBundle<C extends keyof PageCollections>(options: ArticleDataOptions<C>) {
  const { collection, slug, path } = options

  const article = await useArticle(collection, slug)
  const surrounding = await useSurroundingArticles(collection, path)
  const allArticles = await useAllArticles(collection)

  return {
    article: article.data,
    surrounding: surrounding.data,
    allArticles: allArticles.data,
  }
}
