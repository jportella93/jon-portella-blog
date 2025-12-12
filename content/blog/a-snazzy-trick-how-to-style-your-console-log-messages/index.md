---
title: "A Snazzy Trick: How To Style Your console.log() Messages"
spoiler: >-
  A quick guide (with examples) on applying CSS to log messages in the browser’s
  console
date: "2021-03-25T13:59:01.112Z"
hasNewsletterBeenSent: true
---

![Presentational content](https://j-img.jonportella.com/assets/1*zONROaYj-u969muwWhn19w.jpg)

#### A quick guide (with examples) on applying CSS to log messages in the browser's console.

```javascript
// Styling console.log messages with CSS
console.log("%cHello World!", "color: blue; font-size: 20px;");
```

#### THE PROBLEM

Our console messages don't grab users' attention.

![Basic console message](https://j-img.jonportella.com/assets/1*ttB5wT2hI0E7Mp0B97tHhw.png)

A basic console.log message.

How can we make them more engaging?

#### A SOLUTION

By including a `%c` in `console.log`'s first argument, and passing some CSS declarations as the second argument, we can style the message on the browser's console.

![style console message](https://j-img.jonportella.com/assets/1*JXXHnnpj2mEYgLVL2O5fCw.png)

A styled console log message! 🌈

#### Here are some ideas

![color console message](https://j-img.jonportella.com/assets/1*AQXEKkI8SIR931MdJxo6iQ.png)

Change color in your browser's console.

![font family console message](https://j-img.jonportella.com/assets/1*dzMwWlZkyBjr3yr_BdWJpg.png)

Change font-family and font-size in your browser's console.

![several styles](https://j-img.jonportella.com/assets/1*fMwfR-WG818lNokxIZK41g.png)

Apply several styles to the same string.

![reuse styles](https://j-img.jonportella.com/assets/1*YkpD6kG1nEqHZaZfd6vGlQ.png)

Reuse console.log styles.

Many websites use this trick to grab the curious developers' attention or to prevent non-technical users to run code on the console. Some of them are Facebook, Pinterest, and Gmail.

Thanks for reading! Take care, _Jon Portella._
