// server/middleware/trailingSlashRedirect.ts
import { defineEventHandler, sendRedirect } from 'h3';

export default defineEventHandler((event) => {
  // リクエストURLを取得
  const url = event.node.req.url;

  // ルートパス '/' ではないか、かつ、末尾が '/' で終わるかチェック
  // url が undefined や null の場合を考慮してチェックを追加
  if (url && url !== '/' && url.endsWith('/')) {
    // 末尾のスラッシュを取り除いた新しいURLを作成
    const newUrl = url.slice(0, -1);

    // 新しいURLに301リダイレクト（永続的なリダイレクト）を実行
    // sendRedirect はサーバーサイドでのリダイレクトを行います
    return sendRedirect(event, newUrl, 301);
  }
});