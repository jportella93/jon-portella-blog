---
title: Using JavaScript To Test Browser Support for a CSS Pseudo-Class
spoiler: "An obscure (but effective) way to do CSS feature detection with JavaScript. In the example, we test for a feature that only Microsoft browsers\_have."
date: "2021-02-23T13:47:47.254Z"
hasNewsletterBeenSent: true
---

![Presentation image](https://j-img.jonportella.com/content/blog/using-java-script-to-test-browser-support-for-a-css-pseudo-class/images/0.png)

---

#### THE PROBLEM

Some browsers have native support for pseudo-elements that others don’t. This is the case, for example, of `::ms-reveal` , the little eye that appears to show/hide password input fields in Microsoft browsers (Internet Explorer and Edge).

![Presentation image](https://j-img.jonportella.com/content/blog/using-java-script-to-test-browser-support-for-a-css-pseudo-class/images/1.png)

Edge’s native password reveal feature.

The problem with this native feature is that if your front-end has its own password reveal feature, you could end up with a layout like this one:

![Presentation image](https://j-img.jonportella.com/content/blog/using-java-script-to-test-browser-support-for-a-css-pseudo-class/images/2.png)

Oops! Edge’s native password reveal feature and our own’s.

#### A SOLUTION

A quick fix would be to just hide the native reveal password:

```css
::-ms-reveal {
  display: none;
}
```

But why are we so quick to discard a native feature? They’re great! In the end, those are the ones that have been developed and tested to work flawlessly by the same team that has built the browser.

#### A (NATIVE FRIENDLY) SOLUTION

So in this case, a good approach would be to test if the browser has the`::ms-reveal` feature, and only show our own if it doesn’t.

```js
/**
 * Test for pseudo-class support on the current client
 * @param {String} pseudoClass - The pseudo-class to test
 * @return {Boolean}
 */
export function supportsPseudoClass(pseudoClass) {
  // Get the document stylesheet
  const ss = document.styleSheets[0];

  // Test the pseudo-class by trying to add and remove a rule to the stylesheet
  let formattedPseudoClass = pseudoClass;
  try {
    if (!/^:/.test(formattedPseudoClass)) {
      formattedPseudoClass = ":" + formattedPseudoClass;
    }
    ss.insertRule("html" + formattedPseudoClass + "{}", 0);
    ss.deleteRule(0);
    return true;
  } catch (e) {
    return false;
  }
}
```

Now you can just check for `::ms-reveal` and roll your own if it doesn’t exist!

```jsx
// ...

const hasNativePasswordReveal = supportsPseudoClass("::ms-reveal");
const rightSlot = hasNativePasswordReveal ? null : <PasswordReveal />;

return <PasswordInput rightSlot={rightSlot} />;

// ...
```
