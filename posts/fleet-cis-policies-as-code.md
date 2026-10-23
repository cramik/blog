---
title: Fleet Will Bulk-Import a Thousand Policies, But It Won't Tell You That From the UI
description: Fleet's web UI only lets you add policies one at a time, and the GitOps docs talk about YAML conversion in the abstract. The actual bulk-import path is a CLI-only feature that isn't surfaced anywhere you'd naturally find it.
date: 2026-10-23
scheduled: 2026-10-23
tags: fleet, mdm, compliance, security
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

Fleet's Policies page has an "Add policy" button. Click it, and you get a form: name, description, query, resolution, one at a time. If you've got a benchmark with a thousand controls in it (say, the CIS Benchmark for Windows 11), that UI is telling you, pretty clearly, to go click that button a thousand times.

That's not actually true. Fleet policies are defined by a plain YAML spec (`apiVersion`, `kind: policy`, `spec: {name, query, description, resolution, platform, critical}`), and `fleetctl apply -f <file>` will take a file with as many of those as you want and create or update all of them in one shot. It's genuinely one command for however many hundreds of policies are in the file. The problem isn't that this doesn't exist, it's that there's a real gap between where you'd learn this is possible and where you'd actually go looking.

## Where the UI points you, and where the docs point you

The web UI's "Add policy" flow is single-record only, there's no "import" or "upload YAML" button anywhere in Policies. If you only ever interact with Fleet through the browser, there's no path from that screen to "you can define a thousand of these in a file and apply them at once."

Fleet's own policy-as-code / GitOps documentation does talk about YAML and automation, but at the level of "here's the schema, here's how GitOps drives your Fleet config from a repo." The explanation is abstract and aimed at people already committed to running Fleet via a GitOps pipeline (a whole separate setup: a repo, CI, `fleetctl apply` wired into a workflow). It reads as *infrastructure for managing Fleet declaratively*, not as *the thing you'd reach for to bulk-load a benchmark on an afternoon*. Nothing connects "here's the YAML schema" to "and therefore, here's how you'd dump an existing large policy set in one command outside of a full GitOps setup."

So you end up with the UI implying one-at-a-time is the only way, and the docs implying bulk-apply is only relevant if you've already bought into GitOps, when actually `fleetctl apply -f policies.yml` just works standalone, logged in with a regular user account, no pipeline required.

## What it looks like once you know to look for it

A policy spec is nothing unusual: a `SELECT` query, a name, a description, a remediation note.

```yaml
apiVersion: v1
kind: policy
spec:
  name: CIS - Ensure 'Device Enumeration Policy' is set to 'Block all (most restrictive)'
  platform: windows
  description: 'This policy is intended to provide additional security against external DMA-capable devices...'
  resolution: To establish the recommended configuration via configuration profiles, set the following Settings Catalog path to Block all (most restrictive). Dma Guard\Device Enumeration Policy
  query: SELECT 1 FROM registry WHERE path = 'HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\DeviceInstall\Settings\DeviceEnumerationPolicy' AND data = '0';
  tags: framework:CISv8.1, benchmark:win11, level:BL, platform:windows, category:dma-guard, requirement:standard, critical:false, control:device-enumeration-policy-is-block-all, cis_safeguard_ids:CIS28.1
  purpose: Enforcement
---
```

Stack as many of those as you want in one file, separated by `---`, and:

```powershell
fleetctl config set --address https://your-fleet-instance.example.com
fleetctl login --email you@example.com --password "..."
fleetctl apply -f bl_win11_intune.yaml
```

```
[+] applied 34 policies
```

No GitOps repo, no CI job, no YAML pipeline, just a logged-in `fleetctl` session and one command. It's idempotent too: apply upserts on policy name, so re-running it after editing the file just updates the existing policies instead of duplicating them. Once applied, they show up in the regular Policies UI exactly like a policy someone clicked "Add" to create: pass/fail evaluated automatically on Fleet's normal schedule against every matching host, no different from any other policy. The bulk-import is invisible after the fact; it's only the *path to get there* that's missing from the UI.

## The one thing worth knowing before you do this

Policies in Fleet are platform-scoped (and team-scoped), not host-scoped. Applying a `platform: windows` policy file runs it against *every* Windows host Fleet manages, not just the one machine you had in mind when you went looking for this. That's the expected behavior for something meant to give you fleet-wide coverage, but it's worth knowing before you dump a thousand new rows into a shared Policies dashboard that other people also look at: plan the scope of what you're applying, not just whether you can.

## `fleetctl delete -f` does not undo this

If you apply a file and then decide you want it gone, the obvious move is `fleetctl delete -f <same file>`. Don't bother: for `kind: policy` specs it's a silent no-op. It runs without printing an error, exits cleanly, and the policies are all still sitting there unchanged. Watching the actual HTTP calls it makes (`--debug`) confirms why: it only ever hits `GET /config` and `GET /version`, never touching the policies endpoint at all. Apparently `delete` only knows how to handle `config`/`fleet` kind specs, not policies, and it fails silently instead of telling you that.

The real way to remove a batch of applied policies is the REST API directly:

```bash
curl -X POST "https://your-fleet-instance.example.com/api/v1/fleet/global/policies/delete" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"ids": [1,2,3, ...]}'
```

Grab the IDs from `GET /api/v1/fleet/global/policies` first. There's no delete-by-name or delete-by-file option, it's strictly a list of numeric policy IDs, so if you applied the file as a clean slate (nothing else in the Policies list), the IDs are just whatever contiguous range `apply` created.
