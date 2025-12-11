---
title: Track User Scroll with IntersectionObserver
spoiler: >-
  Learn how to leverage window.IntersectionObserver to find out how many
  visitors see your content, in one minute.
date: '2021-03-10T13:32:36.932Z'
hasNewsletterBeenSent: true
---

#### A tutorial on firing a callback function when an element enters the viewport

![Presentation image](./images/0.png)

#### The problem

Our website has a new and shiny landing page. We are getting lots of visits, so the marketing team has asked us to track how many of those visitors scroll down to the Call To Action section.

How can we do that?

#### A solution

Use [window.IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) to:

1. Detect when the section enters the viewport.
2. Fire a callback that will log that event on our analytics software e.g. [Fathom](https://usefathom.com/), [Matomo](https://matomo.org/), [Google Analytics](https://analytics.google.com/).
3. Disconnect the observer to avoid logging the event more than once.

Here’s a demo:

Demonstration of window.IntersectionObserver to log user scroll to a certain section.

---

```javascript
// Feature detection, avoid breaking IE11
if (IntersectionObserver) {
  document.querySelectorAll(".call-to-action").forEach((node) => {
    // Create the observer and pass the callback
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        // entries[0] is the element that entered into view
        alert(entries[0].target.textContent.trim() + ` scrolled into view!`);
        // Disconnect to avoid logging more than once
        this.disconnect();
      }
    });

    // Make the observer watch for the node entering on viewport
    observer.observe(node);
  });
}
```
