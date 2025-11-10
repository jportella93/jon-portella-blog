---
title: 1 Minute To Become A Better Developer (#14)
spoiler: Learn how to build a 3D bank card, in one minute.
date: 2021-03-12T13:55:24.717Z
---

#### Make your cards stand-out with this quick JavaScript tutorial

![](images/0.png)

[What we are going to build](https://codepen.io/jportella93/pen/eYBxdzv)

#### THE PROBLEM

The payment form on our website looks a little bit dull. Customers get bored and don’t input their card details. How can we make it more engaging?

Our boring static card.

---

#### A SOLUTION

We are going to use [Vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js/) to make our card move in 3 dimensions when hovering it with our mouse or tilting our handheld device.

It is really simple:

1. Import it in our project

```
npm install vanilla-tilt
```

or import it from a CDN as in the example:

```
import vanillaTilt from "https://cdn.skypack.dev/vanilla-tilt@1.7.0";
```

2. Target a DOM element as a Vanilla-tilt container. The second argument is the [options](https://github.com/micku7zu/vanilla-tilt.js/#options) object.

```
const card = document.querySelector("#card");VanillaTilt.init(card, {  max: 10,  speed: 1000,  perspective: 700});
```

And that’s really it! Here is our final result:

Our cool cat 3D moving card! Let’s spend all our $$!

---

