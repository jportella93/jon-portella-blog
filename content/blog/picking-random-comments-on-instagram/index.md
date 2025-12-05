---
title: Picking Random Comments On Instagram
spoiler: A web app to make Instagram contests suck less.
date: "2019-01-15T15:12:03.284Z"
---

![](./images/i-loor-nicolas.jpg)

So this friend of mine, who is a personal trainer, has a bussiness Instagram account. He did a contest where any follower could comment a picture of his to have a chance to win a pack of training equipment.

The comment needed to:

- Include the phrase 'I participate'.
- Mention 3 other users.
- Also, only one comment per user was allowed.

A problem arised when, after more than 200 people commented, he had to, somehow, randomly pick a comment that also passed these conditions.

So I did a quick search for available options and I didn't find anything acceptable. Some were [paid services](https://www.easypromosapp.com/instagram-sweepstakes/) and some other even required you to [give them your credentials](https://commentpicker.com/instagram.php)... which doesn't make sense since pictures and comments are public unless the account is private. And I don't think many private accounts do contests adressed to gain more followers.

That's why I built a small app to solve this problem. It features a conversational UI to get the rules for a given contest and, at the last step, it creates a snippet that gets copied to the user clipboard. Then, this can be pasted in the JavaScript console in the picture page and the winner comment will be highlighted.

[The app is available here.](/free-instagram-random-comment-picker/)

In the future I might do a post about the decisions and the findings that features this little project. If I have to take one thing out of this is that conversational UI is super fun to work with!
