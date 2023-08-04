---
title: 'My Third Blog Post'
description: 'Learning how to use @nuxt/content to create a blog'
publishedAt: '2022-12-30'
img: 'cld-sample.jpg'
alt: 'my third blog post'
author:
  name: Alexandra
  bio: 'All about Alexandra and where she works and what she does'
  photo: 'friends/alexandra.jpeg'
tags: [ javascript, web development ]
genres:
 - 時代・伝奇
---
## Welcome to my third blog post using content module

## This is a heading

This is some more info
<div class="bg-blue-500 text-white padding-1 margin-bottom-1">
  This is HTML inside markdown that has a class some classes
</div>

::InfoBox{type="error"}
    This is a vue component inside markdown using slots

#details
This will be rendered inside the `description` slot. _It's important_ to see how this **works**.
[More information can be found here](#)
::

```js[nuxt.config.js]
export default {
  nuxt: "is the best"
}
```

```html[my-first-blog-post.md]
<p>code styling is easy</p>
```

### This is a sub heading

This is some more info

### This is another sub heading

This is some more info

## This is another heading

This is some more info
