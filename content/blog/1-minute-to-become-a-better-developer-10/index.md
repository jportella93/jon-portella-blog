---
title: 1 Minute To Become A Better Developer (#10)
spoiler: Learn how to change public your public IP address, in one minute.
date: 2021-03-08T14:03:39.417Z
---

#### A tutorial on setting a VPN and using it from the CLI to hide our IP and location

![](images/0.png)

Art by my buddy [Loor Nicolas](https://www.instagram.com/loornicolas/)

---

#### THE PROBLEM

If you read issue #8, you already know which location information are we sharing with websites when we interact with them. If you didn’t, take a quick read first:

[**1 Minute To Become A Better Developer (#8)***Learn how to find out our public IP address and country from the command line, in 1 minute.*jportella93.medium.com](https://jportella93.medium.com/1-minute-to-become-a-better-developer-8-31692050f5b8)[](https://jportella93.medium.com/1-minute-to-become-a-better-developer-8-31692050f5b8)

So following up, now that we know about our public IP Address, it would be great if we could hide it or even change it.

Why? here’s a handful of use cases:

*  You don’t want the website you’re interacting with, your Internet Service Provider, or even your country’s government to know who’s the person interacting with that website.
*  You want to make it look like your connection comes from a different country since there aresome online services that will charge you differently depending on your country of origin. Or content that just won’t be available in your country in streaming services.
*  You want to look like a different individual, for example, if your IP has been blocked.

So how can we change our public IP address?

#### THE SOLUTION

With a [**V**irtual **P**rivate **N**etwork (VPN)](https://en.wikipedia.org/wiki/Virtual_private_network). Basically, you’ll be doing requests to the VPN’s server and that server will do the actual request for you, hiding your IP address to the final server.

There are several VPN providers out there, it’s a growing market. I’m going to explain how to use the one that has been more useful for me: Windscribe.

1. Go to [Windscribe](https://windscribe.com/) and create a free account. If you want, you can use my [referral link](https://windscribe.com/yo/kocmap80) so we both get 1GB/month for free.
2. To install the CLI in MacOS you can use [homebrew](https://formulae.brew.sh/cask/windscribe) and skip to step #5. To do it in Ubuntu add the Windscribe signing key to apt:

```
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-key FDC247B7
```

3. Add the repository to your `sources.list`:

```
echo 'deb https://repo.windscribe.com/ubuntu bionic main' | sudo tee /etc/apt/sources.list.d/windscribe-repo.list
```

4. Update apt-get and install `windscribe-cli`:

```
sudo apt-get update && sudo apt-get install windscribe-cli
```

5. Log in to Windscribe:

```
windscribe login
```

6. Connect to Windscribe:

```
windscribe connect
```

```
# Connecting to US East New York Empire (UDP:443)# Firewall Enabled# Connected to US East New York Empire# Your IP changed from xxx.xxx.xxx.xxx to 77.81.136.80
```

Now we are set! We are using the VPN and our IP has changed. To disconnect just type `windscribe disconnect`.

---

#### If we want to connect from a specific country:

1. List the available locations:

```
windscribe locations
```

2. Connect using their label. For example to connect to “Romania RO Bucharest No Vampires”:

```
windscribe connect "No Vampires"
```

3. We can double-check using the alias `whatsmycountry` that I shared with you in [issue #8](https://jportella93.medium.com/1-minute-to-become-a-better-developer-8-31692050f5b8).

```
whatsmycountry
```

```
# {#   "ip": "89.46.103.236",#   "hostname": "mx-pool236.jvlists.com",#   "city": "Bucharest",#   "region": "Bucureşti",#   "country": "RO",#   "loc": "44.4323,26.1063",#   "org": "AS9009 M247 Ltd",#   "postal": "020011",#   "timezone": "Europe/Bucharest",#   "readme": "https://ipinfo.io/missingauth"# }
```

---

