import type { MicroCMSImage, MicroCMSListContent } from 'nuxt-microcms-module'
import type { Category } from '~/category'

export interface Blog {
  title?: string
  content?: string
  eyecatch?: MicroCMSImage
  category: (MicroCMSListContent & Category) | null
}
