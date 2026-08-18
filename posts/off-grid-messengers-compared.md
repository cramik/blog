---
title: "Four Ways to Message Off-Grid: Briar, Knit, and bitchat Compared"
description: Cloning and reading through Briar, Knit, bitchat, and bitchat-android to see how each actually handles background execution, offline delivery, mesh transport, and crypto.
date: 2026-08-18
scheduled: 2026-08-18
tags: mesh-networking, security, android, ios
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

There's a small cluster of open-source apps that promise to let you message people without cell service, wifi, or a server anyone controls — bouncing encrypted messages phone-to-phone over Bluetooth, or picking them up later from a dead-drop. I'd seen four of them mentioned around enough times that I wanted to actually read the code instead of the marketing copy: **Briar**, **Knit**, and **bitchat**, which ships as two sibling implementations — one Swift for iOS/macOS, one Kotlin for Android — sharing a wire protocol but not always the same behavior.

They're all solving the same problem — off-grid messaging without central infrastructure — but the actual engineering underneath is surprisingly different. Here's what I found going through background execution, offline delivery, mesh transport, and crypto in each.

## Quick reference

| | Briar | Knit | bitchat (iOS) | bitchat-android |
|---|---|---|---|---|
| Transport model | Pairwise, trust-graph + Tor | Flood mesh (BLE + Wi-Fi Aware) | Flood mesh (BLE only) | Flood mesh (BLE + Wi-Fi Aware) |
| Offline delivery | Self-hosted Tor "mailbox" dead-drop | DB-backed store + anti-entropy digest sync | Sender outbox + physical/virtual couriers + Nostr | In-memory cache + Nostr fallback |
| Handshake | BQP (Curve25519 DH + commitment) | X3DH-style (3x X25519 DH) | Noise XX | Noise XX |
| Forward secrecy | Per-transport-time-period key rotation | Per-epoch ratchet (~200 msgs/24h) | Per-message (live), weaker offline | Per-message (live) |
| Platform | Android + desktop headless | Android only | iOS/macOS | Android |

## Off-grid doesn't have to mean mesh

Worth getting this out of the way first, because it shapes everything else: these four split into two transport models for the same underlying goal.

Knit and both bitchats are genuine flood/relay meshes — your phone forwards other people's traffic, hopping messages across strangers' radios until they reach their target. Briar isn't built that way. Every connection it makes — Tor, Bluetooth, local wifi, even a USB drive — goes directly to a specific contact you've already added; nothing relays through a stranger's device. It uses Tor for the reach a radio mesh gets from hopping, and a gossip mechanism for forum/group content that spreads only across your existing mutual contacts. Both are legitimate answers to "off-grid messaging without a server," they just make opposite trade-offs between reaching strangers and keeping the trust circle small.

## Staying alive in the background

Nobody's found a loophole around Android's rules here — Briar, Knit, and bitchat-android all converge on the same shape: a foreground `Service`, a persistent low-priority notification, a boot receiver, and a prompt asking the user to exempt the app from battery optimization. The differentiation is in how smart each one is about *when* to actually burn radio power scanning:

- **Knit** has an oddly clever heuristic — besides an inexact ~15-minute `AlarmManager` heartbeat, it registers a one-shot `TYPE_SIGNIFICANT_MOTION` sensor trigger, on the theory that if your phone just moved, you might have walked near new peers.
- **bitchat-android** has the most granular scheme of the four: a `PowerManager` singleton resolves battery/foreground state into one of four power modes, each mapping to specific BLE scan windows — down to 1-second-on/59-second-off when backgrounded with no peers connected.
- **Briar** mostly just polls contacts on a jittered timer, but it's the only one of the three with dedicated onboarding screens for fighting Huawei's and Xiaomi's specifically aggressive battery managers — a good sign of how much OEM-specific pain this problem actually causes in practice.

bitchat on iOS doesn't get any of these levers. Apple's background BLE rules are stricter across the board, so the whole story is CoreBluetooth's built-in state-restoration API — `CBCentralManagerOptionRestoreIdentifierKey` and friends — which lets the app rebuild its Bluetooth link state after iOS suspends and relaunches it in the background. There's no Android-style fine-grained scheduling available to reach for.

## Reaching someone who isn't there right now

This is where the four diverge the most, and two mechanisms are worth sitting with: Briar's **mailbox** and bitchat's **courier** system.

A Briar mailbox is small self-hosted infrastructure — a spare phone, a cheap VPS — running as a Tor hidden service, that a user sets up themselves as a drop-box contacts can leave messages in. The implementation is neat: it's literally just another `SimplexPlugin`, reusing the same `FilePlugin` base class as Briar's removable-USB-drive transport. Each contact gets an isolated inbox/outbox folder pair and a private auth token that grants folder access only, never decrypt or sign capability — so the mailbox operator sees rough timing and blob sizes and nothing else. It can go offline and stall your delivery, but it can't read or forge anything.

bitchat's courier mechanism solves the same "recipient isn't reachable right now" problem completely differently: any nearby phone running bitchat can carry a sealed, opaque envelope on behalf of someone it might later run into, with a spray-and-wait copy budget (starts at up to 8 copies, halved on each handoff) substituting redundancy-across-strangers for Briar's one-chosen-relay reliability. It's a genuinely inventive idea — it can deliver between two devices that were never online at the same time, with zero setup. But the project's own docs (`docs/PEER-ID-ROTATION.md`) admit a real flaw: the day-rotating tag couriers use to figure out who an envelope is for is an HMAC over the recipient's *public* key, which gets broadcast in cleartext in every announce packet — so any passive listener, not just an actual courier, can precompute and correlate a peer's tags across days. Content integrity in both systems is equally solid (a tampered message just fails to decrypt in either design, no silent corruption); the real difference is that Briar's relay is infrastructure you specifically chose, while bitchat's is an anonymous population of strangers' phones, and that choice is exactly what determines how contained the metadata leakage stays.

