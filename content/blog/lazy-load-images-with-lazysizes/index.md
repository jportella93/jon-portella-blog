---
title: Lazy Load Images with LazySizes
spoiler: 'Learn how to lazy load images, in one minute.'
date: '2021-03-23T14:17:37.750Z'
hasNewsletterBeenSent: true
---

#### A quick introduction to a library that has better browser support than the loading="lazy" attribute.

![Presentation image](./images/0.png)

[What we will build](https://codepen.io/jportella93/pen/MWJYeLj)

---

#### THE PROBLEM

The images on our website load all at the same time, including the ones that are not in view, blocking other assets to be downloaded.

This makes our website take longer to load, and** has a bad effect on our UX**.

#### A SOLUTION

We are going to use a nice little package called [LazySizes](https://github.com/aFarkas/lazysizes) to make images load only when they are scrolled into view.

To do that we only need to:

1. Replace the `src` attribute on images with a `data-src` attribute, so the browser doesn’t download them automatically. Also, this allows LazySizes to take the image source in order to request it when scrolled into view.
2. Add a class of `lazyload` to the image, so LazySizes knows it has to act on that element.

Here’s a quick demo, scroll to make images appear. You can check the network tab on the browser’s DevTools and you’ll see image requests being done as you scroll!

SImple image lazyloading with LazySizes.

---
