---
title: I Scraped Half a Million Credly Badges, Here's What's In There
description: Scraping Credly's public badge pages at scale and breaking down who actually issues all these certifications.
date: 2026-08-14
scheduled: 2026-08-14
tags: data, scraping
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

Credly hosts the "digital badge" pages for a huge chunk of the certification industry — AWS, Cisco, CompTIA, PMI, random corporate LMS courses, all of it. Every earned badge gets its own public page at `credly.com/badges/<uuid>` with the badge name, issuer, description, and who it was issued to. I got curious how big that dataset actually is and what it would tell me about who's handing out credentials and how, so I built a scraper and pointed it at as much of Credly as I could reach.

After crawling and cleaning it up, I ended up with **486,578 issued badges** covering **21,343 unique certifications** from **2,251 distinct issuers**. Every badge on Credly is tagged with a cost — `free`, `paid`, or `none` (meaning Credly just doesn't have pricing info for it) — so I split the numbers three ways.

## The dataset

| | Issued badges | Unique certifications |
|---|---:|---:|
| Free | 62,415 | 4,738 |
| Paid | 182,733 | 6,187 |
| None (no price listed) | 241,430 | 10,439 |
| **Total** | **486,578** | **21,343** |

The gap between "issued badges" and "unique certifications" is the interesting part — it's the difference between counting every time someone earned a badge versus counting how many distinct badges exist. A badge issued to 20,000 people only counts once in the second column.

The cost buckets actually sum to 21,364 — 21 certifications carry two different cost tags, so they get counted once per bucket. As distinct certifications there are 21,343.

## Who actually issues these

Ranked by unique certifications (so one issuer spamming the same badge to thousands of people doesn't inflate their count):

| Issuer | Unique certs | Issued badges |
|---|---:|---:|
| IBM | 2,193 | 28,963 |
| SAP | 940 | 4,470 |
| The Linux Foundation | 562 | 8,547 |
| Broadcom | 458 | 3,550 |
| Cisco | 442 | 211,984 |
| Microsoft | 418 | 38,463 |
| Coursera | 395 | 9,884 |
| EY | 351 | 1,449 |
| Oracle | 313 | 3,290 |
| APMG International | 206 | 1,647 |

The interesting outlier here is Cisco. It's the biggest issuer in the whole dataset by a mile — 211,984 issued badges, more than five times the next-biggest issuer (Microsoft, 38,463) — yet it only has 442 distinct certifications. That means each Cisco cert is issued to ~480 people on average. Cisco's catalog is a small set of mega-badges (NetAcad courses, CCNA-level certs) minted for enormous cohorts, not thousands of one-off badges.

The issued-vs-unique ratio is basically a catalog-size meter. IBM runs a sprawling catalog — 2,193 distinct certs spread over 28,963 issued badges, ~13 people per cert on average. SAP is the most extreme long tail: 940 distinct certs from just 4,470 issued badges, barely five people per cert. At the other end, Amazon Web Services Training and Certification squeezes 28,257 issued badges out of just 136 distinct certs (~208 per cert), and Microsoft's 38,463 issued badges come from 418 certs (~92 per cert). Same playbook as Cisco: a handful of foundational certs, issued at industrial scale.

## Free vs. paid vs. none, by issuer

Splitting the top issuers out by cost bucket shows some clearly different business models:

* **Cisco** leans heavily on `paid` and `none` (185 paid / 153 none / 110 free unique certs) — a mix of free intro badges and gated certification exams.
* **Microsoft, AWS Training and Certification, and CompTIA** are 100% `none` — Credly just doesn't have pricing data tied to their programs.
* **Scrum.org** is 100% `paid` — all 17 of their unique certs are tagged paid.
* **SAFe by Scaled Agile** is almost entirely `none` (67 of 73), a near-total mirror of Cisco's split but skewed the other way.

Full CSVs with every issuer are linked at the bottom if you want to dig through the long tail — there are 2,251 issuers total, and the top 10 above only cover about 29% of the unique-cert volume. Once you dedup to distinct certifications, the long tail matters a lot more than the raw badge-id numbers suggest.

## Poking at the data yourself

I built a quick random-badge picker out of the deduplicated dataset — hit it, filter by free/paid/none, and it'll show you a real badge name, image, and issuer pulled at random: [cramik.github.io/credly.html](https://cramik.github.io/credly.html)

---

**Raw stats**: [issuer_stats_all_issued.csv](issuer_stats_all_issued.csv) (every issued badge, by issuer) and [issuer_stats_dedup_certs.csv](issuer_stats_dedup_certs.csv) (deduplicated by unique certification), both broken down by free/paid/none.
