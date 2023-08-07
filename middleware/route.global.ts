export default defineNuxtRouteMiddleware(async(to, from) => {
    if (to.path !== from.path && process.client) {
      window.scrollTo(0, 0)
    }
})
