---
title: 5 cool JS tricks to impress your teammates
spoiler: Some web-dev wisdom, not just limited to JS!
date: 2020-09-25T22:52:57.672Z
---

![](images/0.png)


### 1. Update your NPM modules with one command

One common source of confusion for new Node.js developers is the command `npm update`. It will update all `node_modules` present in `package.json` to their latest versions but **it will not change the version names** in `package.json`.

So PROBLEM: when another developer clones your repo and runs `npm install`, they will get an older version from the `node_modules` than you.

I found an automatic solution for this: the package [npm-check-updates](https://www.npmjs.com/package/npm-check-updates). Let’s see how it works:

```bash
npx npm-check-updates
```

The output of this command will show which packages have a newer available version.

But the real fun is in calling it with the flag `-u`, which **will actually update your package.json with the latest versions**. Then just run `npm install` and all your `node_modules` will be updated.

And, as the `package.json` has been updated, every other developer that runs `npm install` will get the same updated versions. Success!

---

### 2. Specify a React.js Component as PropType

With component composition, this can be a common pattern (modified from the [React.js docs](https://reactjs.org/docs/composition-vs-inheritance.html#containment)):

```jsx
// Create a layout component, that render children on slots.
const SplitPane = ({ leftComponent, rightComponent }) => (
  <div className="SplitPane">
    <div className="SplitPane-left">{leftComponent}</div>
    <div className="SplitPane-right">{rightComponent}</div>
  </div>
)

const App = () => <SplitPane left={<Contacts />} right={<Chat />} />
```

**But how can you specify a component or a rendered value as a PropType?**From the [PropTypes docs](https://github.com/facebook/prop-types#usage):

```js
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
)

SplitPane.propTypes = {
  leftComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
  rightComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.element]),
}
```

---

### 3. Clean-Up local Git branches

To delete all local branches except `master` and `feat/something-neat`:

```bash
git branch | egrep -v 'master|feat/something-neat' | xargs git branch -D
```

Let’s break it down:

1. `git branch` shows all your local branches, this gets piped to `egrep`
2. `egrep` will return every branch that matches any identifier inside the quotes, which are separated by a `|`. The flag `-v` makes it return every branch that does **not** match the identifiers. This gets piped to `xargs`
3. `xargs` passes branch names as arguments to `git branch -D`, which deletes the branch

It’s a good idea to first run `git branch | egrep -v 'master|feat/something-neat'` to see which branches will be deleted, and then run the full command.

---

### 4. Get a professional git history

Let’s say we are starting a website. We have 3 commits:

```shell
747ef1e feat: add Button
19d9327 feat: add Navbar
effb3b4 initial commit
```

But then we realise that we forget to commits some changes on the Navbar commit. What do we do? We could make a new commit with a message like `git commit -m 'fix: missing changes on Navbar'`, but that commit wouldn’t have any semantic value to the commit history and it’d only make it less clear.

A proper solution would be to **fixup** the commit. We would do `git commit --fixup 19d9327`. Our history would be like this now:

```shell
c2149d1 fixup! feat: add Navbar
747ef1e feat: add Button
19d9327 feat: add Navbar
effb3b4 initial commit
```

And now, to squash this last commit with its reference, we would do `git rebase --autosquash --interactive effb3b4`. This will open Vim or other terminal text editor, just save the changes pressing `ZZ` and your history now will look like this:

```shell
de1e9de feat: add Button
b3b4932 feat: add Navbar
effb3b4 initial commit
```

Note that the commit hashes have changed, so only do this with commits that hasn’t been pushed yet.

Thanks to [Sebastian Daschner](https://blog.sebastian-daschner.com/entries/git-commit-fixup-autosquash) for this knowledge!

---

### 5. Quickly start your work environment (MacOS)

There are a number of apps and programs that I use while working. Opening them one by one at the start of the day is a hassle and so is closing them at the end. So I made a bash script to automate this. Copy this text in `~/.bashrc` .

For opening everything:

```shell
alias work_on="
open /Applications/Slack.app ; /
open /Applications/Mail.app ; /
open /Applications/Zeplin.app ; /
open /Applications/Postman.app ; /
"
```

Now I can just open my computer’s Terminal and type `work_on`and everything will be ready. Basically, you are passing the location of the app to the command `open` and concatenating the commands with `;`. Most of the apps live in `/Applications`

For closing everything:

```shell
alias work_off="
osascript -e 'quit app \"Zeplin\"' ; /
osascript -e 'quit app \"Mail\"' ; /
osascript -e 'quit app \"Code\"' ; /
osascript -e 'quit app \"Slack\"' ; /
osascript -e 'quit app \"Postman\"' ; /
"
```

To close apps on macOS we can execute the `quit app` command with `osascript -e`.

Note here that I’m also closing my text editor `osascript -e 'quit app \"Code\"'` but I’m not opening it in the previous command. This is because I have a custom alias to open the editor with every different repo, so each time it will be different on opening but it will be the same on closing.

---

### BONUS: How to be polite with your shell

This is more like an easter egg but in `~/.bashrc` set de following alias:

```shell
alias please="sudo"
```

So now you can run polite super user commands:

```shell
please gatsby develop
```
