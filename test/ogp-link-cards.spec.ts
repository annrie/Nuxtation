// @vitest-environment node
//
// node 環境を明示する。vitest.config.ts の既定は jsdom だが、**本体の
// pnpm ogp:refresh は tsx で Nuxt も DOM も無い所を走る**ので、実行条件を
// 揃えておく。
//
// **レポーターの `|jsdom|` 表示に惑わされないこと。** 行頭に出るのは
// プロジェクト既定の環境名で、ファイル単位の上書きは反映されない。
// 効いているかは `typeof window` で判る（docblock あり → undefined、
// 外すと object。実測で確認済み）。

/**
 * 抽出ロジックの単体テスト。
 *
 * `scripts/ogp-*.ts` は nuxtation / docustation / private-nuxtation で
 * byte 同一で、**この spec と vitest.config.ts も3リポ byte 同一**。
 * 変更するときは3リポすべてに同じ変更を入れること（同期を強制する
 * 仕組みは無い）。壊すと3リポとも黙って壊れる。
 *
 * **ここで見るのは抽出ロジックだけ。実際の `content/` とキャッシュの
 * 突き合わせは意図的に持たせていない**（2026-08-09 決定）。それは
 * `pnpm check:ogp-cache` の担当で、pre-commit と `pnpm build` /
 * `pnpm generate` の先頭から実行されるため、既に塞がっている。
 * 同じ検査を vitest 側にも重ねると、キャッシュを更新するたびに直す場所が
 * 2箇所に増えるだけで、防げる事故は増えない。
 */

import { describe, expect, it } from 'vitest'
import {
  extractLinkCardUrls,
  findMissingCacheEntries,
  isReservedHost,
} from '../scripts/ogp-link-cards'

/** コードフェンスをテンプレートリテラル内に直接書くと閉じてしまうので定数にする。 */
const FENCE = '```'

