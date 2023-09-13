import type { RouterConfig } from '@nuxt/schema'
import { createMemoryHistory } from 'vue-router'

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig> {
  history: base => process.client ? createMemoryHistory(base) : null /* default */
}
function scrollBehavior(to, from, savedPosition) {
  // `to` and `from` are both route locations
  // `savedPosition` can be null if there isn't one
    if (to.path !== from.path && process.client) {
      window.scrollTo(0, 0)
    }
  }
