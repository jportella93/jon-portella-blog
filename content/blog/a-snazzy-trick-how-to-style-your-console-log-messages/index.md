---
title: "A Snazzy Trick: How To Style Your console.log() Messages"
spoiler: A quick guide (with examples) on applying CSS to log messages in the browser’s console
date: 2021-03-25T13:59:01.112Z
---

#### A quick guide (with examples) on applying CSS to log messages in the browser's console.

```javascript
// Styling console.log messages with CSS
console.log("%cHello World!", "color: blue; font-size: 20px;");
```

#### THE PROBLEM

Our console messages don't grab users' attention.

```javascript
console.log("Hello World!");
```

A basic console.log message.

How can we make them more engaging?

#### A SOLUTION

By including a `%c` in `console.log`'s first argument, and passing some CSS declarations as the second argument, we can style the message on the browser's console.

```javascript
console.log(
  "%cHello World!",
  "color: blue; font-size: 20px; font-weight: bold;"
);
```

A styled console log message! 🌈

#### Here are some ideas

```javascript
console.log("%cRed text!", "color: red;");
console.log("%cBlue text!", "color: blue;");
console.log("%cGreen text!", "color: green;");
```

Change color in your browser's console.

```javascript
console.log(
  "%cLarge Comic Sans!",
  "font-family: Comic Sans MS; font-size: 30px;"
);
console.log("%cSmall Monospace!", "font-family: monospace; font-size: 12px;");
```

Change font-family and font-size in your browser's console.

```javascript
console.log(
  "%cRed %cBlue %cGreen",
  "color: red; font-weight: bold;",
  "color: blue; font-size: 20px;",
  "color: green; text-decoration: underline;"
);
```

Apply several styles to the same string.

```javascript
const style =
  "background: #222; color: #bada55; padding: 10px; border-radius: 5px;";
console.log("%cReusable style!", style);
console.log("%cAnother message!", style);
console.log("%cAnd another!", style);
```

Reuse console.log styles.

Many websites use this trick to grab the curious developers' attention or to prevent non-technical users to run code on the console. Some of them are Facebook, Pinterest, and Gmail.

Thanks for reading! Take care, _Jon Portella._
