/**
 * link-card の URL 抽出と、取得対象外ホストの判定。
 *
 * ファイルシステムもネットワークも触らない純粋関数だけを置く。
 * 副作用のある処理は refresh-ogp.ts 側にある。テストからは
 * このファイルだけを import する（refresh-ogp.ts を import すると
 * スクリプト本体が走ってしまうため）。
 */

/** ogp-cache.json に保存するフィールド。OGS の生レスポンスは大きいので絞る。 */
export interface OgpEntry {
  ogTitle: string
  ogDescription: string
  /** OGS の ogImage[0].url を文字列に平坦化したもの */
  ogImage: string
  ogUrl: string
}

/**
 * `::link-card{propsUrl="..."}` から URL を抽出する。
 *
 * 実測した記法は3リポとも `::link-card{propsUrl="..."}` の1種類のみだが、
 * 先頭のコロン数と引用符の種類は縛らずに拾う。
 */
export function extractLinkCardUrls(markdown: string): string[] {
  const pattern = /link-card\{[^}]*propsUrl=["']([^"']+)["']/g

  return [...markdown.matchAll(pattern)].map(match => match[1])
}

/**
 * RFC 2606 / 6761 で例示・ドキュメント用に予約されたホストか。
 *
 * example.com は IANA の最小ページで OG タグを持たないため、取得しても
 * 空のカードにしかならない。取得を試みる意味がないので対象から外す。
 * これはセキュリティ制御ではない（SSRF 対策はエンドポイント廃止そのものが担う）。
 */
export function isReservedHost(url: string): boolean {
  let hostname: string
  try {
    hostname = new URL(url).hostname.toLowerCase()
  }
  catch {
    return false
  }

  const reservedTlds = ['test', 'example', 'invalid', 'localhost']
  if (reservedTlds.some(tld => hostname === tld || hostname.endsWith(`.${tld}`)))
    return true

  const reservedDomains = ['example.com', 'example.net', 'example.org']

  return reservedDomains.some(
    domain => hostname === domain || hostname.endsWith(`.${domain}`),
  )
}
