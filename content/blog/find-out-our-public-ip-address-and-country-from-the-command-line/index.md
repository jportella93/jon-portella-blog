---
title: Find Out Our Public IP Address and Country From the Command Line
spoiler: A quick explanation and a couple of handy one-liners
date: '2021-03-04T13:53:57.939Z'
hasNewsletterBeenSent: true
---

![Presentation image](./images/0.png)

---

#### THE PROBLEM

Every device connected to the Internet has an assigned IP Address (Internet Protocol Address), which is made up of 4 numbers in the following format: `<number>.<number>.<number>.<number>`. Each number can be in the range of 0–255. e.g. `184.152.81.47` .

When computers communicate with each other over the Internet or via a local network, the information sharing is done through IP addresses. Like physical addresses, they offer a location to send information to.

Your **public IP address** is an external-facing IP Address that’s provided by your Internet Service Provider (ISP).

So we are sharing this valuable piece of information with every website we interact on the Internet, which can be used to identify us and our country of origin…

But, how can we **find out our Public IP address from the command line**?

#### A SOLUTION

Here’s a one-liner using the free service from `api.ipify.org`:

```shell
curl -w "\n" -s https://api.ipify.org
# 116.164.32.81
```

For our comfort, let’s save this in an [alias](https://www.unixtutorial.org/create-alias-in-unix-shell/) our or `~/.bashrc` or `~/.zshrc`:

```shell
alias whatsmyip='curl -w "\n" -s https://api.ipify.org'
```

**Now that we know our public IP address, let’s find out its country of origin.** We can pipe the alias result to another free service `ipinfo.io` that does a geo lookup:

```shell
curl ipinfo.io/$(whatsmyip)
```

Even better, also save an alias for this:

```shell
alias whatsmycountry='curl ipinfo.io/`whatsmyip`'
```
