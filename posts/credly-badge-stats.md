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

After crawling and cleaning it up, I ended up with **486,578 issued badges** covering **387,664 unique certifications** from **2,251 distinct issuers**. Every badge on Credly is tagged with a cost — `free`, `paid`, or `none` (meaning Credly just doesn't have pricing info for it) — so I split the numbers three ways.

## The dataset

| | Issued badges | Unique certifications |
|---|---:|---:|
| Free | 62,415 | 44,072 |
| Paid | 182,733 | 158,492 |
| None (no price listed) | 241,430 | 185,100 |
| **Total** | **486,578** | **387,664** |

The gap between "issued badges" and "unique certifications" is the interesting part — it's the difference between counting every time someone earned a badge versus counting how many distinct badges exist. A badge issued to 20,000 people only counts once in the second column.

## Who actually issues these

Ranked by unique certifications (so one issuer spamming the same badge to thousands of people doesn't inflate their count):

| Issuer | Unique certs | Issued badges |
|---|---:|---:|
| Cisco | 209,073 | 211,984 |
| Microsoft | 27,928 | 38,463 |
| Amazon Web Services Training and Certification | 18,234 | 28,257 |
| IBM | 17,727 | 28,963 |
| Coursera | 6,350 | 9,884 |
| The Linux Foundation | 5,257 | 8,547 |
| Project Management Institute | 4,743 | 6,667 |
| CompTIA | 4,059 | 5,000 |
| SAFe by Scaled Agile, Inc. | 3,968 | 6,190 |
| SAP | 3,076 | 4,470 |

Cisco isn't just first, it's not close — it accounts for over half of every unique certification in the entire dataset. That tracks with how NetAcad and Cisco's badge program work: they mint a new distinct badge per course/module/cohort instead of reusing one badge across years, which inflates the unique-cert count relative to how many people actually earned something.

The issued-vs-unique gap also tells you something about how each issuer runs their program. Cisco's ratio is close to 1:1 (211,984 issued for 209,073 unique certs) — mostly one-off badges. Microsoft's is closer to 1.4:1, and AWS Training and Certification's about the same — a smaller number of popular badges getting issued to a lot of people over and over, which is what you'd expect from something like an AWS foundational cert versus a one-time Cisco course badge.

## Free vs. paid vs. none, by issuer

Splitting the top issuers out by cost bucket shows some clearly different business models:

* **Cisco** leans heavily on `none` and `paid` (117,174 paid / 77,358 none / 14,541 free unique certs) — a mix of free intro badges and gated certification exams.
* **Microsoft, AWS Training and Certification, and CompTIA** are 100% `none` — Credly just doesn't have pricing data tied to their programs.
* **Scrum.org** is 100% `paid` — every single one of their 2,116 unique certs is tagged paid.
* **SAFe by Scaled Agile** is almost entirely `none` (3,901 of 3,968), a near-total mirror of Cisco's split but skewed the other way.

Full CSVs with every issuer are linked at the bottom if you want to dig through the long tail — there are 2,251 issuers total and the top 10 above only cover about two-thirds of the unique-cert volume.

## Poking at the data yourself

I built a quick random-badge picker out of the deduplicated dataset — hit it, filter by free/paid/none, and it'll show you a real badge name, image, and issuer pulled at random: [cramik.github.io/credly.html](https://cramik.github.io/credly.html)

---

**Raw stats**: [issuer_stats_all_issued.csv](issuer_stats_all_issued.csv) (every issued badge, by issuer) and [issuer_stats_dedup_certs.csv](issuer_stats_dedup_certs.csv) (deduplicated by unique certification), both broken down by free/paid/none.
