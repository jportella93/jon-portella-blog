---
title: Use RegEx Lazy Quantifier to Match Alt Tags
spoiler: "Learn how to use RegEx Lazy Quantifier, in one minute."
date: "2021-03-19T13:26:48.884Z"
hasNewsletterBeenSent: true
---

![image](https://j-img.jonportella.com/assets/0*vJjQxnMQZT6BvNJM.jpg)

#### Save refactor time with one character — Regular expressions on JavaScript or any other language made easier

#### THE PROBLEM

We have a block of HTML code, including a set of images.

All of them have an alt tag, but **we want to add a full stop to every tag**, to make screen readers pause for a bit when reading the tag.

![A set of images with alt tags without full stops.](https://j-img.jonportella.com/assets/1*Wp579vl4hpOYv0f9Vwdaww.png)

We could just capture everything between `""`. However, that would also target the `src` tag of the first image, since, **by default, RegEx quantifiers aregreedy**, so we are capturing until the last occurrence of `"` in the line.

![image](https://j-img.jonportella.com/assets/1*38Ssa6YgyXzLFF-sQEz1wg.png)

We wrongly target the src tag of the first image.

How can we do it?

#### A SOLUTION

We are going to use a **RegEx Lazy (or Non-Greedy) Quantifier **to match only the alt tags and add them back with a full stop.

We only need to add a `?` after the quantifier.

![image](https://j-img.jonportella.com/assets/1*0HxmtEx37f7c0hFVIxqL9w.png)

Lazy Quantifier allows us to only target the alt tag.

Here’s a [demo on CodePen](https://codepen.io/jportella93/pen/Rwozvxe). Also [here’s a demo on RegExr.](https://regexr.com/5ov22)
