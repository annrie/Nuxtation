---
title: 'My First Blog Post'
description: 'Learning how to use @nuxt/content to create a blog'
publishedAt: '2022-12-30'
img: 'kitchen-bar.jpg'
alt: 'my first blog post'
author:
  name: Peter
  bio: 'All about Peter and what he does and where he works'
  photo: 'friends/peter.jpeg'
tags: [ nuxtjs, javascript ]
genres:
 - SF
 - 短編集
---

Welcome to my first blog post using content module

## This is a heading

This is some more info
<p  class="bg-blue-500 text-dark padding-1 margin-bottom-2 dark:(text-white)">
  This is HTML inside markdown that has a class some classes
</p>

::InfoBox{type="warning"}
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
