---
title: 'My Second Blog Post'
description: 'Learning how to use @nuxt/content to create a blog'
publishedAt: '2022-12-30'
img: 'img/cld-sample-2.jpg'
alt: 'my second blog post'
author:
  name: Maria
  bio: 'All about Maria and where she works and what she does'
  photo: 'img/friends/maria.jpeg'
tags: [ nuxtjs ]
---

## Welcome to my second blog post using content module

## This is a heading

This is some more info
<div class="bg-blue-500 text-white padding-1 margin-bottom-1">
  This is HTML inside markdown that has a class some classes
</div>

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
