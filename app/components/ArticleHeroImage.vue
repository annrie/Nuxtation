<script setup lang="ts">
const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  format?: string
  loading?: 'lazy' | 'eager'
  // 最初の画面の主役（LCP）になる画像にだけ 'high' を渡す。既定は付けない（ブラウザに任せる）
  fetchpriority?: 'high' | 'low' | 'auto'
  // LCP になる画像を <head> の <link rel="preload"> で先に読ませる（下の「preload」を参照）。fetchpriority も link に付く
  preload?: boolean
  modifiers?: Record<string, any>
  // 幅・高さ・品質はここで渡す（modifiers に書いても下の lifted で props に移す）。
  // modifiers の w / h / q は @nuxt/image から見ると素のキーで、srcset の幅（w）と全体の quality（q=80）が後ろに重なって上書きされる。
  // width と height を渡すと、srcset のどの幅でもこの縦横比で切り抜き、<img> に width / height が付いて読み込み前の高さも決まる
  width?: number
  height?: number
  quality?: number
  // 表示幅（@nuxt/image の sizes の書式）。省略すると画面幅いっぱいとみなし、小さく表示する画像でも大きい画像を選んでしまう
  sizes?: string
  imgClass?: string
  overlayClass?: string
  absolute?: boolean
  aspectRatio?: string | number // '16/9', '4/3', '1/1', 2.35, etc.
  noOverlay?: boolean // オーバーレイを無効化
  isDark?: boolean // ダークモード状態（親から渡される）
}>(), {
  isDark: false,
})

// アスペクト比をCSSで使用可能な形式に変換
const aspectRatioStyle = computed(() => {
  if (!props.aspectRatio)
    return undefined

  // 数値の場合はそのまま使用
  if (typeof props.aspectRatio === 'number') {
    return props.aspectRatio.toString()
  }

  // 文字列の場合（'16/9'など）もそのまま使用
  return props.aspectRatio
})

// modifiers に書いた q / quality / fit / w / h / width / height は、@nuxt/image の useImageProps が
// props の値（未指定なら undefined や全体の quality: 80）で上書きするか、srcset の値と重なるので効かない。
// 呼び出し側に書かれても効くよう、props に移す（props に直接渡した値が優先）
const lifted = computed(() => {
  const { q, quality, fit, w, h, width, height, ...modifiers } = props.modifiers ?? {}
  const toNumber = (value: unknown) => (value === undefined || value === '' ? undefined : Number(value))
  return {
    modifiers,
    quality: props.quality ?? toNumber(quality ?? q),
    width: props.width ?? toNumber(width ?? w),
    height: props.height ?? toNumber(height ?? h),
    fit: typeof fit === 'string' ? fit : undefined,
  }
})

// 記事の frontmatter の img は imgix のパラメータ（文字入れ）を含むことがある。そのまま渡すと @nuxt/image が後ろに
// `?` をもう一つ付けて値が壊れる（w / h / q も後ろの値と重なる）。パスとパラメータを分け（splitImgixSource）、
// パラメータは modifiers に混ぜて 1 つの `?` にまとめる
const source = computed(() => {
  const { path, params } = splitImgixSource(props.src ?? '')
  if (!Object.keys(params).length)
    return { path, modifiers: lifted.value.modifiers }
  const scale = markScale(params.mark64)
  const extra = scale && !('mark-scale' in params) ? { 'mark-scale': scale } : {}
  return { path, modifiers: { ...params, ...extra, ...lifted.value.modifiers } }
})

