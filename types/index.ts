import type { ParsedContentv2 as DefaultParsedContent } from '@nuxt/content'
import type { Ref } from 'vue'

// 以下の型は、直接の依存ではない `unstorage` / `microcms-js-sdk` から型だけを借りていた。
// pnpm の厳密な node_modules からは解決できず、型エラーになるため、同じ形をここで定義する。
interface StorageMeta {
  atime?: Date
  mtime?: Date
  ttl?: number
  [key: string]: unknown
}

interface MicroCMSImage {
  url: string
  height?: number
  width?: number
}

interface MicroCMSListContent {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  revisedAt?: string
}

export interface ParsedContent extends DefaultParsedContent {
  storageMeta: StorageMeta
  prose?: boolean
  schemaOrg: Record<string, any>
}

export type Sections = 'blog' | 'catResponse'

// `@nuxt/content` v3 に `MarkdownParsedContent` は無く、v2 相当の `ParsedContentv2` を土台にする。
export interface BlogPost extends DefaultParsedContent {
  title: string
  publishedAt: string
  description: string
  url?: string
  img: string
  alt: string
  ogImage?: string
  provider?: string
  tags: string[]
  published?: boolean
  updatedAt?: string
  path?: string
  draft?: boolean
  featured?: boolean
}

// カード表示 (HomeCard / HomeFeaturedArticle / BlogCardHorizontal ほか) が参照する項目。
// 記事コレクションの項目から本文を除いた形で渡されるため、すべて任意にしている。
export interface ContentPreview {
  title?: string
  description?: string
  path?: string
  url?: string
  img?: string
  alt?: string
  tags?: string[]
  publishedAt?: string
  updatedAt?: string
  draft?: boolean
  featured?: boolean
}

export interface CatResponse {
  id: string
  url: string
  width: number
  height: number
}

export type BlogPostPreview = BlogPost

export interface PrevNext {
  title?: string
  path?: string
}

export interface Navigation {
  url: string
  link: string
}

declare global {
  interface Window {
    twttr?: any
    widgets?: any
  }
}

export type TwitterWindow = Window & typeof globalThis

export interface PwaInjection {
  isInstalled: boolean
  showInstallPrompt: Ref<boolean>
  cancelInstall: () => void
  install: () => Promise<void>
  swActivated: Ref<boolean>
  registrationError: Ref<boolean>
  offlineReady: Ref<boolean>
  needRefresh: Ref<boolean>
  updateServiceWorker: (reloadPage?: boolean | undefined) => Promise<void>
  cancelPrompt: () => Promise<void>
  getSWRegistration: () => ServiceWorkerRegistration | undefined
}

// `NuxtApp['$pwa']` の宣言は @vite-pwa/nuxt 自身が持っている。ここでも宣言すると
// 型が食い違って TS2687 / TS2717 になるため、重複していた宣言は削除した。

// `vite-plugin-pwa` も直接の依存ではないため、同じ形の型を持つ @vite-pwa/nuxt から再エクスポートする。
export type { ClientOptions, ModuleOptions } from '@vite-pwa/nuxt'

export interface Blog {
  title?: string
  content?: string
  eyecatch?: MicroCMSImage
  category: (MicroCMSListContent & Category) | null
}
export interface Category {
  name?: string
}
