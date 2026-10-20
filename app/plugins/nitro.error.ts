// Nitro のフック名で登録しているが、渡されるのは Nuxt アプリの hooks で、これらの名前は Nuxt 側には存在しない。
// 型は Nuxt のフック名と合わないため、挙動を変えずに型だけ Nitro 風に見立てている(実行時は一度も呼ばれない既存の不具合)。
interface NitroLikeHooks {
  hook: (
    name: 'request' | 'beforeResponse' | 'afterResponse',
    callback: (event: { path: string }, response: { body?: unknown }) => void,
  ) => void
}

export default defineNuxtPlugin((nitroApp) => {
  (nitroApp.hooks as unknown as NitroLikeHooks).hook('request', (event) => {
    // eslint-disable-next-line no-console -- 既存のログ出力。挙動を変えないため残している
    console.log('on request', event.path)
  })

  ;(nitroApp.hooks as unknown as NitroLikeHooks).hook('beforeResponse', (event, { body }) => {
    // eslint-disable-next-line no-console -- 既存のログ出力。挙動を変えないため残している
    console.log('on response', event.path, { body })
  })

  ;(nitroApp.hooks as unknown as NitroLikeHooks).hook('afterResponse', (event, { body }) => {
    // eslint-disable-next-line no-console -- 既存のログ出力。挙動を変えないため残している
    console.log('on after response', event.path, { body })
  })
})
