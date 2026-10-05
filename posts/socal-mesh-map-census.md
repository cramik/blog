---
title: "I Pointed 13 SoCal Mesh Map Sites at the Same Bounding Box and Counted Nodes"
description: Reading through the JS bundles of a dozen-plus public mesh-network map sites to find each one's real data API, then filtering all of them to the same Southern California bounding box to see which actually shows the most nodes.
date: 2026-10-05
scheduled: 2026-10-05
tags: mesh-networking, data, scraping
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

Southern California has a surprising number of public mesh-network maps. Some are built on Meshtastic (LoRa radios, MQTT-aggregated), some on MeshCore (a newer LoRa protocol with its own map ecosystem), one on AREDN (amateur-radio mesh built on repurposed WiFi APs and bridges, reflashed to run on ham bands instead of consumer WiFi channels), one on Reticulum/RNS. Every one of them has its own idea of "SoCal," its own default zoom, its own cherry-picked viewport screenshot that makes it look appropriately busy. None of that tells you which one actually has the most nodes in a given area, because they're never showing you the same area.

So I started from a list of 15 mesh map URLs, picked one bounding box, and pointed all of them at it. Two of the fifteen (`map.meshcore.dev`, which just redirects to `map.meshcore.io`, and `meshcore.co.uk/map.html`, which iframes it) turned out to be the same dataset wearing a different hostname, so they're folded into `map.meshcore.io`'s entry below rather than listed as their own rows.

## The list

- rns.wcmesh.com/socal/
- cvcorescope.wcmesh.com
- livemap.wcmesh.com/socal/
- map.meshcore.io
- map.wcmesh.com
- mapping.kg6wxc.net (AREDN)
- meshmap.net
- meshmapper.net
- meshtastic.liamcottle.net
- meshview.socalmesh.org
- meshview.world
- rmap.world (Reticulum/RNS)
- socal.meshmapper.net

