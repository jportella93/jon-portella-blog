---
title: Persist CSS Changes Done in Chrome’s Dev-Tools
spoiler: >-
  Avoid losing all those changes on the elements tab if you accidentally reload
  your browser
date: "2021-02-24T13:38:12.609Z"
hasNewsletterBeenSent: true
---

![Chrome DevTools interface showing the problem of losing CSS changes on refresh](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/0.png)

---

#### THE PROBLEM

Using your dev tools to tinker with CSS is great because you get immediate feedback on the changes. However, if the page is refreshed, all those changes get lost in oblivion…

#### A SOLUTION

Here’s a quick tip to persist those changes without affecting your original source files.

1. Open Chrome's dev tools.

![Chrome DevTools opened showing the main interface](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/1.png)

2. Press ctrl/cmd + shift + p to show [Chrome's dev tools command menu](https://developers.google.com/web/tools/chrome-devtools/command-menu).

![Chrome DevTools command menu opened with search input](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/2.png)

3. Type “show overrides”.

![Chrome DevTools command menu showing 'show overrides' option](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/3.png)

4. Tap on “+ Select folder for overrides” on the left side and select a folder on your machine. That’s where your overrides will live.

![Chrome DevTools showing the overrides folder selection](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/4.png)

5. Allow Chrome to access this folder by tapping “Allow” on the bar that appears below the search bar.

![Chrome DevTools showing folder access permission prompt](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/5.png)

6. Now the folder has appeared on the “Overrides” section.

![Chrome DevTools overrides tab with selected folder](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/6.png)

7. Let’s try it! Change some styles in the “Elements” panel. You’ll see a purplish dot next to the stylesheet file name, which means it has been saved locally in our overrides folder. Refreshing the page will keep that change!

![Chrome DevTools showing CSS changes saved with purple dot indicator](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/7.png)

8. Now back in the “Overrides” tab, we can see those local overrides, sorted by URL folders.

![Chrome DevTools overrides tab showing saved local changes](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/8.png)

9. (BONUS!) To see the diff between your source code and the local overrides, you can type “Show changes” on the command menu.

![Chrome DevTools showing diff between source and overrides](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/9.png)
![Chrome DevTools command menu with 'show changes' option](https://j-img.jonportella.com/content/blog/persist-css-changes-done-in-chrome-s-dev-tools/images/10.png)
