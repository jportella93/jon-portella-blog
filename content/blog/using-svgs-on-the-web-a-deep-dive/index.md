---
title: Using SVGs on the Web — A Deep Dive
spoiler: >-
  There isn’t one best way to implement SVGs on our websites, since each method
  has its pros and cons. Let’s learn their differences.
date: '2021-04-28T15:13:21.156Z'
hasNewsletterBeenSent: true
---

### Using SVGs on the Web — A Deep Dive

#### There isn’t one best way to implement SVGs on our websites, since each method has its pros and cons. Learning their differences is a crucial skill for a good Web Developer.

![Presentation image](./images/0.png)

**Scalable Vector Graphics (SVG)** allow you to present pictures that are lightweight and can scale without being pixelated.

However, we can implement them in several ways in our websites, and some methods allow for some features that others don’t.

---

### Implementation-dependent SVG Features

Here’s a list of features that you can have or not depending on how you serve your SVGs.

#### Alt and title attribute availability

`alt` attribute sets a text description rendered when the image is not available, whereas a `title` attribute is usually shown in a tooltip when hovering the image. These are used for accessibility and SEO.

#### Browser caching

Results in faster load times and, hence, better UX and SEO rankings.

#### Interactivity

SVGs can be manipulated and animated with CSS and JavaScript. They can also include hyperlinks wrapping their shapes.

#### Search engine indexing

