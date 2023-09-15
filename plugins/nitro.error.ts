export default defineNuxtPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    console.log('on request', event.path)
  })

  nitroApp.hooks.hook('beforeResponse', (event, { body }) => {
    console.log('on response', event.path, { body })
  })

  nitroApp.hooks.hook('afterResponse', (event, { body }) => {
    console.log('on after response', event.path, { body })
  })
})
