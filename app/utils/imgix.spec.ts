import { describe, expect, it } from 'vitest'
import { buildImgixUrl, splitImgixSource } from './imgix'

// 記事の frontmatter の img（文字入れのパラメータを含む形）
const MARKED = 'blog/004.webp?mark-pad=0&fit=crop&mark64=aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0&mark-align=center%2Cmiddle'

describe('splitImgixSource', () => {
  it('パラメータが無ければ、パスだけを返す', () => {
    expect(splitImgixSource('biblio/001/kamigari-1.jpg')).toEqual({ path: 'biblio/001/kamigari-1.jpg', params: {} })
  })

  it('パスとパラメータに分け、値をデコードする', () => {
    expect(splitImgixSource(MARKED)).toEqual({
      path: 'blog/004.webp',
      params: { 'mark-pad': '0', 'fit': 'crop', 'mark64': 'aHR0cHM6Ly9hc3NldHMuaW1naXgubmV0L350ZXh0', 'mark-align': 'center,middle' },
    })
  })
})

describe('buildImgixUrl', () => {
  it('パラメータと extra を 1 つの ? にまとめる', () => {
    const url = buildImgixUrl(MARKED, { auto: 'format,compress', blur: 50 })
    expect(url.split('?')).toHaveLength(2)
    const params = new URL(url).searchParams
    expect(params.get('mark-align')).toBe('center,middle')
    expect(params.get('auto')).toBe('format,compress')
    expect(params.get('blur')).toBe('50')
  })

  it('同じキーは extra が勝ち、重複しない', () => {
    const url = buildImgixUrl(MARKED, { fit: 'max' })
    expect(new URL(url).searchParams.getAll('fit')).toEqual(['max'])
  })

  it('パラメータが何も無ければ ? を付けない', () => {
    expect(buildImgixUrl('ogp.png')).toBe('https://nuxtation.imgix.net/ogp.png')
  })
})