describe('extractLinkCardUrls', () => {
  it('::link-card 記法から URL を抜き出す', async () => {
    const md = '::link-card{propsUrl="https://example.jp/a"}'

    await expect(extractLinkCardUrls(md)).resolves.toEqual(['https://example.jp/a'])
  })

  it('1ファイル内の複数の link-card をすべて拾う', async () => {
    const md = [
      '# 見出し',
      '::link-card{propsUrl="https://example.jp/a"}',
      '本文',
      '::link-card{propsUrl="https://example.jp/b"}',
    ].join('\n')

    await expect(extractLinkCardUrls(md)).resolves.toEqual([
      'https://example.jp/a',
      'https://example.jp/b',
    ])
  })

  it('シングルクォート記法も拾う', async () => {
    const md = '::link-card{propsUrl=\'https://example.jp/a\'}'

    await expect(extractLinkCardUrls(md)).resolves.toEqual(['https://example.jp/a'])
  })

  it('link-card 以外の記法は拾わない', async () => {
    const md = '::other-card{propsUrl="https://example.jp/a"}'

    await expect(extractLinkCardUrls(md)).resolves.toEqual([])
  })

  it('link-card が無ければ空配列', async () => {
    await expect(extractLinkCardUrls('ただの本文')).resolves.toEqual([])
  })

  // MDC は inline 記法の属性を kebab-case へ正規化し、Block 記法の YAML は
  // camelCase のまま渡す。記事はどちらの書き方も読者に案内している。
  // 正規表現で抽出していた頃は Block 記法を拾えず、記事の案内どおりに書くと
  // カードが静かにただのリンクへ劣化していた。
  it('block 記法（YAML frontmatter）も拾う', async () => {
    const md = [
      '::link-card',
      '---',
      'propsUrl: "https://example.jp/block"',
      '---',
      '::',
    ].join('\n')

    await expect(extractLinkCardUrls(md)).resolves.toEqual(['https://example.jp/block'])
  })

  it('inline 記法と block 記法が混在していても両方拾う', async () => {
    const md = [
      '::link-card{propsUrl="https://example.jp/inline"}',
      '::',
      '',
      '::link-card',
      '---',
      'propsUrl: "https://example.jp/block"',
      '---',
      '::',
    ].join('\n')

    await expect(extractLinkCardUrls(md)).resolves.toEqual([
      'https://example.jp/inline',
      'https://example.jp/block',
    ])
  })

  // 正規表現で抽出していた頃はここを拾っていた。記事の使用例に実在URLを
  // 書いた瞬間、読者に見せるためだけの URL へ取得が走る状態だった。
  it('コードフェンス内の使用例は拾わない', async () => {
    const md = [
      '使い方:',
      '',
      `${FENCE}md`,
      '::link-card{propsUrl="https://example.jp/fenced-inline"}',
      '::',
      '',
      '::link-card',
      '---',
      'propsUrl: "https://example.jp/fenced-block"',
      '---',
      '::',
      FENCE,
    ].join('\n')

    await expect(extractLinkCardUrls(md)).resolves.toEqual([])
  })

  it('インラインコード内の記法も拾わない', async () => {
    const md = '`::link-card{propsUrl="https://example.jp/inline-code"}` と書きます。'

    await expect(extractLinkCardUrls(md)).resolves.toEqual([])
  })

  // バインドされた URL は MDCRenderer が frontmatter から解決して描画するが、
  // AST にはバインド式のまま残るので抽出できない。黙って取りこぼすと
  // カードが静かにリンクへ劣化するため、明示的に止める。
  //
  // **接頭辞を数え上げない。** `:` だけ見て v-bind: を、両方見て v-model: を
  // 取りこぼした経緯がある。判定は「`:` の直後が URL prop か」なので、
  // ここに無い未知のディレクティブも同じ規則で拒否される。
  it.each([
    ':props-url',
    ':propsUrl',
    'v-bind:props-url',
    'v-bind:propsUrl',
    'v-model:props-url',
    'v-model:propsUrl',
  ])('バインド記法 %s は明示的に拒否する', async (key) => {
    const md = [
      '---',
      'cardUrl: https://example.jp/bound',
      '---',
      '',
      `::link-card{${key}="cardUrl"}`,
      '::',
    ].join('\n')

    await expect(extractLinkCardUrls(md)).rejects.toThrow(/バインド記法/)
  })

  // オブジェクトごと束ねられると propsUrl を含むか静的に判定できない。
  it('v-bind でのオブジェクト束ねも拒否する', async () => {
    const md = [
      '---',
      'cardProps:',
      '  propsUrl: https://example.jp/obj',
      '---',
      '',
      '::link-card{v-bind="cardProps"}',
      '::',
    ].join('\n')

    await expect(extractLinkCardUrls(md)).rejects.toThrow(/バインド記法/)
  })

  // URL に関係のないバインドまで巻き添えにしない。
  // `my-props-url` は `-` 区切りの素の属性で、ディレクティブではない。
  // 一度ここを誤って拒否したので、両方を固定しておく。
  it.each([
    [':title', 'label'],
    ['my-props-url', 'label'],
    // eslint-disable-next-line test/prefer-lowercase-title
  ])('URL prop を指さない %s は通す', async (key, value) => {
    const md = [
      '---',
      'label: 見出し',
      '---',
      '',
      `::link-card{propsUrl="https://example.jp/plain" ${key}="${value}"}`,
      '::',
    ].join('\n')

    await expect(extractLinkCardUrls(md)).resolves.toEqual(['https://example.jp/plain'])
  })

  it('コードフェンスの外にある link-card は巻き添えにしない', async () => {
    const md = [
      '::link-card{propsUrl="https://example.jp/real"}',
      '::',
      '',
      `${FENCE}md`,
      '::link-card{propsUrl="https://example.jp/fenced"}',
      '::',
      FENCE,
    ].join('\n')

    await expect(extractLinkCardUrls(md)).resolves.toEqual(['https://example.jp/real'])
  })
})

