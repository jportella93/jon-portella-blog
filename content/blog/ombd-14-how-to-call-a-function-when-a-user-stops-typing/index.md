---
title: How To Call a Function When a User Stops Typing
spoiler: We’ll learn how to implement a browser auto-saving draft system in JavaScript
date: '2021-04-21T13:12:45.974Z'
hasNewsletterBeenSent: true
---

#### We’ll learn how to implement a browser auto-saving draft system in JavaScript

![Presentation image](./images/0.png)

#### THE PROBLEM

We are implementing a text editor with a Google-Docs-like draft system, where content gets saved server-side when the user stops typing for a second.

#### A SOLUTION

We are going to use the `keyup` event and `window.setTimeout` .

The key to this snippet is that the `timerId` has to be set declared in the scope of the `keyup` callback, in order to be reassigned to the new timeout id every time the `keyup` callback is fired again.

Here’s a demo on CodePen:

Call function when the user stops typing.

```javascript
// Declare a new variable that will get reassigned later with the timeout id
let timerId;

// Get the DOM Node of the input area and listen for a keyup event
document.querySelector("textarea").addEventListener("keyup", () => {
  // Clear timeout to callback, doesn't do anything on first run since timerId is undefined
  clearTimeout(timerId);
  // Set timerId to fire callback in one second, unless another keyup event is triggered
  timerId = window.setTimeout(renderCurrentTime, 1000);
});

// Callback that will get fired 1s after typing
function renderCurrentTime() {
  // TODO: Save note to server
  document.querySelector("time").textContent = new Date().toLocaleString();
}
```
