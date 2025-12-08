---
title: Quick Async One-Liners With Async Immediately Invoked Function Expressions
spoiler: A neat trick for a job interview or to save time on quick scripts
date: "2021-02-26T12:35:22.653Z"
---

![Presentation image](./images/0.png)

---

#### THE PROBLEM

We have to create a script that will do a GET request to the Chuck Norris jokes API and append that content to a div with the id `#chucky`.

A quick and easy way to do this would be chaining `.then` methods on the promises returned by `fetch` and `.json` :

```js
fetch("https://api.chucknorris.io/jokes/random")
  .then((response) => response.json())
  .then(({ value }) => {
    document.querySelector("#chucky").textContent = value;
  });
```

Let’s refactor it to a more readable `async/await`. Now, the problem is that `await` doesn’t work unless it’s used inside an `async`function:

```js
// Uncaught SyntaxError: await is only valid in async function
const response = await fetch("https://api.chucknorris.io/jokes/random");
const { value } = await response.json();

document.querySelector("#chucky").textContent = value;
```

So a common pattern is to just wrap the async code in an `async` function and call it immediately. But we are polluting the namespace by adding this new `go` function which we call immediately:

```js
async function go() {
  const response = await fetch("https://api.chucknorris.io/jokes/random");
  const { value } = await response.json();

  document.querySelector("#chucky").textContent = value;
}

go();
```

#### A SOLUTION

So here’s a quick trick I’ve used in a job interview in the past.

We can do exactly the same in one step and without polluting the namespace with an Async [Immediately Invoked Function Expression](https://developer.mozilla.org/en-US/docs/Glossary/IIFE):

```js
(async function () {
  const response = await fetch("https://api.chucknorris.io/jokes/random");
  const { value } = await response.json();
  document.querySelector("#chucky").textContent = value;
})();
```
