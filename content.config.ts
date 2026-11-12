import { defineCollection, defineContentConfig } from '@nuxt/content'
import { defineRobotsSchema } from '@nuxtjs/robots/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        robots: defineRobotsSchema(),
        sitemap: defineSitemapSchema(),
      }),
    }),
    docs: defineCollection({
      source: '**/*.md',
      type: 'page',
    }),
    // Docus のサイトマップ用ハンドラー(docus/server/api/__sitemap__/urls.ts)は、landing コレクションを
    // 条件なしに問い合わせる。一方で Docus は app/pages/index.vue があると landing を定義しないので、
    // 問い合わせが /__nuxt_content/landing/query の 404 になり、プリレンダーのたびに request error を残していた。
    // Docus の定義と同じ形で置いて空振りを止める。上流の urls.ts が直ったら消してよい。
    landing: defineCollection({
      source: 'index.md',
      type: 'page',
    }),
    blog: defineCollection({
      source: 'blog/*.md',
      type: 'page',
      schema: z.object({
        draft: z.boolean(),
        title: z.string(),
        date: z.string(),
        publishedAt: z.date(),
        updatedAt: z.date(),
        description: z.string(),
        toc: z.union([z.string(), z.array(z.string())]),
        slug: z.string(),
        url: z.string().url(),
        img: z.string(),
        alt: z.string().optional(),
        ogImage: z.string().optional(),
        provider: z.string(),
        tags: z.array(z.string()),
        path: z.string(),
        featured: z.boolean(),
      }),
    }),
  },
})