None of these expose a "give me nodes in this bbox" parameter in any consistent way (a couple don't expose it at all), so the actual approach was: open each site's JS, find the real fetch call underneath the Leaflet/MapLibre markers, hit that endpoint directly, pull everything it has, and filter to the box myself.

## The bounding box

Rather than eyeball something, I used the broadest span that still reads as "Southern California" without creeping into "the whole state" — the 10-county definition: Imperial, Kern, Los Angeles, Orange, Riverside, San Bernardino, San Diego, San Luis Obispo, Santa Barbara, Ventura.

```
lat:  32.5 – 36.0 °N
lon: -121.0 – -114.1 °W
area: ≈ 246,700 km²
```

Several sites' own default map centers (LA basin, 33.8–34.2°N / −118.0 to −118.3°W, zoom 10–12) sit comfortably inside this box, which is a reasonable sanity check that it isn't too tight.

## Finding the real API in each one

This is the part that actually took the time. A few examples of what "reading the JS" turned up:

- **meshtastic.liamcottle.net** — plain REST, `axios.get('/api/v1/nodes')`, returns a JSON array with `latitude`/`longitude` as `1e7`-scaled integers (standard Meshtastic protobuf convention).
- **map.meshcore.io** — no REST endpoint at all. The map pulls from `https://map.meshcore.io/api/v1/nodes?binary=1&short=1`, a **MessagePack-encoded binary blob** (65k nodes, 19MB), with field names shortened to single letters (`n` = name, `t` = type, `la` = last_advert) to save bytes. Decoding it meant downloading their own bundled `msgpackr` ESM module and running it directly in Node against the raw bytes.
- **rns.wcmesh.com** and **livemap.wcmesh.com** — both are white-labeled instances of the same "MeshMapper" platform (`data-coverage-api-url="https://meshmapper.net"` baked into the page's config attributes), hitting a `/socal/snapshot` endpoint that returns a live MQTT-fed object keyed by device ID.
- **socal.meshmapper.net** — a different data shape from the above despite the shared "MeshMapper" branding: `fetch('?ajax=1&request=map_data&lat=...')`, returned through Cloudflare *only* with a browser-like `User-Agent` header (a bare `curl` gets a silent 403). The payload isn't a node list, it's a **wardrive log** — repeated signal-observation points over time, meant for coverage-heatmap rendering, not a live roster.
- **meshmapper.net** (the bare root domain, as opposed to `socal.meshmapper.net`) turned out to be a region-picker/chat portal, not a node map at all — its only discoverable endpoint was a `live_regions` chat ping feed. Its actual SoCal node data lives one level down, at the `socal.meshmapper.net` subdomain.
- **mapping.kg6wxc.net** — the odd one out protocol-wise (AREDN, not LoRa). Data ships as a 13MB **literal JS file**, `data/map_data.js`, with top-level `var` assignments instead of pure JSON (`allDevices = {...};`). Easiest way to parse that safely is `vm.runInContext()` rather than regex-munging it into valid JSON.
- **meshview.world** turned out to be an aggregator of other Meshview instances, `meshview.socalmesh.org` included — of its 572 in-box nodes, 545 are literally re-published from `meshview.socalmesh.org`'s own feed.

## Results

Nodes with a position, inside the bbox, as of 2026-10-05:

| Site | Protocol | Raw in bbox | Unique in bbox | Notes |
|---|---|---:|---:|---|
| socal.meshmapper.net | MeshCore (wardrive log) | 23,184 | **5,379** | Raw points are repeated signal observations, not distinct radios; deduped by public key (or rounded coords when no key) |
| map.wcmesh.com | MeshCore (public feed) | 1,479 | **1,479** | Of 4,975 total nodes in the feed, 2,893 have any location at all |
| map.meshcore.io | MeshCore (official map) | 1,172 | **1,172** | Out of 64,999 nodes worldwide |
| rns.wcmesh.com/socal | MeshCore (live snapshot) | 810 | **810** | Already deduped by device ID server-side |
| livemap.wcmesh.com/socal | MeshCore (live snapshot) | 810 | **810** | Same backend software as rns.wcmesh.com, independent live moment |
| meshtastic.liamcottle.net | Meshtastic (global) | 578 | **578** | Out of 31,348 nodes worldwide (18,124 with any position) |
| meshview.world | Meshtastic (aggregator) | 572 | **572** | 545 of these are re-published from meshview.socalmesh.org |
| meshview.socalmesh.org | Meshtastic (SoCal instance) | 559 | **559** | Out of 848 tracked nodes, 571 with position |
| mapping.kg6wxc.net | AREDN (ham WiFi mesh) | 416 | **416** | Out of 1,211 "mappable" devices; can include distant tunnel-linked nodes |
| meshmap.net | Meshtastic (global) | 201 | **201** | Out of 9,784 nodes worldwide |
| cvcorescope.wcmesh.com | MeshCore (analytics) | 66 | **66** | Out of 984 total tracked, skews further north (Central Valley/Monterey) than SoCal |
| rmap.world | Reticulum/RNS (global) | 10 | **10** | Out of 782 nodes worldwide |
| meshmapper.net | MeshCore (portal) | n/a | n/a | Root domain has no node-list API; see socal.meshmapper.net |

Raw and unique match for every site except `socal.meshmapper.net`, since it's the only one serving a point-observation log instead of a node/device list.

**Winner, on raw node count:** `socal.meshmapper.net`, at 5,379. But that number needs the asterisk it's getting — it's a cumulative wardrive/coverage log, not a live snapshot, so it's counting every distinct radio ever heard in the box, not what's online right now. It isn't a fair fight against the live node lists above it.

**Winner among actual live maps:** `map.wcmesh.com`, at 1,479, followed by `map.meshcore.io` at 1,172.

## Caveats worth keeping in mind

- `rns.wcmesh.com` and `livemap.wcmesh.com` run identical front-end software and returned near-identical counts from two live snapshots taken seconds apart — one data point, not two.
- `meshview.world` substantially re-publishes `meshview.socalmesh.org`'s own numbers, so treat the two as correlated, not additive.
- Several of these (liamcottle, meshmap.net, map.meshcore.io, rmap.world) are genuinely global trackers; their SoCal slice is a small fraction of a much bigger worldwide total, which is in the table above for context.
- Cross-protocol totals don't sum to anything meaningful — a MeshCore node and a Meshtastic node are different radios on different networks, not duplicate sightings of the same device, so there's no "grand total node count across SoCal mesh" to report here, just per-map, per-protocol numbers.

**Raw data**: [socal-mesh-map-census.csv](socal-mesh-map-census.csv) — every row above with both the protocol family and the specific sub-variant, plus the exact note text used to derive each number.
