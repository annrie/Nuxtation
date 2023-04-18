import { ContentDoc } from './.nuxt/components.d';
import type { ParsedContent, MarkdownParsedContent } from '@nuxt/content/dist/runtime/types';
export type Sections = 'blog' | 'friends' | 'genre'

// let config = useRuntimeConfig()
// let content = config.pulblic.content

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
  _path?: string
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
