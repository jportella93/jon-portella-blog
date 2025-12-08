---
title: "Quick Refactor: Keep Casing in VSCode Search + Replace"
spoiler: A simple Visual Studio Code trick to save precious time while refactoring
date: 2021-02-25T13:32:08.096Z
---

![](images/0.png)

---

#### THE PROBLEM

We have a `pet` object, whose value under the key of `name` we are changing. We are saving a reference to the old value that the key `name` pointed to for logging purposes.

![](images/1.png)

Now we realize that we’d like to rename the key `name` to `alias`. A refactoring is in order. So we pull up the find and replace feature by pressing ctrl/cmd + f.

![](images/2.png)

But oops! as they key `name` is also used in camelCase as part of other variables names `newPetName` and `oldPetName` , we get a casing mismatch after replacing. `newPetalias` and `oldPetalias` don’t look so good…

![](images/3.png)

#### A SOLUTION

We are going to undo this change and repeat it using the [preserve case option on the find and replace feature](https://code.visualstudio.com/docs/editor/codebasics#_advanced-find-and-replace-options) by pressing the `AB` button.

![](images/4.png)

Now we’ve saved time refactoring and our pets are happy with their aliases!

![](images/5.png)

---
