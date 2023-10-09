import type { MicroCMSImage, MicroCMSListContent } from "nuxt-microcms-module";
import { Category } from "~/category";

export type Blog = {
  title?: string;
  content?: string;
  eyecatch?: MicroCMSImage;
  category: (MicroCMSListContent & Category) | null;
};
