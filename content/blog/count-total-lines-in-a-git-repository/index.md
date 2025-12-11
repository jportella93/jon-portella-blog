---
title: Count Total Lines in a Git Repository
spoiler: >-
  Learn how to count the total number of lines in a Git repository, in one
  minute.
date: "2021-03-11T13:43:08.802Z"
hasNewsletterBeenSent: true
---

#### A one-liner to count lines, words, and characters on any repo

![Presentation image](./images/0.png)

#### THE PROBLEM

Our engineering manager has asked us about the total number of lines on several repositories of the company. How can we find out that information?

#### A SOLUTION

We are going to use the command `git ls-files` and [pipe](https://www.geeksforgeeks.org/piping-in-unix-or-linux/) its output to`wc` using `xargs` .

1. As a repository example, we are going to create a new project using [superplate](https://github.com/pankod/superplate).

```shell
npx superplate-cli my-app
```

2. Once created, we are going into the repo directory.

```shell
cd my-app
```

3. Now we can run `git ls-files` to recursively see all the files versioned in the repo.

```shell
git ls-files
```

```bash
# .babelrc# .eslintignore# .eslintrc# .gitattributes# ...
```

4. However we want to also see the number of lines on every file. We are going to [pipe](https://www.geeksforgeeks.org/piping-in-unix-or-linux/) the output of `git ls-files` to `wc` using `xargs` .

```shell
git ls-files | xargs wc
```

```bash
#       1       4      30 .babelrc#       1       2      26 .eslintignore#      25      37     600 .eslintrc#       1       2      12 .gitattributes# ...#   25891   49458 1219057 total
```

Here we see:

- 1st column: number of **lines** in that file**.**
- 2nd column: number of **words** in that file.
- 3rd column: number of **characters** in that file.

And in the last row, information on the total of files.

**So our repo has 25891 lines**.

---
