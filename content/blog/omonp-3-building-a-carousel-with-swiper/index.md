---
title: Building a carousel with Swiper
spoiler: >-
  Let’s build a touch-triggered image slider with lazy loading, navigation, and
  pagination, in one minute.
date: '2021-04-06T01:28:57.384Z'
hasNewsletterBeenSent: true
---

![Presentation image](./images/0.png)

#### Let’s build a touch-triggered image slider with lazy loading, navigation, and pagination, in one minute.

![Presentation image](./images/1.png)

[What we will build](https://codepen.io/jportella93/pen/PoWjaaG)

---

#### THE PROBLEM

We want to implement the classic image carousel present all over the Internet.

Although it seems a pretty easy task to implement ourselves, there are a number of small features and edge cases that actually make the task not so trivial, such as image lazy-loading, looping, and pagination.

#### A SOLUTION

We are going to use a nice little package called [Swiper](https://www.npmjs.com/package/swiper) to implement our carousel quickly.

#### 1. Import Swiper’s JavaScript and CSS

#### 2. Add the layout for Swiper, where basic elements should carry specific class names

- `swiper-container` is the main slider container
- `swiper-wrapper` is an additional required wrapper
- `swiper-slide` is the wrapper for every slide
- Optional `swiper-pagination` is the row of dots on the bottom, each one representing a slide, that can trigger navigation to that specific slide. Also, they have different styling for the currently active slide
- Optional `swiper-button-prev` and `swiper-button-next` which are the arrows on both sides of the slide

Also, for lazy-loading:

- Add a class of `swiper-lazy` to images inside `swiper-slide`
- Add a placeholder of `swiper-lazy-preloader` to show if the image hasn’t been loaded yet
- Image attribute `src` should be replaced by `data-src` to avoid default loading behavior

#### 3. Initialize Swiper on our script file

- `loop` makes the last slide go back to the first one and vice-versa
- `lazy.loadPrevNext` pre-loads the next image to avoid showing a loading placeholder if possible
- `pagination` and `navigation` sets the configuration for these elements

#### 4. Putting it all together

Here’s a quick demo on CodePen. You can check the network tab on the browser’s DevTools and you’ll see image requests being done on-demand as you swipe!

Lazy-loading image swiper with navigation and pagination

---

```html
<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
```

```html
<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <!-- Required swiper-lazy class and image source specified in data-src attribute -->
      <img data-src="https://picsum.photos/id/81/200" class="swiper-lazy" />
      <!-- Preloader image -->
      <div class="swiper-lazy-preloader"></div>
    </div>
    <div class="swiper-slide">
      <img data-src="https://picsum.photos/id/82/200" class="swiper-lazy" />
      <div class="swiper-lazy-preloader"></div>
    </div>
    <div class="swiper-slide">
      <img data-src="https://picsum.photos/id/83/200" class="swiper-lazy" />
      <div class="swiper-lazy-preloader"></div>
    </div>
    <div class="swiper-slide">
      <img data-src="https://picsum.photos/id/84/200" class="swiper-lazy" />
      <div class="swiper-lazy-preloader"></div>
    </div>
    <div class="swiper-slide">
      <img data-src="https://picsum.photos/id/95/200" class="swiper-lazy" />
      <div class="swiper-lazy-preloader"></div>
    </div>
  </div>
  <!-- Add Pagination -->
  <div class="swiper-pagination"></div>
  <!-- Navigation -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

<!-- Swiper imports -->
<link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
<script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
```

```javascript
const swiper = new Swiper(".swiper-container", {
  loop: true,
  lazy: {
    loadPrevNext: true,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
```
