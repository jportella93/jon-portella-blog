---
title: Prevent Hyphen Line-Breaks with Non-Breaking Hyphen
spoiler: "Learn how to avoid hyphen line-breaks, in one minute."
date: "2021-03-18T14:27:15.879Z"
hasNewsletterBeenSent: true
---

#### Learn to dominate your hyphens and control where your content line breaks

![Presentation image](https://j-img.jonportella.com/assets/1*WaFLh55x64tmvL1-Xr8srg.jpg)

---

#### THE PROBLEM

Let’s say our company is called Astro-Team, or whatever name with a hyphen.

On our website, the company name gets divided into multiple lines when nearing the end of the line, since [its hyphen is considered by the browser as a line break opportunity](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens#suggesting_line_break_opportunities).

[See the problem: Hyphen-Minus being used as line-break.](https://codepen.io/jportella93/pen/MWbMaBB)

#### A SOLUTION

You could go and wrap every occurrence of the company name with a `<span style="white-space: nowrap;"></span>`, and that would fix it.

#### ANOTHER (CLEANER) SOLUTION

Replace the [Hyphen-Minus symbol](https://en.wikipedia.org/wiki/Hyphen-minus) `-`, which is the one most commonly found on keyboards, with a [Non-Breaking Hyphen](https://unicode-table.com/en/2011/) `‑` , which looks the same but will avoid line breaks.

Here’s a [demo](https://codepen.io/jportella93/pen/KKNjdYe)
