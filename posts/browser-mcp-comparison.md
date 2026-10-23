---
title: "Picking a Browser MCP Server: Twelve Options Compared"
description: Going through twelve browser-automation MCP servers and CLIs (five that drive your real Chrome, two that wrap a full agent framework, and five stealthy Camoufox builds) and figuring out which one actually fits which job.
date: 2026-10-11
scheduled: 2026-10-11
tags: automation, mcp, browser
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

A while back I went through the handful of [Camoufox](https://camoufox.com/)-based MCP servers and wrote up [which one to pick](/posts/camoufox-mcp-comparison/). That post kept getting the same follow-up question in one form or another: "okay, but what about the ones that just use my normal Chrome?" Fair. The Camoufox projects solve a specific problem (anti-detection for scraping), but plenty of people just want an agent to drive the browser they're already logged into. So this is the larger list: every browser-control MCP server I've actually looked at, twelve in total, split into three genuinely different families. The Camoufox five are still here, but now sitting next to the Chrome-session servers and the agent-framework wrappers they're usually weighed against.

Two things up front, because they change how you read the rest. First, "tool count" is not quality; it's a philosophy statement about how much the agent is allowed to micromanage the browser. Second, these three families don't compete for the same slot: one of them is a tool an LLM calls step by step, one is an agent that decides its own steps, and one is a stealth-first variant of the first. If you're comparing across families you're probably comparing the wrong things.

## Quick reference

| Repo | Language | Tools | Approach | Harness |
|---|---|---:|---|---|
| [Saik0s/mcp-browser-use](https://github.com/Saik0s/mcp-browser-use) | Python (FastMCP) | small (agent) | MCP wrapper around the browser-use agent | Own browser via Playwright |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | Python / TS | library | The agent framework itself, not an MCP server | Own / system Chrome / cloud |
| [BrowserMCP/mcp](https://github.com/BrowserMCP/mcp) | TypeScript | 12 | Drives your existing Chrome profile via extension | Your Chrome |
| [BrowserTools MCP](https://github.com/AgentDeskAI/browser-tools-mcp) | JavaScript | 16 | Observability/debugging, not clicking | Your Chrome (DevTools open) |
| [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome) | TypeScript | 26 | General assistant on your daily Chrome | Your Chrome |
| [Agent360dk/browser-mcp](https://github.com/Agent360dk/browser-mcp) | JavaScript | 40 | Your real Chrome, with a human in the loop | Your Chrome |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | TypeScript | 59 | Official DevTools team server (Puppeteer) | Own Chrome / connect / Android |
| [whit3rabbit/camoufox-mcp](https://github.com/whit3rabbit/camoufox-mcp) | TypeScript | 17 | Bounded, high-level actions to cut round-trips | Camoufox |
| [rlgrpe/camoufox-browser-cli](https://github.com/rlgrpe/camoufox-browser-cli) | Python (FastMCP) | 21 | CLI reshaped as MCP, persistent daemon | Camoufox (Linux/macOS) |
| [redf0x1/camofox-mcp](https://github.com/redf0x1/camofox-mcp) | TypeScript | 47 | Split server/client, remote-friendly | Camoufox, remote |
| [Sekinal/camoufox-mcp](https://github.com/Sekinal/camoufox-mcp) | Python | 127 | Full Playwright surface, 1:1 | Camoufox (Docker) |
| [RobithYusuf/mcp-camoufox](https://github.com/RobithYusuf/mcp-camoufox) | JavaScript | 99 | Scraping/stealth-first | Camoufox |

That 17-to-127 spread on the Camoufox side, and 12-to-59 on the Chrome side, is the whole story in one row: these aren't twelve implementations of the same idea. They're twelve different bets on how much control an LLM agent actually needs, and, on the Chrome side, how much of your real, logged-in, cookie-laden browser it's allowed to touch.

Full tool-by-tool CSVs are linked at the bottom: a 199-row capability matrix across ten of the twelve, and a 153-row per-project inventory of every registered tool.

## Family 1: the agent frameworks

These are the odd ones out, and I'm listing them first specifically so you stop comparing them tool-count to the rest.

**[browser-use/browser-use](https://github.com/browser-use/browser-use)** isn't an MCP server at all; it's the agent library underneath a bunch of them (~118k stars, Python + TypeScript). You hand it a goal and a model and it decides the clicks itself. It runs a local Playwright browser, your system Chrome via `Browser.from_system_chrome()`, or a cloud browser, and you can wire CDP for remote. The strength is raw agent power and model choice: custom actions via `@tools.action`, structured output, the BU2 model, and a Claude "browser toolset" integration. The catch is the obvious one: you build the integration, you pay for an LLM per run, and managed stealth/cloud costs money.

**[Saik0s/mcp-browser-use](https://github.com/Saik0s/mcp-browser-use)** is the MCP wrapper around that (~1k stars, MIT). It exposes `run_browser_agent` and `run_deep_research` plus skills CRUD and task/health observability, and because agent tasks run 30–120 seconds it uses an HTTP daemon on `:8383` rather than stdio (with `mcp-remote` for stdio-only clients). It needs an LLM key (twelve provider options) because it *is* an agent; the LLM picks the steps. There's a genuinely clever bit: the Skills system records a session, extracts the site's underlying "money" API call, and replays it dramatically faster than re-driving the DOM. It's labeled super alpha, and it's heavyweight, but if your problem is "go research this and come back with an answer," none of the tool-per-action servers below will do it.

The reason these two don't appear in the tool matrix below is structural: they don't expose `click_element` and `fill_input` as MCP tools for your client to orchestrate. They take a goal. Different category.

## Family 2: drive your real Chrome

This is the group people actually mean when they say "browser MCP." The pitch is identical across all of them: attach to the Chrome you're already signed into, so logins, cookies, extensions, and your fingerprint all carry over, and you avoid re-authenticating or tripping bot checks. They differ in how they attach, how much they expose, and how much rope they give the model.

**[BrowserMCP/mcp](https://github.com/BrowserMCP/mcp)** (BrowserMCP.io, Apache-2.0, ~7.2k stars, 12 tools) is the one that started the "use your existing profile" idea, adapted from Microsoft's Playwright MCP to target your live browser instead of a fresh instance. It works, but I'd be careful recommending it for new work: the repo is only a handful of commits, can't be built standalone (it depends on a private monorepo), and appears to have gone quiet since around April 2025. Historically important, practically superseded.

**[AgentDeskAI/browser-tools-mcp](https://github.com/AgentDeskAI/browser-tools-mcp)** (BrowserTools MCP, MIT, ~7.3k stars, 16 tools) is the odd one out in this family because it mostly *doesn't* click things. It's an observability tool: it streams console logs and errors, network logs and errors, storage, the selected element, and page info, and runs Lighthouse audits (accessibility, performance/Core Web Vitals, SEO, best practices) against the page you're looking at. You open DevTools (F12) and it reads what's happening. The v2 rewrite tightened security a lot (loopback-only, per-run auth token, credentials scrubbed, cookies opt-in), which matters because v1.x had a critical vulnerability, so upgrade if you're on it. If your job is "tell me why this page is broken," this is the right family member. If your job is "click through this flow," it's the wrong tool entirely.

**[hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome)** (MIT, ~12.5k stars, 26 tools) is the feature-rich generalist. It's a Chrome extension-based server (Streamable HTTP on `:12306`, or stdio) that drives your daily Chrome with no separate browser process. The tool surface is broad: windows and tabs, navigation, element and full-page screenshots, network capture and a debugger, raw HTTP requests, content and interactive-element extraction, console, click/fill/keyboard, bookmarks, history, plus a semantic search across your open tabs backed by a local vector DB. There's even a visual editor for Claude Code and Codex. It's the direct competitor to Agent360 below: more features, less safety.

**[Agent360dk/browser-mcp](https://github.com/Agent360dk/browser-mcp)** (MIT, ~53 stars, 40 tools) is newer and smaller but takes the most interesting angle: human-in-the-loop. Its `browser_ask_user` overlays a prompt on *your* screen for 2FA, CAPTCHA, or credentials, then continues the same signed-in session, which is exactly how you handle a site with no API and a login you can't automate cleanly. It also does CAPTCHA solving (reCAPTCHA v2/v3, hCaptcha, Turnstile), CORS bypass via `browser_fetch`, provider token-extraction guides (Stripe, HubSpot, Slack), combobox and date handling, iframe support, file upload, and network waiting, with up to 20 concurrent agents each in a color-coded tab group. It's also honest about limits (background-tab input, `:hover`, untrusted events) instead of pretending everything succeeds. Caveats: Windows wasn't verified at the time of writing, and the local bridge is unauthenticated on loopback.

I actually verified Windows since, and the thing worth flagging isn't in the tool count: nothing stops you from driving Agent360 with a plain client SDK instead of an agent, at which point there's no LLM call per run at all, you script the browser the same way you'd script against an API, just with hand-written field-fill logic instead of a model deciding each step. I used it this way to drive a real, already-logged-in Brave profile through a multi-step form end to end (dropdowns, a date picker, a handful of field types), with zero model calls and the real session's cookies intact. That's what makes it a genuine alternative to Camoufox on a non-headless desktop you don't want to hand a separate automation profile to, you keep your real login, and you're not paying for or waiting on an LLM for deterministic steps you can just write down. One real gotcha from doing this: tool calls (including the initial handshake) can hang indefinitely with no error at all, so put a timeout and retry-on-a-fresh-session around every call yourself.

**[ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)** (Apache-2.0, ~53k stars, 59 tools) is the official Chrome DevTools team server, and it's the one I'd trust with CI. It's Puppeteer-based and launches its own Chrome by default (Chrome 136+ blocks remote debugging on your default profile anyway), though it can connect to a running instance or an Android device. It has the deepest debugging surface here: performance traces with CrUX insights, network analysis, screenshots, console with source-mapped stack traces, and reliable auto-waiting automation. `--slim` and `--headless` modes keep it light for basic tasks. Because it's Google-maintained and stable it's the recommended base for building a browser *subagent*, the trade-off being it's the weakest at "reuse my logged-in session," which is the entire reason the other four exist. Note the privacy default: it sends usage stats and optional CrUX data unless you pass `--no-usage-statistics` and `--no-performance-crux`.

That "weakest at reusing my logged-in session" line isn't theoretical, I went looking for a way around it before settling on Agent360, and every path dead-ended the same way. `--remote-debugging-port` relaunch means killing and relaunching your whole multi-profile browser, not just opening a debug socket next to it. Chrome 144's `chrome://inspect/#remote-debugging` "automatic connection" promises exactly this but hits an undocumented 404 in practice. And `--autoConnect` itself, per the CLI's own docs, only targets Chrome's own default-profile path by channel name (`stable`/`beta`/`canary`/`dev`), it has no concept of Brave, or of a second Chrome profile, so it doesn't generalize to "attach to the specific already-logged-in browser instance I'm looking at" at all. Copying the live profile's cookies into a fresh automation profile technically works, but duplicating session state into a second location just to satisfy a debugging protocol is the kind of workaround that creates its own security question. If your whole requirement is "drive the real desktop browser I'm already signed into, non-headless, without spinning up or cloning a profile," chrome-devtools-mcp is not that tool no matter how good its debugging surface is, that's the gap Agent360's extension-bridge approach actually closes.

## Family 3: the stealthy Camoufox ones

If Family 2 is about driving a browser you already trust, this family is about a browser that doesn't want to be recognized. Camoufox is a Firefox fork with anti-detection patched in at the C++ level rather than bolted on with JavaScript overrides, and there are five MCP wrappers around it. These keep their own section because they're solving a different problem: not "reuse my session," but "look like a normal human on a site that hates automation."

**whit3rabbit** goes bounded and high-level (17 tools). `browse` does nav-and-scrape in a single call, and `browse_sequence` takes an array of typed actions (`click`, `hover`, `fill`, `type`, `select`, `press`, `waitFor`, `scroll`, `evaluate`) that all execute in one browser-side pass, so you're not paying a round-trip per step. Fewest tools of the five, and for most scraping that's a feature.

**Sekinal** goes granular and mirrors Playwright almost 1:1 (127 tools): emulation (`emulate_device`, `emulate_network`, `set_geolocation`, `set_timezone`, `set_locale`, `set_color_scheme`), performance debugging (`get_performance_metrics`, `get_navigation_timing`, `get_resource_timing`, `get_memory_info`, `get_long_tasks`), and pixel-level pointer control (`mouse_drag_xy`, `mouse_wheel`, `mouse_down`, `mouse_up`). It also ships a VNC bridge on `:6080` so you can watch the agent drive the browser live, genuinely useful when something misbehaves and you don't want to guess blind. Ships as Docker, which sidesteps host-OS problems entirely.

**RobithYusuf** goes pragmatic and stealth-first (99 tools): `click_turnstile` uses Bezier-curve mouse paths specifically to beat Cloudflare Turnstile checkboxes, alongside `detect_anti_bot`, `mouse_drift`, and record/replay for humanized paths. On the data side there's `scrape_page`, `extract_structured`, and `extract_table`, plus session portability via `cookie_export`/`cookie_import` and `storage_state_save`/`storage_state_load`.

The other two are narrower bets. **rlgrpe** is CLI args reshaped into MCP tools against a persistent background daemon (`browser_install`/`browser_close`). Light, but Linux/macOS only, so it's out on Windows. **redf0x1** splits into a server/client model meant for remote deployment, where the browser runtime lives somewhere other than the agent, the right call if you're driving this from a lightweight VPS or serverless function.

## What the tool matrix actually shows

I mapped ten of these twelve against each other capability-by-capability (the two agent frameworks are excluded because their tool surface is a goal, not a command list), and the split is cleaner than I expected. It's in the [comparison CSV](/posts/browser_mcp_tool_comparison.csv) (199 rows) if you want to cross-reference, but the shape of it:

- **Assertions and verification are almost Camoufox-only.** `verify_value`, `verify_text_visible`, `verify_element_hidden`, `assert_url_matches`, `assert_text_present`. The Chrome-session servers mostly don't expose self-checking tools. If your workflow needs the agent to confirm a state rather than assume it, that's a real gap on the Chrome side.
- **Humanization lives on the Camoufox side.** `humanize_type`, `humanize_click`, `mouse_drift`, record/replay mouse paths, `click_turnstile`. The Chrome-session servers drive your real browser and lean on the fact that your real browser already looks human; they don't synthesize human motion, because they don't need to.
- **Debugger and CDP depth is Chrome-side.** Heap snapshots and memory summaries, CSS-computed styles for the selected element, network request detail, performance traces and CrUX, emulation presets, and Lighthouse audits are things the Camoufox wrappers largely don't do. `chrome-devtools-mcp` alone owns most of this.
- **Human-in-the-loop is Chrome-side only.** `browser_ask_user` and `browser_provide_feedback` have no Camoufox equivalent, which makes sense, since a headless stealth context has no human watching it.
- **Batch/sequence execution is Camoufox-side.** `browse_sequence` and friends collapse a multi-step flow into one round-trip; the Chrome servers mostly expect one tool call per action.

The per-project inventory is the other CSV: [browser_mcp_tool_calls_by_project.csv](/posts/browser_mcp_tool_calls_by_project.csv), 153 rows covering every registered tool across the five Chrome-session servers (BrowserMCP.io 12, BrowserTools 16, mcp-chrome 26, Agent360 40, chrome-devtools-mcp 59). One thing that file caught: BrowserMCP.io defines a `drag` tool in its snapshot module but never registers it in the server entrypoint, so it doesn't actually exist at runtime, a nice little tell about how much attention that repo is getting.

## The dependency-pinning problem (still not fixed anywhere)

Anyone shipping `camoufox-js` is fighting the same fire: recent Playwright releases (1.60+) broke navigation hooks and reject the `isMobile` flag on Firefox instances. whit3rabbit hard-pins `playwright-core@1.59.0` and `camoufox-js@0.10.2`; RobithYusuf pulls compatibility binaries dynamically at `npx` runtime; redf0x1 sidesteps it by keeping the JS bindings server-side only. On the Python side, rlgrpe's daemon simply doesn't run on Windows, while Sekinal dodges the host-OS question by shipping Docker.

The Chrome-session family has the opposite set of constraints, mostly around security posture and freshness rather than pinning: BrowserTools needed a v2 to fix a critical v1 vuln, Agent360's bridge is unauthenticated loopback and Windows-unverified, BrowserMCP.io looks abandoned, and chrome-devtools-mcp is the only one with an actual platform team behind it. The "official and boring" option being the most trustworthy here is not a coincidence.

## What I'd actually use

- **Give my client a research/automation agent** → Saik0s/mcp-browser-use (as MCP) or browser-use directly (as a library). Nothing else on this list takes a goal instead of a command.
- **Drive my logged-in Chrome like a user, safely** → Agent360. The human-in-the-loop overlay is the thing that makes 2FA/CAPTCHA/login flows actually finish instead of stalling.
- **Script a real, non-headless, already-logged-in session with no LLM in the loop, no profile cloning** → Agent360 again, driven directly instead of through an agent. If chrome-devtools-mcp's profile-attach limits rule it out and Camoufox's separate-browser model is more than you need, this is the slot.
- **Feature-maximal assistant on my real Chrome** → hangwin/mcp-chrome, as long as you're comfortable giving it that much surface.
- **Debug/audit the page I'm looking at** → BrowserTools MCP for monitoring, chrome-devtools-mcp for performance traces.
- **CI / headless / official support** → chrome-devtools-mcp. It's the only one I'd bet on staying maintained.
- **Cloudflare/Turnstile-heavy scraping** → RobithYusuf.
- **Watching something break in a stealth context** → Sekinal (VNC bridge).
- **Low-latency batch scraping** → whit3rabbit's sequence actions.
- **Remote/cloud-hosted browser runtime** → redf0x1.
- **Skip for new work** → BrowserMCP.io (largely unmaintained, not standalone-buildable).

If I had to pick exactly one for a general-purpose coding agent, it'd be chrome-devtools-mcp for the maintenance guarantee and debug depth, and I'd reach for a Camoufox server only when the site's bot detection is the actual problem, not the first option.

---

Full capability matrix (199 rows, ten projects): [browser_mcp_tool_comparison.csv](/posts/browser_mcp_tool_comparison.csv)

Per-project tool inventory (153 tools, five Chrome-session servers): [browser_mcp_tool_calls_by_project.csv](/posts/browser_mcp_tool_calls_by_project.csv)