// preload: NuxtPicture にも preload はあるが、次の 2 点が困るので使わず、ここで <link rel="preload" as="image"> を出す。
// - 位置: unhead の既定の並び（capo）では style が 60（@import を含むと 40）・preload が 70 なので、Nuxt がインラインにした
//   約 300KB の CSS のあとに来て、画像のリクエストがほとんど早まらない。tagPriority を 35 にして CSS より前に出す
//   （importmap の 25 よりは後ろ）
// - type: 付かないので、AVIF に対応しないブラウザも AVIF を読み、そのあと <picture> が WebP を別に読む
// srcset と sizes は、NuxtPicture が最初の <source> に使うのと同じ引数で作る（@nuxt/image の useImageProps と NuxtPicture の
// sources を参照）。食い違うと二重に読むので、生成した HTML で一致を確かめている（scripts/check-lcp-preload.ts。PR と main への push の CI で走る。Vercel のデプロイを止めはしない）
if (import.meta.server && props.preload && props.src) {
  const format = firstPictureFormat(props.format || 'avif,webp', source.value.path)
  if (format) {
    const $img = useImage()
    const { srcset, sizes } = $img.getSizes(source.value.path, {
      sizes: props.sizes || $img.options.screens,
      modifiers: {
        ...source.value.modifiers,
        width: lifted.value.width,
        height: lifted.value.height,
        format,
        quality: lifted.value.quality || $img.options.quality,
        fit: lifted.value.fit,
      },
    })
    useHead({
      link: [{
        rel: 'preload',
        as: 'image',
        imagesrcset: srcset,
        imagesizes: sizes,
        // NuxtPicture の <source> と同じく、形式の名前をそのまま使う（jpg も読み替えない。読み替えると <source> と食い違う）
        type: `image/${format}`,
        fetchpriority: props.fetchpriority,
        tagPriority: 35,
      }],
    })
  }
}

// NuxtPicture の <source> の並びと同じ規則で、最初の <source> の形式を返す。旧形式（透過できる元画像なら png、それ以外は jpeg）は
// 最後に回るので、最初はそれ以外の先頭になる（形式が旧形式だけなら <source> は作られず、<img> の srcset と同じになる）。
// svg は srcset を作らないので preload もしない
function firstPictureFormat(format: string, path: string): string | undefined {
  const formats = format.split(',')
  if (formats[0] === 'svg')
    return undefined
  const original = path.match(/^[^?#]+\.(\w+)(?:$|[?#])/)?.[1]
  const legacy = !original || !['png', 'webp', 'gif', 'svg'].includes(original) ? 'jpeg' : 'png'
  return formats.find(f => f !== legacy) ?? legacy
}

// 文字入れ（mark64 の ~text 画像）の幅は px で決まっている（w=1000 など）ので、小さい画像ほど文字がはみ出して切れる。
// 元画像（幅 1280）に載せたときと同じ割合を mark-scale（出力の幅に対する %）で指定し、どの幅でも同じ見た目にする
const BASE_IMAGE_WIDTH = 1280
function markScale(mark64: string | number | undefined): number | undefined {
  if (typeof mark64 !== 'string')
    return undefined
  try {
    const url = atob(mark64.replace(/-/g, '+').replace(/_/g, '/'))
    const width = Number(new URL(url).searchParams.get('w'))
    return width > 0 ? Math.round(width / BASE_IMAGE_WIDTH * 100) : undefined
  }
  catch {
    // 読めない mark64 は、今までどおり何も足さない（文字入れ自体は imgix がそのまま描く）
    return undefined
  }
}
</script>

<template>
  <div
    v-if="src"
    class="article-hero-wrapper"
    :class="{ 'is-absolute': absolute }"
    :style="aspectRatioStyle ? { aspectRatio: aspectRatioStyle } : undefined"
  >
    <!-- fetchpriority は img-attrs で <img> に付ける。NuxtPicture に直接渡すと <picture> に付き、ブラウザに無視される -->
    <NuxtPicture
      :src="source.path"
      :alt="alt"
      :format="format || 'avif,webp'"
      :loading="loading || 'eager'"
      :width="lifted.width"
      :height="lifted.height"
      :quality="lifted.quality"
      :fit="lifted.fit"
      :sizes="sizes"
      :modifiers="source.modifiers"
      :img-attrs="{ class: imgClass || 'article-hero-image', fetchpriority }"
    />
    <div
      v-if="!noOverlay"
      :class="overlayClass || 'article-hero-overlay'"
    />
  </div>
</template>

<style>
.article-hero-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 0;
}

.article-hero-wrapper.is-absolute {
  position: absolute;
  top: 0;
  left: 0;
}

.article-hero-wrapper picture {
  display: block;
  width: 100%;
  height: 100%;
}

.article-hero-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.article-hero-wrapper.is-absolute picture {
  position: absolute;
  top: 0;
  left: 0;
}

.article-hero-wrapper.is-absolute img {
  position: absolute;
  top: 0;
  left: 0;
}

.article-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
  pointer-events: none;
  z-index: 2;
}

.dark .article-hero-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
}

.article-hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
