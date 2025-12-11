---
title: The One Thing You Need to Know To Avoid CSS Overflow
spoiler: >-
  Learn how to prevent CSS overflow with variable-length text using a simple
  wrapper component that keeps text on one line.
date: '2021-03-25T12:55:11.037Z'
hasNewsletterBeenSent: true
---

# The One Thing You Need To Know To Avoid CSS Multiline Wrapping

## 10 lines of code to make your text always span one line, and save you from countless headaches

## THE PROBLEM

So imagine you have a component that shows some user information like name, surname, and e-mail. The design shows a nice layout where all lines take the same space.

Easy enough, you implement the design and release it into the wild. But then you realize that this UI can break with a person with a longer name.

That’s because the data being shown has **variable length** and you should account for all the cases where it will be used. [Here is a demo with the example.](https://www.jonportella.com/displaying-data-with-variable-length-example#example-1)

There will be users with super long names, e-mail addresses, and what not and this shouldn’t break your UI.

## THE SOLUTION

One approach to prevent this would be to create a wrapper component for variable length text which is expected to be shown in a single line. All overflowing text can be scrolled to the side if needed.

### _OneLineScroller.jsx_

Wrapping your text fields with this component makes them span exactly one line. [Check example #2 with the OneLineScroller](https://www.jonportella.com/displaying-data-with-variable-length-example#example-2).

Thanks for reading! Take care, _Jon Portella_.
