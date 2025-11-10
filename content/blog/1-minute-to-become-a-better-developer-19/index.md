---
title: 1 Minute To Become A Better Developer (#19)
spoiler: Learn how to use RegEx Lazy Quantifier, in one minute.
date: 2021-03-19T13:26:48.884Z
---

#### Save refactor time with one character — Regular expressions on JavaScript or any other language made easier

![](images/0.png)

Art by my buddy [Loor Nicolas](https://www.instagram.com/loornicolas/)

---

#### THE PROBLEM

We have a block of HTML code, including a set of images.

All of them have an alt tag, but **we want to add a full stop to every tag**, to make screen readers pause for a bit when reading the tag.

![](images/1.png)

A set of images with alt tags without full stops.

We could just capture everything between `“”`. However, that would also target the `src` tag of the first image, since, **by default, RegEx quantifiers aregreedy**, so we are capturing until the last occurrence of `“` in the line.

![](images/2.png)

We wrongly target the src tag of the first image.

How can we do it?

#### A SOLUTION

We are going to use a **RegEx Lazy (or Non-Greedy) Quantifier **to match only the alt tags and add them back with a full stop.

We only need to add a `?` after the quantifier.

![](images/3.png)

Lazy Quantifier allows us to only target the alt tag.

Here’s a demo on CodePen. Also [here’s a demo on RegExr.](https://regexr.com/5ov22)

---

