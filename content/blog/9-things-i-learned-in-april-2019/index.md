---
title: 9 Things I Learned in April 2019
spoiler: This time tips and tricks on CSS Modules, a lot of BASH and GIT stuff, macOS apps, using searchable components and fighting Chrome's autocomplete styling.
date: '2019-04-30T19:38:03.284Z'
---

## 1. How to use CSS Modules in create-react-app.

With CSS Modules you can make CSS classes with a component scope. This allows to use simple class names and avoid name collisions between components. Following the [Create React App docs](https://facebook.github.io/create-react-app/docs/adding-a-css-modules-stylesheet):

```CSS
/* Button.module.css */
.error {
  background-color: red;
}
```

```CSS
/* another-stylesheet.css */
.error {
  background-color: blue;
}
```

```javascript
// Button.js
import React, { Component } from 'react'
import styles from './Button.module.css' // Import css modules stylesheet as styles
import './another-stylesheet.css' // Import regular stylesheet

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button> // Background color will be red
  }
}
```

To achieve this, you just need to change the file name of the stylesheet from `Button.css` to `Button.module.css`. At compile time, the class name will be replaced by a unique class name following the format `[filename]\_[classname]\_\_[hash]`.

## 2. How to cleanup local Git branches

To delete all local branches except `master` and `feat/something-neat`:

```shell
$ git branch | egrep -v 'master|feat/something-neat' | xargs git branch -D
```

Let's break it down:

1. `git branch` shows all your local branches, this gets piped to `egrep`
1. `egrep` will return every branch that matches any identifier inside the quotes, which are separated by a `|`. The flag `-v` makes it return every branch that does **not** match the identifiers. This gets piped to `xargs`
1. `xargs` passes branch names as arguments to `git branch -D`, which deletes the branch

It's a good idea to first run `git branch | egrep -v 'master|feat/something-neat'` to see which branches will be deleted, and then run the full command.

Read more about `xargs` [here](https://shapeshed.com/unix-xargs/).

## 3. How to build searchable components using Fuse.js.

I had to create a search component which included an input field. Typing on the input had to reveal fuzzy searches from a JSON file on another component.

This nice little package called [Fuse.js](https://fusejs.io/) made it a breeze. it has a handful of custom options and parameters, such as fuzzynes/exactitude of the match, max number of items or priorititary items. Definitely worth checking it out!

## 4. How to fight and plug into Chrome autocomplete feature.

There's a [long list of hacks](http://webagility.com/posts/the-ultimate-list-of-hacks-for-chromes-forced-yellow-background-on-autocompleted-inputs) to fight Chrome input field autocomplete styling. However, my problem was that I had to execute some JavaScript when this action triggered. But Chrome just adds a class to the autocompleted element, it doesn't trigger any event when autocompletes, so I didn't know how to detect it without polling.

After some research, I finally found a smart hack to plug into this event: It turns out you can listen for CSS animations events. So the trick is adding an empty CSS animation to the Chrome autocomplete class and listen for an animation start event with a JavaScript event listener. Then use it as a hook for whatever you need it. Really smart!

Check the original -and better worded- explanation [here](https://medium.com/@brunn/detecting-autofilled-fields-in-javascript-aed598d25da7).

## 5. How to git ignore momentarily.

There are some files that should be always ignored by Git, that's why we include them in `.gitignore`. But what if you want to ignore a file just for a while? This happened to me with a compiled file created automatically by a task runner.

To ignore:

```shell
$ git update-index --assume-unchanged "src/ignore.js"
```

To stop ignoring:

```shell
$ git update-index --no-assume-unchanged "src/ignore.js"
```

## 6. How to make MacOS Spotlight suck less.

Honestly, forget about Spotlight and try [Alfred](https://www.alfredapp.com/). Not only has a myriad customizations but also, and this was the deal breaker for me, it appears instantly when pressing the key.

Because waiting ~400ms for Spotlight to appear when pressing the key is just too much.

We are busy people, Apple!!

## 7. How to reorder and fixup local git commits.

Let's say we are starting a website. We have 3 commits:

```shell
747ef1e feat: add Button
19d9327 feat: add Navbar
effb3b4 initial commit
```

But then we realise that we forget to commits some changes on the Navbar commit. What do we do?
We could make a new commit with a message like `git commit -m 'fix: missing changes on Navbar'`, but that commit wouldn't have any semantic value to the commit history and it'd only make it less clear.

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

Note that the commith hashes have changed, so only do this with commits that hasn't been pushed yet.

Thanks to [Sebastian Daschner](https://blog.sebastian-daschner.com/entries/git-commit-fixup-autosquash) for this knowledge!

## 8. How to concatenate commands in BASH

Using the `;` operator, the second command will run after the first command.

```bash
$ cat non_existing.txt ; echo 'success!'
-> cat: nonexisting.txt: No such file or directory
-> success!
```

Using the `&&` operator, the second command will run **only** if the first command succeeds.

```bash
$ cat non_existing.txt && echo 'success!'
-> cat: nonexisting.txt: No such file or directory
```

Using the `\` operator, you can split your command in multiple lines for readability.

```
$ echo \
$ hello world
-> hello world
```

## 9. How to quickly start my work environment

There are a number of apps and programs that I use while working. Opening them one by one at the start of the day is a hassle and so is closing them at the end. So I made a bash script to automate this:

For opening everything:

```bash
# in .bashrc
alias work_on="
open /Applications/Slack.app ; /
open /Applications/Mail.app ; /
open /Applications/Zeplin.app ; /
open /Applications/Postman.app ; /
open /Users/jon/Applications/Chrome\ Apps.localized/StackEdit.app ; /
vmon
"

# in the CLI
$ work_on
```

Basically, you are passing the location of the app to the command `open` and concatenating the commands with `;`. Most of the apps live in `/Applications` but for example StackEdit, which is a Chrome App, lives in `/Users/jon/Applications/Chrome\ Apps.localized`

The last one `vmon` is a custom alias for starting my virtual machine.

For closing everything:

```bash
# in .bashrc
alias work_off="
osascript -e 'quit app \"Zeplin\"' ; /
osascript -e 'quit app \"Mail\"' ; /
osascript -e 'quit app \"Code\"' ; /
osascript -e 'quit app \"Slack\"' ; /
osascript -e 'quit app \"Postman\"' ; /
osascript -e 'quit app \"StackEdit\"' ; /
vmoff
"

# in the CLI
$ work_off
```

To close apps on macOS we can execute the `quit app` command with `osascript -e`.

Note here that I'm also closing my text editor `osascript -e 'quit app \"Code\"'` but I'm not opening it in the previous command. This is because I have a custom alias to open the editor with every diferent repo, so each time it will be different on opening but it will be the same on closing.

Again, the last one `vmoff` is a custom alias for stopping my virtual machine.
