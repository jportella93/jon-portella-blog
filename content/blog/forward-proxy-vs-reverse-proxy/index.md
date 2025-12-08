---
title: "Forward Proxy vs. Reverse Proxy"
spoiler: Understand the difference between forward proxies and reverse proxies, and when to use each one.
date: 2021-03-17T13:47:39.957Z
---

### Forward Proxy vs. Reverse Proxy

#### Despite having similar names, they serve different purposes. Here’s a quick guide.

![](images/0.png)

---

I came across [this really well-explained article from Cloudflare](https://www.cloudflare.com/es-es/learning/cdn/glossary/reverse-proxy/) about proxies and wanted to share it with you, in one minute.

#### Proxy Server, AKA “Forward Proxy” or just “Proxy”

A server that sits in front of the client and acts as a middleman. It intercepts the client requests and **forwards** them — hence, the name — on their behalf to another server somewhere on the Internet.

![](images/1.png)

Forward Proxy Flow, image by [Cloudflare](https://www.cloudflare.com/).

Some use cases of a Forward Proxy:

- **Block access to certain content**. A workplace network might be configured to connect through a proxy, which blocks requests to social media websites.
- **Avoid state or institutional regulations**. The opposite to the previous example: If your network blocks connections to certain websites, you can do the requests to a proxy outside of that network which will forward the request for you.
- **Hide the client’s identity**. By connecting to a website through a proxy, you could make your IP address more difficult to trace, since the final server would receive the proxy’s IP address.

If you want to put it into practice, I wrote a story about the subject, covering the last 2 use cases.

#### Reverse Proxy

Is a server that sits in front of one or more web servers and acts as a gatekeeper for incoming requests.

![](images/2.png)

Reverse Proxy Flow, image by [Cloudflare](https://www.cloudflare.com/).

Some use cases of a Reverse Proxy:

- **Load Balancing**. A Reverse Proxy can distribute incoming requests to available servers to ensure the most efficient handling.
- **Global Server Load Balancing**. If we have servers in several parts of the world, our Reverse Proxy can forward the client’s request to its closest server, ensuring faster response times.
- **Content Caching**. By distributing proxies in several parts of the world, we can cache content to achieve faster responses. The first request from a different country will be forwarded to the actual server, but subsequent requests from that country will be quickly answered with the cached content on the local reverse proxy.
- **Protection from Targeted Attacks**. By using a Reverse Proxy, the IP of our final server is never revealed, making it harder for attackers to target them with attacks such as DDoS attacks.
- **Efficient encryption**. Instead of handling computationally expensive encryptions and decryptions from our server, we can delegate that task to the reverse proxy.

---
