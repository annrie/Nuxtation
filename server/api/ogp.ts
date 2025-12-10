// server/api/ogp.ts
import { defineEventHandler, getQuery, sendError, H3Error } from 'h3'
import ogs from 'open-graph-scraper'

// タイムアウト値を設定 (例: 20秒 = 20000ミリ秒)
// この値は必要に応じて調整してください。
const OGS_REQUEST_TIMEOUT = 20000;

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    // エラーレスポンスを H3Error を使って返すことで、
    // Nuxt (Nitro) が適切なHTTPステータスコードを設定しやすくなります。
    const error = new H3Error('URL is required');
    error.statusCode = 400; // Bad Request
    return sendError(event, error);
  }

  try {
    const { result, error: ogsInternalError } = await ogs({
      url,
      timeout: OGS_REQUEST_TIMEOUT, // タイムアウト値をミリ秒で指定
      // open-graph-scraper はリダイレクトに追従する 'followRedirect': true がデフォルトです。
      // 他にも 'retry': 2 (デフォルト)などのオプションがあります。
    });

    // ogs はエラーがあっても例外を投げず、結果オブジェクト内の error フラグや
    // success: false で示すことがあります。
    if (ogsInternalError || !result || !result.success) {
      const errorMessage = result?.ogError || 'Failed to scrape OGP data due to an unknown reason from ogs.';
      console.error(`[OGP API] OGS failed for ${url}:`, errorMessage, result);
      const error = new H3Error(errorMessage);
      error.statusCode = 502; // Bad Gateway (外部サービスからのエラーとして)
      // クライアント側で詳細なエラー情報が必要な場合は、result を data に含めることもできます
      // error.data = { ogsResult: result };
      return sendError(event, error);
    }

    // console.log('[OGP API] OGP情報:', result);
    return result; // 成功時は ogs の result オブジェクトを返す

  } catch (error: any) { // try-catch は予期せぬ例外（ライブラリのバグなど）を捕捉
    console.error(`[OGP API] Unhandled exception for ${url}:`, error);
    let errorMessage = 'An unexpected error occurred while fetching OGP data.';
    let statusCode = 500; // Internal Server Error

    // タイムアウト関連のエラーかどうかを判定
    // (error.name や error.message はエラーの種類によって変わるため、複数のキーワードでチェック)
    if (error.name === 'AbortError' || // Node.js の AbortController や undici の fetch でタイムアウト時に発生
        (error.message && error.message.toLowerCase().includes('timeout')) ||
        (error.code && error.code === 'ETIMEDOUT')) { // Node.js の net モジュールなどで発生するタイムアウト
      errorMessage = 'The OGP request timed out while fetching from the external site.';
      statusCode = 504; // Gateway Timeout
    }

    const h3Error = new H3Error(errorMessage);
    h3Error.statusCode = statusCode;
    // error.cause や error.stack など、デバッグに役立つ情報をdataに含めることも検討
    // h3Error.data = { originalError: error.toString(), stack: error.stack };
    return sendError(event, h3Error);
  }
})