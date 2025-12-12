---
title: Avoid Headaches with Static Code Analysis Tools
spoiler: "Learn to avoid headaches with Static Code Analysis Tools, in one minute."
date: "2021-03-16T13:44:11.170Z"
hasNewsletterBeenSent: true
---

#### Or how Static Code Analysis Tools make your life and prevent headaches

![Presentation image](https://j-img.jonportella.com/assets/1*m66XtihHfjzASkO0r8bh0Q.jpg)

---

#### THE PROBLEM

Take a moment to look at this snippet and try to figure out what it does.

Don’t scroll to the solution yet!

Really try to figure out the result, It’s not as easy as it seems…

```text
const myArr = [1, 2];
console.log(`Original: ${myArr}`)

[(myArr[0], myArr[1])] = [myArr[1], myArr[0]];
console.log(`Swapped: ${myArr}`);
```

What will be logged in line 4?

.

.

.

.

Don’t scroll anymore until you know the solution!

.

.

.

.

.

.

OK, ready?

.

.

.

.

Now, I bet you thought the result was:

```text
'Swapped: 2,1'
```

**WRONG.**

This code throws an error. You can try it yourself on your browser’s console:

```text
Uncaught TypeError: Cannot set property '2' of undefined
```

But, why?

This error happened to one of my students and I was puzzled for a while until I discovered the culprit. **The code is missing semicolons**. Usually, this is not a problem, since [JavaScript’s Automatic Semicolon Insertion](https://262.ecma-international.org/7.0/#sec-automatic-semicolon-insertion) takes good care of it.

However, in this case, the code is run as:

```javascript
const myArr = [1, 2];
console.log(`Original: ${myArr}`)[(myArr[0], myArr[1])] = [myArr[1], myArr[0]];
console.log(`Swapped: ${myArr}`);
```

How can we avoid this kind of headache?

#### A SOLUTION

Use [static code analysis tools](https://blog.logrocket.com/static-analysis-in-javascript-11-tools-to-help-you-catch-errors-before-users-do/).

Even if it’s a small script that I’m working on, I always install, at least, `eslint`. Because:

1. It will point out this kind of problem and others.
2. It will solve those problems and format your code automatically on save, as that’s what the configuration on your IDE should do. In the end, that task should be the work of robots, not humans!

So even if it takes a couple of minutes to set up static code analysis tools, it is always a big win. Moreover, the more times you set them up, the faster you can get it done the next time.
