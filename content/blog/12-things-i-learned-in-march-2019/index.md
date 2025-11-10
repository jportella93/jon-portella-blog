---
title: 12 Things I Learned in March 2019
spoiler: Tips and tricks including but not limited to Pandas, JavaScript sliders and swipers, a flights API, BASH automations and some other nifty ideas.
date: '2019-03-31T19:38:03.284Z'
---

![](./images/t-loor-nicolas.jpg)


## 1. How to count occurrences of a data cell in a .cvs (Python and Pandas).

I had a big .cvs file with a log of e-mails sent. The columns included e-mail address, timestamp, state, subject, etc. All mails were using some template from a set of 10 or so templates.

At some point I wanted to know how many mails were sent with the same template. So I ended up with this code:

```python
import sys
import pandas as pd

pd.set_option('display.max_colwidth', -1)

# csv file is passed as first argument on the command line
csv_file = sys.argv[1]
df = pd.read_csv(csv_file)

print df.groupby(['subject'])['subject'].agg(['count'])
```

## 2. How to build a full page vertical slider with vanilla JavaScript.

Inspired by the [tesla website](http://bit.ly/tesla-website), I had to build a full page vertical slider. This deserves a tutorial on its own, but, basically:

1.  Wrap every one of your full page screens into a `div`
1.  Set a special class `.autoscroll-screen` to the div
1.  Make sure these elements have a `height: 100vh` CSS property
1.  Query the DOM for elements with class `.autoscroll-screen` and save the vertical separation between the top of each of these containers and the top of the document
1.  Add an event listener to prevent scroll and catch the direction of the scroll
1.  Animate `body` element `top` CSS property to match the top of the element that is requested by the user

## 3. How to better track my working hours.

As a remote developer, not having to do straight 9 to 5 is such a relief. I'll do my 8 hours but most times I will spread these during my day. Sometimes this might be difficult to track. But I found a nice app called [Work Log](http://bit.ly/work-log) that is just great. I can "punch in" whenever I start working and "punch out" when I stop, and it sums the full time for the day.

## 4. How to check if your credentials have been pwned.

Whenever some credentials breach occurs, all those e-mail addresses and passwords can be released to the public. For this reason, someone trying to brute-force a login will probably run all these passwords first before running any dictionary attack. Thus, using a common password is not a good idea, because if someone leaks their password, which happens to be the same as yours, someone could impersonate you. Even if you didn't leak your password.

In the website [haveibeenpwned](http://bit.ly/hibpwnedd) you can check if your e-mail address was leaked in some attack. If so, please note that this doesn't mean that your password has also been leaked. To check for leaked passwords, the same page has a [pwned passwords search](http://bit.ly/hibpasswords).

But, if you are like me and don't trust to send your actual password to some service like this, you can use [this tool I built to check if you have been pwned locally](http://bit.ly/node-pwned-checker).

## 5. How to drive a bigger motorbike.

This month I finally got my 70hp license, yay! 🏍

## 6. How to access flight information through an API.

This cool travel company called Kiwi launched a platform called [Tequila](http://bit.ly/jp-tequila). They expose a nice API to get info on flights, hotels and other stuff for free.

This was the missing piece for a project that I will launch soon. Couldn't do it earlier because SkyScanner rejected my request for acces to their API...

## 8. How to automate directory creation with BASH using {}.

Say you want to create a directory called `src`.
Inside this directory you want 3 directories `pages`, `components` and `lib`.
Inside each of these directories you want to create 3 folders, `v1`, `v2` and `v3`.

```bash
$ mkdir -p src/{pages,components,lib}/{v1,v2,v3}

# Results in this folder structure:
#|-src
#|---components
#|-----v1
#|-----v2
#|-----v3
#|---lib
#|-----v1
#|-----v2
#|-----v3
#|---pages
#|-----v1
#|-----v2
#|-----v3
```

Each word inside the `{}` will be an iteration.

Also you can do it with numbers, creating a range:

```bash
$ touch foo_{1..5}
$ ls
-> foo_1 foo_2 foo_3 foo_4 foo_5
```

## 9. How to save on bed blankets.

I moved to a new place recently and had to buy blankets and sheets. I got a nice set of bed sheets from Ikea for 48€. However, turns out that for that price I could get an even nicer set of bed sheets AND a big bed blanket in Primark... I didn't know they sell that there!

## 10. How to build a slideshow / carousel / swiper.

I thought that it would be easy peasy to do it myself... wrong! basic funcionality is easy but there are a number of edge cases: looping, auto playback, different animations... And let's not forget handling touch events.

In the end I gave up on reinventing the wheel and found a fantastic library called [Swiper](http://bit.ly/jpb-swiper) that worked perfectly out of the box! not only that but it also had a myriad of customisations that made it so flexible. In the end I could adapt it perfectly to my requirements.

## 11. How to negotiate like a professional.

A colleague recommended this super interesting book called [Never Split The Difference](http://bit.ly/jpb-never-split-the-difference), and it got me hooked until the moment I finished it. It's written by an FBI hostage negotiator and provides techniques for improving your negotiations at your every day life, specially at work.

## 12. How to track TODOs

I heard in the [Syntax podcast](http://bit.ly/jpb-syntax-podcast) about an app to track tasks for specific projects, it's really useful. It's called [Todoist](http://bit.ly/jpz-todoist) and besides being multiplatform, its free tier is more than enough
