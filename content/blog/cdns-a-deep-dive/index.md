---
title: CDNs — A Deep Dive
spoiler: You’ve used them before but you’re not completely sure what they are, here are some answers.
date: 2021-04-21T23:45:16.803Z
---

### CDNs — A Deep Dive

#### You’ve used them before but you’re not completely sure what they are, here are some answers.

![](images/0.png)

Single server versus Content Delivery Network (CDN) by [Kanoha](https://en.wikipedia.org/wiki/File:NCDN_-_CDN.png) on Wikimedia Commons

### What is a CDN?

A **Content Distribution **(or Delivery) **Network **(**CDN**) is a group of servers distributed geographically with the purpose of providing fast delivery of Internet content.

The CDN's servers act as reverse proxies for your origin servers, where the content is hosted.

Servers are contained in facilities called **Points of Presence** (**PoP**), which are spread around the globe.

### How does a CDN work?

Servers in a CDN can help provide a better user experience by caching content closer to the user and delivering it instead of the origin server.

This reduces the **Round Trip Time (RTT)** which is the number of milliseconds (ms) it takes for a browser to send a request and receive a response back from a server.

![](images/1.png)

Without CDN vs with CDN by [Imperva](https://www.imperva.com/learn/performance/what-is-cdn-how-it-works/)

#### **Without CDN**

1. A user in Barcelona, Spain opens her browser and navigates to [http://example.com/](http://example.com/). The browser does an HTTP request `GET http://example.com/index.html`
2. The website is hosted on a server based in Boston, United States, so the request has to travel across the Atlantic ocean and be processed by the origin server. Then, the server’s response has to travel back to Barcelona.
3. This causes a **high RTT** and a **suboptimal UX**.

#### **With CDN**

1. A user in Barcelona, Spain opens her browser and navigates to [http://example.com/](http://example.com/). The browser does an HTTP request `GET http://example.com/index.html`
2. When a user requests an asset, the DNS routes the request to the best performing PoP location, which usually is the geographically closest one to the client.

At this point, there are 2 possible outcomes:

- **The asset is available:** A non-stale copy of the requested asset is present in the PoP’s cache servers, so the asset is sent back to the user directly, resulting in a **shorter RTT**, hence a better UX.
- **The asset is NOT available**: The PoP’s server re-routes the request to the origin server, which sends back a fresh version of the asset. The PoP’s server caches the asset and sends it back to the user. This time the RTT is longer but subsequent requests for this asset in this region will be faster since the asset is now available in the PoP’s cache servers.

The asset remains cached on the PoP’s cache server until the **time-to-live (TTL)** specified by its HTTP headers expires.

### Pros/cons of using a CDN?

The most obvious benefit is the **better UX **caused by the **faster RTT **that comes with using cached content in proximity to the user.

Beyond that, using a CDN can result in **increased uptime** on a website. Imagine a traffic overload or a hardware failure that incapacitates your origin server. Having cached content on the distributed CDN’s servers can prevent interruptions on the service for end-users. Moreover, since the content is redundant in the CDN’s servers, a failure in one PoP can be saved by the content on another PoP.

Another benefit is that by serving cached content, **bandwidth costs on the origin server are reduced**. However, the CDN provider might charge a substantial fee, making this benefit tiny, so take this point _with a grain of salt_!

Also, it is worth noting that some CDN providers, by leveraging the reverse proxy configuration, are crossing to other services. Some use the CDNs distributed configuration to provide **protection againstDistributed Denial of Service(DDOS) attacks**. Also, they may implement load balancers to avoid overloading origin servers with huge amounts of traffic.

### Which types of CDNs exist?

At the time of writing, there are 6 major types of CDN:

- **Free** CDNs, whose task is to serve open source packages. E.g. jsDelivr.
- **Commercial** CDNs, provide their services to the public at a cost. E.g. Cloudflare.
- **In-House **CDNs, launched by companies whose business model makes commercial CDN options not worth their costs, so they roll out their own private CDN. E.g. Netflix.
- **Telco **CDNs, launched by Telecommunications Service Providers (TSPs) in order to serve their own streaming content without leasing commercial CDNs. They’re similar to In-Hose CDNs. E.g. Verizon.
- **Peer to Peer** (P2P) CDNs, used to share assets between individuals who are equally privileged in the application, or peers. E.g. BitTorrent.
- **Multi** CDNs, leverage the power of several other CDNs. E.g. MetaCDN.

### Why don’t CDNs come by default in web hosting?

When CDNs were starting to appear in the late 90s, they were really expensive so not all organizations could afford them.

Nowadays, the reductions in cost have made CDNs a more accessible option, and many hosting providers actually offer CDN services as a checkbox add-on.

### Thanks for reading!

Hope you found it interesting. If you want to learn more, you can find the resources I used to research this topic in the next section. The Imperva one is really well explained.

Keep learning, and have a good day!

Jon Portella

---

### Resources

- [Content delivery network — Wikipedia](https://en.wikipedia.org/wiki/Content_delivery_network)

- [What is a CDN? | How do CDNs work? — Cloudflare](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)

- [What is a content delivery network (CDN)? — Azure](https://docs.microsoft.com/en-us/azure/cdn/cdn-overview)

- [What is a CDN? How does a CDN Work? — Imperva](https://www.imperva.com/learn/performance/what-is-cdn-how-it-works/)

- [CDN Infrastructure Architecture and Topology — Imperva](https://www.imperva.com/learn/performance/cdn-architecture)

- [What Is a Multi CDN? — KeyCDN](https://www.keycdn.com/support/what-is-a-multi-cdn)
