// hashscroll.js
export default defineNuxtRouteMiddleware((to) => {
  if (process.client && to.hash) {
    const hash = to.hash.substring(1);

    // DOMが利用可能になるのを待つための関数
    const waitForDOM = (callback) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    };

    const handleScroll = () => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`Element with ID "${hash}" not found.`);
      }
    };

    // DOMが利用可能になったらスクロール処理を実行
    waitForDOM(() => {
      // nextTickを使用してレンダリング後に実行
      nextTick(() => {
          // NuxtLinkの遷移完了を待機する
          setTimeout(handleScroll, 0);
      });
    });
  }
});