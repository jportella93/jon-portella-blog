---
title: Time-Traveling in Git? Meet Git Reflog
spoiler: Let’s learn to use the power of this advanced tool for Git disaster‑saving
date: "2021-04-06T16:00:13.759Z"
hasNewsletterBeenSent: true
---

#### Let’s learn to use the power of this advanced tool for Git disaster‑saving

![Presentation image](https://j-img.jonportella.com/assets/1*-ghw_C9Eg6JvuHVviD3kgA.jpg)

#### THE PROBLEM

A local branch deleted by accident, squashed commits that we would like to be un-squashed… when a catastrophe occurs, wouldn’t it be great if we could **time-travel in Git**?

#### A SOLUTION

Let’s learn how to use `git reflog`. First, abit of context.

Reference logs, or “reflogs”, record when the tips of branches and other references were updated in the local repository.

`git reflog` by default targets HEAD — a symbolic reference to the currently active branch — but other branches, tags, remotes, and the Git stash can also be targeted.

`git reflog` shows “movements” with the syntax `name@{qualifier}`. E.g. `HEAD@{2}` means “where HEAD used to be two moves ago”.

Let’s put it into practice.

#### Recovering a locally deleted branch

We’ve deleted a local branch, how can we recover it?

```shell
git branch -D navbar-feature
```

We can use `git reflog` to find a point in history to time‑travel to. We see that one move ago we did the last commit on that branch that we just deleted.

```text
3b7a6fdb (HEAD -> master) HEAD@{0}: checkout: moving from navbar-feature to master
9a07e99f HEAD@{1}: commit: feat: add Navbar
3b7a6fdb (HEAD -> master) HEAD@{2}: checkout: moving from master to navbar-feature
```

So we can just create a new branch with the content of that point in history:

```shell
git checkout -b navbar-feature HEAD@{1}
```

Fantastic, we have recovered our branch and its commits!

#### Recovering squashed commits

We have 3 commits:

```text
747ef1e feat: add Button19d9327 feat: add Navbar
effb3b4 initial commit
```

We realize that we forget to add something on the Navbar commit, so we add those changes and we commit with a fixup `git commit --fixup 19d9327`. Our history now:

```text
c2149d1 fixup! feat: add Navbar
747ef1e feat: add Button
19d9327 feat: add Navbar
effb3b4 initial commit
```

And now, to clean up our history by squashing this last commit with its reference, we use`git rebase --autosquash --interactive HEAD~4`. Our history is clean now:

```text
de1e9de feat: add Button
b3b4932 feat: add Navbare
ffb3b4 initial commit
```

However, how can we go back to our history pre‑rebase? `git reflog` shows that when we committed that fix was 4 moves ago `HEAD@{4}` , while the most recent moves are part of the rebase.

```text
4610b383 HEAD@{0}: rebase -i (finish): returning to refs/heads/master
4610b383 HEAD@{1}: rebase -i (pick): feat: add Navbar
52d0c48c HEAD@{2}: rebase -i (fixup): feat: add Navbar
07097c96 HEAD@{3}: rebase -i (start): checkout HEAD~4
c2149d1 HEAD@{4}: commit: fixup! feat: add Navbar
```

So we can just `git reset HEAD@{4}` and we have recovered our history pre-squash! This is what `git log` shows now:

```text
c2149d1 fixup! feat: add Navbar
747ef1e feat: add Button
19d9327 feat: add Navbar
effb3b4 initial commit
```

#### Thanks for reading! Keep learning, and don’t stop coding 😊

---

**Resources**

- [git-reflog Documentation](https://git-scm.com/docs/git-reflog) — Git SCM
- [Git Reflog](https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog) — Atlassian
- [Git Reflog Tutorial](https://www.edureka.co/blog/git-reflog/) — Edureka
