---
title: 6 Things I Learned in May 2019
spoiler: >-
  Some cool React.js libraries, PropTypes, node_modules updates and an Easter
  Egg.
date: "2019-05-30T19:38:03.284Z"
hasNewsletterBeenSent: true
---

![Presentation image](https://j-img.jonportella.com/content/blog/6-things-i-learned-in-may-2019/images/6-loor-nicolas.jpg)

## 1. How to properly update your Node.js modules to the latest versions

One common source of confusion for new Node.js developers is the command `npm update`. It will update all `node_modules` present in `package.json` to their latest versions but **it will not change the version names** in `package.json`.

So PROBLEM: when another developer clones your repo and runs `npm install`, she will get an older version from the `node_modules` than you.

I found an automatic solution for this: the package [npm-check-updates](https://www.npmjs.com/package/npm-check-updates). Let\'s see how it works:

```bash
$ npm install –g npm-check-updates
```

Once installed globally, you can call it like this:

```bash
$ ncu
```

The output of this command will show which packages have a newer available version.

But the real fun is in calling it with the flag `-u`, which **will actually update your package.json with the latest versions**. Then just run `npm install` and all your `node_modules` will be updated.

And, as the `package.json` has been updated, every other developer that runs `npm install` will get the same updated versions. Success!

## 2. How to build a rich text editor in React.js

So I had to build a text editor for a `React.js` application, with bold, underline, italics, indentation, text aligning, bulletpoints and table functionality. After researching some libraries I found one that was super flexible and had an overall great developer experience: [Slate.js](https://www.slatejs.org/#/rich-text). 100% would recommend.

## 3. How to properly handle browser events

While working on a web page with lots of animations triggered by window size, I realized that working with `addEventListener` and `removeEventListener` is difficult, because they require the exact same event handler. [I wrote a small post explaining my approach](/you-are-using-browser-events-wrong).

## 4. How to specify a React.js Component as PropType

With component composition, this can be a common pattern (modified from the [React.js docs](https://reactjs.org/docs/composition-vs-inheritance.html#containment)):

```jsx
// Create a layout component, that render children on slots.
const SplitPane = ({ leftComponent, rightComponent }) => (
  <div className="SplitPane">
    <div className="SplitPane-left">{leftComponent}</div>
    <div className="SplitPane-right">{rightComponent}</div>
  </div>
);

const App = () => <SplitPane left={<Contacts />} right={<Chat />} />;
```

**But how can you specify a component or a rendered value as a PropType?**

From the [PropTypes docs](https://github.com/facebook/prop-types#usage):

```javascript
  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element (ie. <MyComponent />).
  optionalElement: PropTypes.element,
```

So we could modify SplitPane like:

```jsx
const SplitPane = ({ leftComponent, rightComponent }) => (
  <div className="SplitPane">
    <div className="SplitPane-left">{leftComponent}</div>
    <div className="SplitPane-right">{rightComponent}</div>
  </div>
);

SplitPane.propTypes = {
  leftComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  rightComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
};
```

## 5. How to build a data-grid table in React.js

Ok, building a table doesn\'t sound like anything difficult, right? just use a `<table>` element and it\'s sub-elements.

But what happens when you want display some data with filtering, all kinds of sorting, custom renderers for each cell...?

I found myself in this situation and ended up using the batteries-included [react-table package](https://github.com/tannerlinsley/react-table). It really has a ton of out-of-the-box functionality and a great [set of examples](https://github.com/tannerlinsley/react-table/tree/v6#codesandbox-examples) to get you up and running quickly!

I also would recommend it 100%.

## 6. How to be polite with your shell

This is more like an easter egg but in `~/.bashrc` set de following alias:

```bash
alias please="sudo"
```

So now you can run polite command like:

```bash
$ please gatsby develop
```
