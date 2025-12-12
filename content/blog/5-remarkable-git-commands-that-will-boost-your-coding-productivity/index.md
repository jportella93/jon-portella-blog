---
title: 5 Remarkable Git Commands That Will Boost Your Coding Productivity
spoiler: >-
  These are custom made, they don’t appear in the Git docs! Saved me countless
  headaches in the last two years…
date: "2020-09-29T08:24:58.322Z"
hasNewsletterBeenSent: true
---

These are custom made, they don’t appear in the Git docs! Saved me countless headaches in the last two years…

![Presentation image](https://j-img.jonportella.com/content/blog/5-remarkable-git-commands-that-will-boost-your-coding-productivity/images/0.png)

### 1. Git Commit Work In Progess — gwip

This command will stage all current changes and commit them with a default message.

It’s very useful for saving your current work and checking another branch and then coming back to it.

Also to save your current work for the day and push it to the remote, just in case your computer breaks until the next time you open the code. It adds a commit message such as `--wip-- [skip ci]` so your CI can be configured to skip this commit.

It comes with [ohmyzsh](https://ohmyz.sh/) but can also be added manually by adding this line in `~/.bashrc`

```shell
alias gwip='git add -A; git rm $(git ls-files --deleted) 2> /dev/null; git commit --no-verify --no-gpg-sign -m "--wip-- [skip ci]"'
```

---

### 2. Git Uncommit Work In Progess — gunwip 🔫

It’s the twin of #1 `gwip` .It resets the last commit created by `gwip` leaving your work in the state it was before running `gwip`.

It also comes with [ohmyzsh](https://ohmyz.sh/) but can also be added manually by adding this line in `~/.bashrc`

```shell
alias gunwip='git log -n 1 | grep -q -c "\-\-wip\-\-" && git reset HEAD~1'
```

---

### 3. Git Stash Staged — gsts

You are trying to find a bug in your current set of changed files but you are not sure which file causes it.

A good approach for debugging this could be stashing files that might cause it (so they would temporarily be back to their state in the previous commit) and check if the bug is still there.

Use the [VSCode source control tab](https://code.visualstudio.com/Docs/editor/versioncontrol#_git-support) (or the CLI) to see which files have changes and stage the ones you think could be causing the bug. Then run this command and check if the bug is still there. If the bug is still there, go back to the previous state by running `git stash pop` and try again with other files.

Use this command by adding this line in `~/.bashrc`

```shell
alias gsts='git stash -- $(git diff --staged --name-only)'
```

---

### 4. Git Move — gmove

You are working in a feature when you happen to discover a bug completely unrelated to the feature. You can easily fix this bug. What do you do?

You have two options:

1. Fixing the bug and adding a commit in the feature branch. This is a bad idea since it mixes two unrelated things in the branch. What if the feature is reverted or never released? The bug would reappear.
2. Adding a ticket for the bug and sending it to the backlog. That would be a good idea if the bug could potentially take a long time to fix. But [as David Allen says in Getting Things Done](https://en.wikipedia.org/wiki/Getting_Things_Done), “If you can do it in less than two minutes, do it now”. So what do you do?

#### **Solution: gmove**

You fix the bug, stage only the changes related to the bug and execute

```shell
gmove bugfix master
```

This will create a branch called `bugfix` based off `master` with only the bug fix.

This way you can quickly separate concerns between your branches and also make reviewers happy!

You can have this command by adding this lines to `~/.bashrc`

```shell
gmove() {
  git stash -- $(git diff --staged --name-only) &&
  gwip ;
  git branch $1 $2 &&
  git checkout $1 &&
  git stash pop
}
```

Note that this command is depending on command #1 `gwip` on this page. Also, when coming back to your branch, you can use command #2 `gunwip `to reset your working state.

---

### 5. BONUS: Git Push Origin Head

Did you ever do `git push` and had git yell to you this?

```shell
fatal: The current branch test has no upstream branch.To push the current branch and set the remote as upstream, use

git push --set-upstream origin my-branch
```

Avoiding this is as easy as setting this two aliases in `~/.bashrc`

```shell
alias gpsh="git push origin HEAD"
```

```shell
alias gpshf="git push -f origin HEAD"
```

This will automatically push your branch to a branch with the same name on the remote, or create it if it doesn’t exist.
