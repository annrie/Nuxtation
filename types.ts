import { ContentDoc } from './.nuxt/components.d';
import type { ParsedContent as DefaultParsedContent, MarkdownParsedContent } from '@nuxt/content/dist/runtime/types';
import type { VitePWAOptions } from 'vite-plugin-pwa'
import { type Ref, type UnwrapNestedRefs } from 'vue'
import type { StorageMeta } from 'unstorage'


export interface ParsedContent extends DefaultParsedContent {
  storageMeta: StorageMeta
  prose?: boolean
  schemaOrg: Record<string, any>
}

export type Sections = 'blog' | 'friends' | 'catResponse'

export interface BlogPost extends MarkdownParsedContent {
  title: string,
  publishedAt: string,
  description: string,
  url?: string,
  img: string,
  alt: string,
  ogImage?: string,
  provider?: string,
  tags: string[],
  published?: boolean,
  author?:  {
    name?: string,
    bio?: string,
    photo?: string,
  }
}
export interface FriendsPost extends MarkdownParsedContent {
  title: string,
  publishedAt: string,
  description: string,
  url?: string,
  img: string,
  alt: string,
  ogImage?: string,
  provider?: string,
  tags: string[],
  published?: boolean,
  author?:  {
    name?: string,
    bio?: string,
    photo?: string,
    image?: string,
  }
}
export interface PostGenre extends MarkdownParsedContent {
  name: string,
  description: string,
  img: string,
  alt?: string,
}
export interface CatResponse {
  id: string;
  url: string;
  width: number;
  height: number;
}

export type BlogPostPreview = Omit<BlogPost, 'body'>;
export type FriendsPostPreview = Omit<FriendsPost, 'body'>;

export interface PrevNext {
  title?: string,
  _path?: string,
}

export interface Navigation {
  url: string,
  link: string
}

export interface TwitterWindow extends Window {
  twttr: any
  widgets: any
}
declare const window: TwitterWindow

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

// TODO: fix this issue upstream in nuxt/module-builder
declare module '#app' {
  interface NuxtApp {
    $pwa: UnwrapNestedRefs<PwaInjection>
  }
}

export interface ClientOptions {
  /**
   * Exposes the plugin: defaults to true.
   */
  registerPlugin?: boolean
  /**
   * Registers a periodic sync for updates interval: value in seconds.
   */
  periodicSyncForUpdates?: number
  /**
   * Will prevent showing native PWA install prompt: defaults to false.
   *
   * When set to true or no empty string, the native PWA install prompt will be prevented.
   *
   * When set to a string, it will be used as the key in `localStorage` to prevent show the PWA install prompt widget.
   *
   * When set to true, the key used will be `vite-pwa:hide-install`.
   */
  installPrompt?: boolean | string
}

export interface ModuleOptions extends Partial<VitePWAOptions> {
  registerWebManifestInRouteRules?: boolean
  /**
   * Writes the plugin to disk: defaults to false (debug).
   */
  writePlugin?: boolean
  /**
   * Options for plugin.
   */
  client?: ClientOptions
}
import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk";
import { Category } from ".";

export type Blog = {
  title?: string;
  content?: string;
  eyecatch?: MicroCMSImage;
  category: (MicroCMSListContent & Category) | null;
};
export type Category = {
  name?: string;
};
