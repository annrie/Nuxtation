import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { defineRobotsSchema } from '@nuxtjs/robots/content'

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
      source: "**/*.md",
      type: "page",
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
        featured: z.boolean()
      }),
    }),
  },
});
