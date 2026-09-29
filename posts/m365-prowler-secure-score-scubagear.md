---
title: "Prowler vs. Microsoft Secure Score vs. ScubaGear: Three M365 Audits, Same Tenant"
description: I ran an open-source CSPM, Microsoft's own scoring engine, and CISA's ScubaGear baseline against the same mostly-default M365 tenant to see how much they actually agree on.
date: 2026-09-28
scheduled: 2026-09-28
tags: microsoft-365, security, compliance
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

There are at least three different ways to ask "is this Microsoft 365 tenant configured securely?", and they don't agree with each other nearly as much as you'd hope. I've got a test tenant I use for poking at M365 tooling deliberately left close to Microsoft's defaults, no hardening pass applied and it seemed like a good excuse to actually run all three side by side instead of just trusting whichever one I happened to reach for first:

- **[Prowler](https://github.com/prowler-cloud/prowler)** - the open-source CSPM, which added an M365 provider a while back alongside its AWS/Azure/GCP checks.
- **Microsoft Secure Score** - the recommendation engine baked into the Microsoft 365 Defender portal.
- **[ScubaGear](https://github.com/cisagov/ScubaGear)** - CISA's tool for assessing a tenant against its own M365 Secure Configuration Baselines.

Since a test tenant like this one is basically Microsoft's out-of-the-box configuration with a handful of users dropped in, it's a decent stand-in for "what does a tenant look like before anyone's gone through and hardened it," which turns out to be exactly the gap each of these tools is trying to close, just from different angles.

## Getting ScubaGear running

If you haven't used it before, ScubaGear is a PowerShell module, and setup is refreshingly small:

```powershell
Install-Module -Name ScubaGear -Scope CurrentUser
Import-Module ScubaGear
Initialize-SCuBA
```

`Initialize-SCuBA` pulls down the PowerShell modules ScubaGear depends on (Microsoft Graph, Exchange Online Management, MicrosoftTeams, powershell-yaml) and installs [Open Policy Agent](https://www.openpolicyagent.org/), which is what actually evaluates the Rego policies behind each baseline control, into a `.scubagear` folder in your home directory.

It only runs on Windows PowerShell 5.1. That's a hard requirement tied to some of its underlying libraries, not a version they haven't gotten around to bumping yet, so there's no point fighting it into PowerShell 7.

From there, kicking off a full scan is one line:

```powershell
Invoke-SCuBA -ProductNames * -M365Environment commercial
```

That pops interactive sign-in windows one at a time (Graph first, then Exchange Online, Teams, and SharePoint) and drops an HTML report plus raw CSV/JSON results into a timestamped folder. Worth noting: whatever account you sign in with needs enough read access to reach every product you're asking about. I didn't have Exchange/Security Reader on the account I used, and the run silently skipped the Exchange Online and Defender baselines rather than erroring, so if a product's missing from your output folder, that's the first thing to check.

## The headline numbers

Three tools, three different ways of counting, so these aren't directly comparable, but they're a useful gut-check on how out-of-the-box this tenant really was.

| Tool | Scope this run | Result |
|---|---|---|
| Prowler | 164 checks across Entra ID, SharePoint, admin center, Defender | 78 failing (1 critical, 33 high, 42 medium, 2 low) |
| ScubaGear | 67 CISA baseline controls across Entra ID, SharePoint, Teams, Power Platform | 29 failing, 12 warnings, 14 passing |
| Secure Score | 4 category exports (identity, apps/mail, data, devices) | 38 open, tenant-policy-level recommendations |

Roughly half of everything either tool checked was still sitting on a default. That's the expected shape for a tenant nobody's gone through with a checklist yet, which is sort of the point of running it this way.

One caveat before the numbers get more granular: Prowler evaluates several conditional access checks once *per policy*, not once per tenant. If you've got six conditional access policies that all forget to require token protection, that's six failing rows in Prowler's CSV for one underlying gap. Once you collapse duplicates, those 78 failing rows are actually 58 distinct checks. That's the number I used for everything below, so a "Prowler: 5" isn't secretly hiding a single check repeated five times.

## Breaking it down by category

Instead of "78 vs. 29 vs. 38," here's the same findings sorted into the themes each tool actually targets. The three tools don't share a check library, so this is a best-effort crosswalk rather than an exact match, but it gives a much better sense of *where* each one is looking than the topline counts.

| Category | What it covers | Prowler | ScubaGear | Secure Score |
|---|---|---|---|---|
| Risk-based conditional access | Detecting and blocking risky sign-ins and risky users automatically | 3 | 2 of 3 fail | 2 |
| MFA, auth methods & credential hygiene | MFA enforcement, phishing-resistance, stale/leaked credentials | 5 | 5 fail, 3 warn of 9 | 2 |
| CA: session, device & token controls | Sign-in frequency, managed-device rules, token/session-theft protection | 21 | N/A | N/A |
| App registration & consent governance | Who can register apps, what they can ask users to consent to | 5 | 2 of 3 fail | 0 (zero-weight) |
| Privileged role management (PIM) | Time-bound, approved, alerted-on admin roles vs. standing access | 2 | 6 fail, 1 warn of 9 | N/A |
| Device registration & management | Entra-joined device defaults: local admin, LAPS, BitLocker, join limits | 6 | Not a baseline product | N/A |
| Group, guest & tenant creation governance | Who can create groups, guest accounts, or tenants unapproved | 5 | 0 of 3 fail | N/A |
| Hybrid identity & directory sync | On-prem/cloud identity sync configuration | 1 | N/A | N/A |
| Admin portal & license hygiene | Admin account licensing, who can reach admin portals | 3 | N/A | N/A |
| SharePoint external sharing & guest permissions | What external users/guests can access or re-share | 4 | 3 of 3 fail | N/A |
| SharePoint link, session & auth settings | Default link permissions, expiration windows, modern auth | 1 | 5 of 5 fail | 2 |
| Teams external access & governance | Federation, anonymous meeting access, app/email integrations | Not assessed | 3 fail, 5 warn of 20 | 3 |
| Power Platform governance | Who can create environments, whether DLP policies exist | Not assessed | 3 of 9 fail | N/A |
| Exchange Online & Defender for Office | Anti-phishing, anti-spam, mail flow, mailbox auditing | 1 | Not in this run | 26 |
| Endpoint threat visibility | Defender for Endpoint visibility into credential exposure | 1 | Not a baseline product | N/A |
| Data classification / Purview | Sensitivity labeling and classification policy coverage | Not assessed | Not a baseline product | 3 |

A few things jump out just from the shape of that table. Prowler's single biggest bucket (21 unique checks) is conditional access session/device/token controls, an area ScubaGear's baseline barely touches; CISA cares whether risk-based CA and MFA exist at all, not the finer-grained policy hygiene Prowler goes after. Flip it around and ScubaGear is the only one of the three with real depth on privileged role lifecycle (PIM) and the only one that looks at Power Platform at all. And Secure Score's 26-item Exchange/Defender for Office bucket dwarfs everything else in this table; it's clearly the deepest lens on mail security, for the obvious reason that Microsoft owns both the product and the scoring engine.

## Where all three actually agree

Out of everything, only two themes got flagged by every single tool. I'd treat unanimous findings like these as the highest-confidence, do-first items on any tenant, test or not:

**Identity Protection risk policies aren't turned on.** Prowler failed three separate checks around sign-in risk and user risk conditional access policies; ScubaGear's `MS.AAD.2.1v1` and `MS.AAD.2.3v1` failed for the same reason; and it's the single largest point value in the whole Secure Score export (+10.6% each for enabling sign-in risk and user risk policies).

**MFA is enabled, but not the phishing-resistant kind.** All three tools noticed a gap between "MFA exists" and "MFA is actually good." Prowler flagged the absence of a conditional access policy requiring phishing-resistant MFA for admins; ScubaGear's `MS.AAD.3.1v1`/`3.2v1`/`3.6v1` failed on the same requirement; and Secure Score only gave partial credit (4.2 out of 9 points) for the MFA recommendation it does track.

## Where two out of three agree

A step down in confidence, but still solid: Prowler and ScubaGear lined up almost exactly on **SharePoint and OneDrive**. Prowler failed five separate checks (external sharing unrestricted, guest re-sharing allowed, OneDrive sync permitted from unmanaged devices, and modern auth not required), while ScubaGear failed every single one of its eight SharePoint controls (`MS.SHAREPOINT.1.1` through `3.3`): external sharing, default link permissions, and link expiration/reauth windows. Secure Score touches the edges of this (inactive session sign-out, modern auth for SharePoint apps) but doesn't score external sharing directly, so it shows up as a partial rather than a third confirmation.

Same story with **app registration governance**: non-admins can register apps, user consent isn't locked down, and there's no admin consent workflow. Prowler and ScubaGear both catch it; Secure Score lists a related item but at zero score weight, since it already credits a related, already-completed control elsewhere.

## What only one tool caught

This is the part that actually justifies running more than one of these:

**Only Prowler** flagged that Microsoft Defender for Endpoint wasn't enabled at all, which meant Defender XDR's Security Exposure Management had no visibility into whether any privileged user's credentials showed up on a risky device. Worth being precise about what this is: it's not a confirmed exposure, it's a blind spot; the check fails because there's nothing to evaluate without MDE turned on in the first place. Still the tenant's single "critical" severity finding, and neither of the other two tools does this kind of device-threat correlation at all.

**Only ScubaGear** went deep on Entra Privileged Identity Management, recording six separate CISA "Shall" failures around role activation approval, alerting, and permanent vs. time-bound privileged assignments. Neither Prowler nor Secure Score has an equivalent check. It's also the only one of the three that assesses Power Platform at all (environment creation restrictions, DLP policy), which is easy to forget even exists until a baseline tool goes and checks it.

**Only Secure Score** surfaces Purview sensitivity labeling, and it's not a small miss. Publishing a data classification policy alone is worth +22% in that export, and the full label rollout (auto-labeling, extending it into the Purview data map) is worth +44% combined, more points than anything else in the entire dataset. Neither CSPM tool looks at Purview at all. Secure Score also carries a long tail (26 items) of Defender for Office anti-phishing detail: impersonation protection, quarantine actions, mailbox auditing, Safe Links. ScubaGear would probably mirror some of that if it had Exchange access on this run, but doesn't right now.

## Takeaways

None of these three tools is wrong, exactly; they're just answering different questions with different depth. Prowler and ScubaGear largely agree where they overlap, which is reassuring: an independent CSPM and a government baseline converging on the same failing controls is a decent signal that those controls are actually worth fixing first. But each one also has a real blind spot the others don't cover (such as Prowler's device-threat correlation, ScubaGear's Entra PIM and Power Platform depth, or Secure Score's Purview and Defender for Office detail), so picking just one and calling it done leaves real gaps.

If you're doing this for real: fix what's unanimous first (risk-based conditional access, phishing-resistant MFA), then go through the two-out-of-three items (external sharing, app consent), and don't skip re-running ScubaGear with full Exchange/Security Reader access; that one gap in this run's permissions is hiding an entire baseline's worth of results.