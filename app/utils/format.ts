export const parseDate = (date?: string) => {
  if (!date) {
    return ''
  }
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) {
    return date
  }
  const year = parsed.getFullYear()
  const month = parsed.getMonth() + 1
  const day = parsed.getDate()
  return `${year}年${month}月${day}日`
}

/**
 * publishedAtとupdatedAtから最新の日付を取得する
 * @param publishedAt - 公開日
 * @param updatedAt - 更新日
 * @returns 最新の日付文字列（両方なければ空文字列）
 */
export const getLatestDate = (publishedAt?: string, updatedAt?: string): string => {
  if (!publishedAt && !updatedAt) return ''
  if (!publishedAt) return updatedAt || ''
  if (!updatedAt) return publishedAt || ''

  // 両方ある場合は新しい方を返す
  return new Date(updatedAt) > new Date(publishedAt) ? updatedAt : publishedAt
}
