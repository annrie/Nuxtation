import { defineEventHandler, getQuery } from 'h3'
import ogs from 'open-graph-scraper'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    return { error: 'URL is required' }
  }

  try {
    const { result } = await ogs({ url })
//    console.log('OGP情報:', result) // 取得したOGP情報をログに出力
    return result
  }
  catch (error) {
    console.error('OGP取得エラー:', error) // 取得したOGP情報をログに出力
    return { error: error.message }
  }
})
