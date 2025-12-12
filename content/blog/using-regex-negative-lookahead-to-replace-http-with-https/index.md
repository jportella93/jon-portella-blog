---
title: Using Regex Negative Lookahead to Replace HTTP with HTTPS
spoiler: "Learn how to use Regex’s Negative Lookahead, in one minute."
date: "2021-03-09T13:51:16.857Z"
hasNewsletterBeenSent: true
---

#### Make faster refactors in JavaScript, VSCode, or in your favourite place to run regular expressions

![Presentation image](https://j-img.jonportella.com/assets/1*uaTTY0a2zwL_MYBw2TumGA.webp)

---

#### THE PROBLEM

We have a list of images, some of them being requested via the HTTP protocol and some others via the HTTPS protocol.

```javascript
const string = `
  <img src="https://via.placeholder.com/150">
  <img src="https://via.placeholder.com/200">
  <img src="http://via.placeholder.com/250">
  <img src="https://via.placeholder.com/300">
  <img src="http://via.placeholder.com/350">
`;
```

We want all of them to use HTTPS.

How can we accomplish this? Just replacing `http` for `https` results in undesired `httpss` .

Just replacing `http for https produces httpss.`

```javascript
const string = `
  <img src="https://via.placeholder.com/150">
  <img src="https://via.placeholder.com/200">
  <img src="http://via.placeholder.com/250">
  <img src="https://via.placeholder.com/300">
  <img src="http://via.placeholder.com/350">
`;

const updatedString = string.replaceAll(/http/g, "https");
console.log(updatedString);

//   <img src="httpss://via.placeholder.com/150">
//   <img src="httpss://via.placeholder.com/200">
//   <img src="https://via.placeholder.com/250">
//   <img src="httpss://via.placeholder.com/300">
//   <img src="https://via.placeholder.com/350">
```

So we only want to match and update `http` that is not followed by an `s` . How do we do that?

#### A SOLUTION

Enter **Regex’s Negative Lookahead**. The syntax is simple:

```text
http(?!s)
```

Where:

- The parentheses followed by a question mark and exclamation point `(?!)` is the construct for the Negative Lookahead.
- Characters between the exclamation point and the closing parentheses are the ones negated. In this case, we are only negating the character `s` .

Here’s a demo on [RegExr](http://regexr.com/5o95i).

So our solution would be:

```javascript
const string = `
  <img src="https://via.placeholder.com/150">
  <img src="https://via.placeholder.com/200">
  <img src="http://via.placeholder.com/250">
  <img src="https://via.placeholder.com/300">
  <img src="http://via.placeholder.com/350">
`;

const updatedString = string.replaceAll(/http(?!s)/g, "https");
console.log(updatedString);

// <img src="https://via.placeholder.com/150">
// <img src="https://via.placeholder.com/200">
// <img src="https://via.placeholder.com/250">
// <img src="https://via.placeholder.com/300">
// <img src="https://via.placeholder.com/350">
```

Using Regex’s Negative Lookahead, we can match http and not https.
