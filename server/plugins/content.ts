import { visit } from 'unist-util-visit'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    // @ts-expect-error `content:file:afterParse` は Nitro のランタイムフック名の型に無い(1 件だけを覆う)。
    'content:file:afterParse',
    // @ts-expect-error 上のフック名が型に無いため、引数 `file` の型が決まらず implicit any になる(1 件だけを覆う)。
    (file) => {
      if (file._id.endsWith('.md')) {
        visit(file.body, (n: any) => n.tag === 'img', (node) => {
          file.coverImage = node.props.src
        })
      }
    },
  )
})
