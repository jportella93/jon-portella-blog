---
title: Master Git Diff With These Not-So-Known Commands
spoiler: Save time while reviewing your own pull requests
date: 2021-03-24T13:59:13.304Z
---

#### Spot errors before pushing to save time while reviewing your own pull requests

![](images/0.png)

Art by my buddy [Loor Nicolas](https://www.instagram.com/)

#### THE PROBLEM

You spend a lot of time reviewing your own pull request on Github before asking for a review and you always find stuff that needs to be changed. So you need to add/edit commits, losing lots of time.

#### A SOLUTION

Before committing, make good use of `git diff`, so you avoid having to change code later.

Here are some not-so-known git tips, sorted from more common to more uncommon:

#### Changes on staged or unstaged files

1. Show all **unstaged** changes since the last commit:

```
git diff
```

2. Show all **staged** changes since the last commit:

```
git diff --cached
```

3. Show all **staged and unstaged** changes since the last commit:

```
git diff HEAD
```

#### Revision targeting

1. Show changes **since a specific commit**:

```
git log --oneline# 4833545 cleanup# c3a1ee6 add navbar# ca2f968 initial commit
```

```
git diff ca2f968
```

2. Show changes** since the last n commits**, e.g. 2:

```
git diff HEAD~2
```

#### Single file

1. Show changes on a **single file since the last commit**:

```
git diff script.js
```

2. Show changes on a **single file since a specific commit**:

```
git log --oneline# 4833545 cleanup# c3a1ee6 add navbar# ca2f968 initial commit
```

```
git diff ca2f968 script.js
```

#### Summary of changes

To be run from your feature branch.

1. Show all changes over a specific branch (**GitHub PR diff**):

```
git diff master
```

2. Show **changed files with a number of changed lines** over a specific branch:

```
git diff master --stat
```

3. Show a **one-line summary of the changes **over a specific branch:

```
git diff master --shortstat
```

#### BONUS

Finally, here’s a neat trick by [Shime.sh](https://shime.sh/til/git-diff-tips-and-tricks), to make your diffs more readable by removing the `+` and `-` symbols, since they are colored anyway!

```
git config --global pager.diff 'sed "s/^\([^-+ ]*\)[-+ ]/\\1/"'
```