Separately, durability varies a lot: Knit's `forward_store` (Room + SQLCipher) and bitchat-iOS's outbox both persist to encrypted disk and survive a restart. bitchat-android's `StoreForwardManager` currently caches everything in plain `ConcurrentHashMap`s — force-close the app and whatever was queued is gone. Knit's redelivery mechanism is the most sophisticated of the four: instead of re-flooding cached messages at a newly-seen neighbor, it exchanges a short digest of held message IDs and only sends the delta — an actual anti-entropy sync, not a blind re-push, which means a mesh that's already converged does close to zero extra work.

## Would any of this hold up in a crowd?

None of the four projects publish load-test numbers, so take this section as reasoning from the code and known radio constraints, not a measured result.

The real ceiling is almost certainly Bluetooth's connection-count limit, not any relay algorithm. A BLE central can only hold a handful of GATT connections open at once — bitchat-android's code caps it explicitly at 8 — so a crowd of a few hundred phones fragments into many small, overlapping clusters no matter how clever the software is. That's the actual reason multi-hop relay exists at all.

At small scale — a handful to a few dozen devices in one cluster — Knit, bitchat, and bitchat-android should all behave comparably; there isn't enough redundant chatter yet for their different rebroadcast-suppression strategies to matter. They diverge more in the tens-to-hundreds range, which is a regime all three explicitly designed for (bitchat-android's own decay curve names both a `≤10` and a `>100` peer threshold):

- **bitchat-iOS** uses the cleanest approach on paper: each node relays to a deterministic, hash-seeded subset of size `⌈log₂(neighbor count)⌉` rather than all its neighbors — rebroadcasts scale logarithmically instead of linearly.
- **Knit** cancels a pending relay if it overhears enough neighbors already relaying the same message within a jitter window — self-limiting, but without the same clean asymptotic bound.
- **bitchat-android** just dials the relay probability down as peer count climbs (1.0 at ≤10 peers, decaying to 0.4 past 100) — the crudest of the three, but also the cheapest to compute and reason about.

Wi-Fi Aware (used by Knit and bitchat-android, not iOS) helps throughput for a given exchange — useful for attachments — but its data-path negotiation is one-active-exchange-at-a-time in Knit's implementation, so it doesn't raise how many simultaneous peers a device usefully meshes with. Whichever relay algorithm wins on paper, I'd bet the actual bottleneck at a real crowd scale is BLE connection fragmentation, common to all three, well before any of these suppression strategies start mattering.

Briar sidesteps this whole class of problem, because it was never sharing a radio channel among strangers in the first place — its scaling limits are the number of contacts one device polls and how much load a mailbox server can take, both ordinary infrastructure problems rather than radio-physics ones.

## Security, briefly

All four get the primitives right — modern AEAD ciphers, X25519/Curve25519 agreement, Ed25519 signatures, nothing home-rolled. Where they differ is forward-secrecy granularity, which turns out to be a spectrum shaped by each project's delivery model rather than a simple better/worse ranking:

- **bitchat's live BLE sessions** use a from-scratch Noise XX implementation with hourly/10k-message rekeying — per-message forward secrecy while both sides are actually connected.
- **Knit** deliberately implements an epoch ratchet instead of a full Double Ratchet, rotating every ~200 messages or 24 hours, and its own design docs explain why: a chained root would leave permanent, unrecoverable gaps once store-and-forward eviction discards an entire epoch's worth of cached frames, so each epoch derives independently off a static session root instead.
- **Briar** rotates transport-level keys per time period, tied to each transport's expected latency plus a 24-hour clock-skew allowance — forward secrecy at the session/transport granularity rather than per-message.
- **bitchat's offline/courier path** is the weak point of the bunch by the project's own admission — one-way Noise X with no forward secrecy in the documented baseline, though the shipped code actually implements an opportunistic one-time-prekey upgrade the whitepaper still calls "future work" when a verified prekey bundle happens to be cached. A rare case of the implementation being ahead of the docs instead of the usual reverse.

Two more things worth flagging because they're the kind of detail you only find by reading code instead of README files: bitchat's own whitepaper is refreshingly blunt that "metadata is the weakest part of this design, and the peer ID does not help" — the sender ID is derived from a static key hash and never rotates, so a passive listener can track a device across locations over time; there's a drafted fix with test vectors that's simply not shipped yet. And bitchat-android's README claims Argon2id for channel-password derivation, but the actual code uses PBKDF2-HMAC-SHA256 at 100k iterations — correctly matching iOS, just not matching what the README says it does. Worth checking the code, not the marketing, before trusting any specific claim from a project like this.

## Where that leaves things

Briar is the most institutionally mature of the four — Dagger DI, a database migration chain running to nearly 50 versions, reproducible Docker builds so published APKs can be verified against source — and it gets there by deliberately keeping its trust surface small: pairwise contacts, no ad-hoc relay through strangers. Knit is the newest and, in some ways, the most cryptographically deliberate, with real thought put into the specific hard problem of combining forward secrecy with storage that has to evict old messages. bitchat's two versions are the most ambitious in scope — physical message-carrying couriers are a genuinely novel idea — paired with the most publicly candid self-assessment of the group, admitted weaknesses included. None of these are better or worse versions of the same app; they're four different, defensible answers to what "off-grid messaging" should trade away.
