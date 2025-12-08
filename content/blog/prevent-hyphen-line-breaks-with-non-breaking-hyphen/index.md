---
title: Prevent Hyphen Line-Breaks with Non-Breaking Hyphen
spoiler: Learn how to avoid hyphen line-breaks, in one minute.
date: "2021-03-18T14:27:15.879Z"
---

#### Learn to dominate your hyphens and control where your content line breaks

![Presentation image](./images/0.png)

---

#### THE PROBLEM

Let’s say our company is called Astro-Team, or whatever name with a hyphen.

On our website, the company name gets divided into multiple lines when nearing the end of the line, since [its hyphen is considered by the browser as a line break opportunity](https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens#suggesting_line_break_opportunities).

Hyphen-Minus being used as line-break.

#### A SOLUTION

You could go and wrap every occurrence of the company name with a `` , and that would fix it.

#### ANOTHER (CLEANER) SOLUTION

Replace the [Hyphen-Minus symbol](https://en.wikipedia.org/wiki/Hyphen-minus) `-`, which is the one most commonly found on keyboards, with a [Non-Breaking Hyphen](https://unicode-table.com/en/2011/) `‑` , which looks the same but will avoid line breaks.

Here’s a demo:

Non-Breaking Hyphen vs Hyphen-Minus line break.

---
