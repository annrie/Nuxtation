/**
 * ブログ記事の日付関連のユーティリティ
 */

/**
 * publishedAtとupdatedAtの新しい方の日付を取得（Dateオブジェクト）
 * @param entry - publishedAtとupdatedAtを持つオブジェクト
 * @returns 新しい方の日付（両方ない場合は1970/1/1）
 */
export function getBlogLatestDate(entry: { publishedAt?: string; updatedAt?: string }): Date {
  const published = entry.publishedAt ? new Date(entry.publishedAt) : null
  const updated = entry.updatedAt ? new Date(entry.updatedAt) : null

  if (!published && !updated) return new Date(0)
  if (!published) return updated!
  if (!updated) return published
  return updated > published ? updated : published
}

/**
 * ブログ記事の配列を最新日付順にソート
 * @param articles - ブログ記事の配列
 * @returns ソートされた配列（新しい順）
 */
export function sortArticlesByLatestDate<T extends { publishedAt?: string; updatedAt?: string }>(
  articles: T[]
): T[] {
  return articles.sort((a, b) => {
    const dateA = getBlogLatestDate(a)
    const dateB = getBlogLatestDate(b)
    return dateB.getTime() - dateA.getTime()
  })
}