describe('isReservedHost', () => {
  it.each([
    'https://example.com',
    'https://example.net/path',
    'https://example.org',
    'https://www.example.com',
    'https://foo.test',
    'https://foo.example',
    'https://foo.invalid',
    'http://localhost',
    'http://foo.localhost',
  ])('予約ドメインと判定する: %s', (url) => {
    expect(isReservedHost(url)).toBe(true)
  })

  it.each([
    'https://qiita.com/kurokawa516/items/80ea1a0e3a3f51a44f2b',
    'https://www.mt-work.com/blog/post-5/',
    'https://example.jp',
    'https://notexample.com',
  ])('通常のホストは予約扱いにしない: %s', (url) => {
    expect(isReservedHost(url)).toBe(false)
  })

  // eslint-disable-next-line test/prefer-lowercase-title
  it('URL として解釈できない文字列は予約扱いにしない', () => {
    expect(isReservedHost('not a url')).toBe(false)
  })
})

describe('findMissingCacheEntries', () => {
  /** refresh-ogp.ts が書き出すのと同じ形。空オブジェクトは無効なので使えない。 */
  const entry = {
    ogTitle: 'タイトル',
    ogDescription: '説明',
    ogImage: 'https://example.jp/og.png',
    ogUrl: 'https://example.jp/a',
  }

  it('キャッシュに無い URL を返す', () => {
    const missing = findMissingCacheEntries(
      ['https://example.jp/a', 'https://example.jp/b'],
      { 'https://example.jp/a': entry },
    )

    expect(missing).toEqual(['https://example.jp/b'])
  })

  it('すべて揃っていれば空配列', () => {
    const missing = findMissingCacheEntries(
      ['https://example.jp/a'],
      { 'https://example.jp/a': entry },
    )

    expect(missing).toEqual([])
  })

  // 予約ホストは refresh-ogp.ts 側でも取得対象から外れるため、
  // キャッシュに無いのが正しい状態。欠落として報告してはいけない。
  it('予約ドメインは欠落として扱わない', () => {
    const missing = findMissingCacheEntries(['https://example.com'], {})

    expect(missing).toEqual([])
  })

  it('同じ URL が複数回参照されていても1件にまとめる', () => {
    const missing = findMissingCacheEntries(
      ['https://example.jp/a', 'https://example.jp/a'],
      {},
    )

    expect(missing).toEqual(['https://example.jp/a'])
  })

  // キーの有無だけを見ていると、値が壊れていても「最新です」と報告してしまう。
  // LinkCard.vue は ogTitle 等を実行時の検証なしに読むので、空のカードや
  // 壊れた表示になる。
  it.each([
    ['null', null],
    ['文字列', 'not an object'],
    ['数値', 42],
    ['配列', []],
    ['空オブジェクト', {}],
    ['ogUrl 欠け', { ogTitle: 't', ogDescription: 'd', ogImage: '' }],
    ['ogTitle が文字列でない', { ogTitle: 1, ogDescription: 'd', ogImage: '', ogUrl: 'u' }],
  ])('キーがあっても値が %s なら欠落として扱う', (_label, value) => {
    const missing = findMissingCacheEntries(
      ['https://example.jp/a'],
      { 'https://example.jp/a': value },
    )

    expect(missing).toEqual(['https://example.jp/a'])
  })

  // 取得できなかった項目に refresh-ogp.ts が `?? ''` を入れる。正規の値なので
  // 欠落にしてはいけない（ここを弾くと通常運用でコミットできなくなる）。
  it('全フィールドが空文字でも欠落として扱わない', () => {
    const missing = findMissingCacheEntries(
      ['https://example.jp/a'],
      { 'https://example.jp/a': { ogTitle: '', ogDescription: '', ogImage: '', ogUrl: '' } },
    )

    expect(missing).toEqual([])
  })
})
