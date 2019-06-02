---
title: Downloading Reddit Images in Bulk
spoiler: Get all the neat desktop goodness from /r/wallpapers with this command line utility built in Node.js
date: '2019-01-29T15:12:03.284Z'
---

![](./images/several-images-loor-nicolas.jpg)

<p style="text-align:center">Illustration by <a href="https://www.instagram.com/loornicolas/" target="_blank">loornicolas</a><p>

There are some cool wallpapers on [r/wallpapers](https://www.reddit.com/r/wallpapers). Earlier this year, I started saving them on a folder on my computer in order to display them on my desktop in a random fashion.

This picking and downloading process was kind of tedious, so I've built a small Node.js program to automate it.

[🌄 The program is available here.](http://bit.ly/reddit-image-downloader-jonportella-website)

The way it works is very simple: It grabs the URL of the specified subreddit, adds some user defined variables and fetches it adding a `.json` extension.

It's so nice of Reddit to make things so easy by exposing the whole content of any page in JSON form by just adding a `.json` extension. E.G., [https://www.reddit.com/r/wallpapers/top](https://www.reddit.com/r/wallpapers/top) returns a normal page but [https://www.reddit.com/r/wallpapers/top.json](https://www.reddit.com/r/wallpapers/top.json) returns the whole content in JSON form.

After that, it is just a matter of finding and filtering the image URL in the JSON content and downloading it.
