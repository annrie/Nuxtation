export default defineNuxtPlugin((nuxtApp) => {
  // カスタムスクロールビヘイビアを設定
  nuxtApp.hook('vue:setup', () => {
    const router = useRouter();
    router.options.scrollBehavior = async (to, from, savedPosition) => {
      // ハッシュリンク: DOMの準備を待ってからスクロール
      if (to.hash) {
        if (!from || to.path !== from.path) {
          // 別ページへのハッシュ遷移: nextTickで描画完了を待つ
          await nextTick();
        }
        return { el: to.hash, top: 60, behavior: 'smooth' };
      }

      // 戻る/進むボタン: 保存位置に復元
      if (savedPosition) {
        return { ...savedPosition, behavior: 'smooth' };
      }

      // 通常遷移: ページ先頭へ
      return { top: 0, behavior: 'smooth' };
    }
  });
})
