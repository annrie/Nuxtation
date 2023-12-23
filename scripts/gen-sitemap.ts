import type { Nitro } from "nitropack";
import { SitemapStream, streamToPromise, SitemapItem } from 'sitemap';
import { Readable } from 'stream';
import { writeFileSync } from 'fs';
import path from 'path';

// サイトドメインを指定（最後スラッシュ不要）
const domain = "https://nuxtation.vercel.app";

export default async function genSitemap(nitro: Nitro) {
    if (!nitro._prerenderedRoutes) {
        return;
    }

    const publicDir = nitro.options.output.publicDir;

    const routes = nitro._prerenderedRoutes?.map((e) => e.fileName || null).filter((e, i, a) => e && a.indexOf(e) === i && e.endsWith("index.html")).map((e) => {
        return {
            url: e?.replace(/index\.html$/, ''),

	    // この辺の値は各自調整して下さい
            changefreq: 'weekly',
            priority: .7,
        } as SitemapItem;
    });
    const smStream = new SitemapStream({ hostname: domain });
    Readable.from(routes).pipe(smStream);

    const data = await streamToPromise(smStream);

    writeFileSync(path.join(publicDir, 'sitemap.xml'), data.toString());
}