Important point since [Google announced that they’ll start crawling and indexing SVGs](https://developers.google.com/search/blog/2010/08/google-now-indexes-svg).

#### Encapsulation

SVGs can contain classes and IDs, which should not clash with these attributes on other SVGs on the page.

---

### SVG implementation methods

Now that we know which features we may have or not depending on how we embed our SVGs, let’s compare these embedding methods.

They can be divided into two groups by methodology:

1. **Methods related to pointing the browser to the URL of the SVG file**. These generally can benefit from browser caching but have limited options for interactivity.
2. **Methods related to hardcoding the SVG inside a static asset such as HTML, CSS, or JS file**. These can't be cached separately as they are embedded in the file, but for this reason, we save HTTP requests, which is interesting since browsers not using HTTP2 can only do a limited number of concurrent requests. Also, they are best for reacting to user interaction.

### 1. SVG implementation methods related to pointing the browser to the URL of the SVG file.

### 1.1 As an  src

#### Features

- ✅ Alt/title attribute
- ✅ Browser caching
- ❌ Interactivity
- ✅ Search engine indexing
- ✅ Encapsulation

#### Also, note

- If width/height is not specified as an attribute or CSS rule, the original SVG file size is used.
- They are encapsulated, so their IDs and classes don’t clash with other SVGs.

#### When to use

- When interactivity is not an issue, for example, if your SVG is not animated on user input.

```html
<img src="user.svg" alt="User" />
```

### 1.2. As a CSS background-image

#### Features

- ✅ Alt/title attribute
- ✅ Browser caching
- ❌ Interactivity
- ✅ Search engine indexing
- ✅ Encapsulation

#### Also, note

- Same as method 1.1 but this time we can use any HTML tag instead of an `img` .

#### When to use

- When interactivity is not an issue.
- When you can't use an `img` tag.
- When you prefer to keep the SVG URL in your CSS file rather than in your HTML file.

```css
.user-svg {
  background-image: url(user.svg);
}
```

### 1.3 As an  data

#### Features

- ❌ Alt/title attribute
- ✅ Browser caching
- 🟡 Interactivity
- ❌ Search engine indexing
- ✅ Encapsulation

#### Also, note

- It’s somewhat interactive since it allows setting hyperlinks on parts of the SVG. However, it can’t be modified with JS or CSS.
- Y[ou can have problems with setting a tabindex attribute](https://wet-boew.github.io/wet-boew-documentation/decision/1.html).

#### When to use

- When you need hyperlinks in parts of the SVG.

```html
<object data="user.svg" width="300" height="300"></object>
```

### 1.4 & 1.5 As an or an  src

These last two methods were used in the past but nowadays their usage has decreased. They are generally not recommended for use.

SVGs used as `iframe` src have raised concerns about hurting SEO. Moreover, using this method we lose the scalability property of the SVG.

And SVGs used as `embed` src were primarily focused on browser plugins like Flash, which most browsers have stopped supporting.

```html
<iframe src="user.svg"></iframe>
```

```html
<embed src="user.svg" />
```

### 2. SVG implementation methods related to hardcoding the SVG code inside a static asset such as HTML, CSS, or JS file.

### 2.1 Inline SVG in HTML

Basically writing the whole SVG code into the HTML document. This is what some popular SVG libraries like d3 do.

#### Features

- ❌ Alt/title attribute
- ❌ Browser caching
- ✅ Interactivity
- ❌ Search engine indexing
- ❌ Encapsulation

#### Also, note

- SVGs implemented this way can be fully manipulated with CSS and JS since their internal tags are treated as DOM nodes.
- Since the SVG code is embedded in the HTML, we save an HTTP request for the asset, although now the HTML file is heavier.

#### When to use

When you need to animate properties on any tag inside the SVG such as color/fill, opacity, and movement.

```html
<body>
  <svg viewBox="-42 0 512 512.002" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"
    />
    <path
      d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"
    />
  </svg>
</body>
```

### 2.2 As data-uri

Similar to 1.1 and 1.2 but in this case instead of pointing the src property of the image or the CSS URL to an external asset, you just put the SVG code there as value.

```html
<img
  src="data:image/svg+xml,%3Csvg viewBox='-42 0 512 512.002' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0' /%3E%3Cpath d='m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0' /%3E%3C/svg%3E"
/>
```

or

```css
.user {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='-42 0 512
512.002' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m210.351562
246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906
23.972656-23.972656 36.125-53.304687 36.125-87.191406
0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718
0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0
33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125
36.125 87.1875 36.125zm0 0' /%3E%3Cpath d='m426.128906
393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563
0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906
13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219
3.542968-22.066406 5.339844-33.039063 5.339844-10.972656
0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125
0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906
10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625
26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219
10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031
22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438
30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094
38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375
65.0625-23.734375 16.757813-15.945312 25.253906-37.585937
25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0'
/%3E%3C/svg%3E");
}
```

#### Features

- ✅ Alt/title attribute
- ✅ Browser caching
- ❌ Interactivity
- ✅Search engine indexing
- ✅ Encapsulation

#### Also, note

- The SVG can be encoded in any shape that the browser understands. In the example, it’s [URL encoded](https://yoksel.github.io/url-encoder/), but it can also be base 64 encoded, for example.
- Since the SVG code is embedded in the HTML/CSS, we save an HTTP request for the asset, although now the HTML/CSS file is heavier.

#### When to use

When the SVG doesn’t need interactivity and is light enough that we rather embed it in our HTML file than do an HTTP request for it.

### Conclusion

There isn’t a one-size-fits-all approach when it comes to implementing SVGs on the web, it depends on which features you are looking for.

Thanks for reading and never stop learning! 😄

### Resources I’ve used to research this article

- [Working with SVG in HTML5–20 | HTML5 & CSS3 Fundamentals: Development for Absolute Beginners](https://channel9.msdn.com/Series/HTML5-CSS3-Fundamentals-Development-for-Absolute-Beginners/Working-with-SVG-in-HTML5-20) — MSDN

- [How to Use SVG Images in CSS and HTML — A Tutorial for Beginners](https://www.freecodecamp.org/news/use-svg-images-in-css-html/) — FreeCodeCamp

- [09: SVG with Data URIs](https://css-tricks.com/lodge/svg/09-svg-data-uris/) — CSS Tricks

- [Displaying SVG in Web Browsers](http://tutorials.jenkov.com/svg/displaying-svg-in-web-browsers.html) — Jenkov

- [A Practical Guide to SVGs on the web](https://svgontheweb.com/) — SVG on the Web

- [Adding vector graphics to the Web — Learn web development](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Adding_vector_graphics_to_the_Web) — MDN

- [The Best Way to Embed SVG on HTML (2021)](https://vecta.io/blog/best-way-to-embed-svg) — Vecta
