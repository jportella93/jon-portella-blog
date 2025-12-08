---
title: Remove All node_modules Directories at Once
spoiler: Learn how to remove all your node_modules directories, in one minute.
date: "2021-03-15T13:43:28.380Z"
---

#### Here’s my one-liner to delete all the JavaScript dependencies of a repo in a flash.

![Presentation image](./images/0.png)

#### THE PROBLEM

You want to do a backup of all your current files because you’re switching computers.

Some of your local repositories have unpublished branches so you want to copy them over to your new machine rather than checking out their remote versions.

However, the gazillion files inside node_modules make copying the repo take 2 hours. You don’t want to go on every directory and delete the folder manually.

What do you do?

#### A SOLUTION

We are going to use Unix's `find` to look for `node_modules` folders in our repositories directory, and then we are going to use `xargs` to pass these paths to `rm`.

1. Go into your repositories directory:

```shell
cd
```

2. List the `node_modules` directories you are going to remove:

```css
find . -type d -name node_modules
```

```bash
# ./example-repo/node_modules# ./example-repo/node_modules/node-libs-browser/node_modules# ...
```

3. Let’s use `xargs` to pass these paths to `rm` :

```css
find . -type d -name node_modules | xargs rm -rf
```

4. Done! let’s double-check that all the `node_modules` have been deleted:

```css
find . -type d -name node_modules
```

```bash
# Empty
```

Now copying over our repositories directory to our new machine takes just a second, and we can run `npm install` to generate a new `node_modules` directory.
