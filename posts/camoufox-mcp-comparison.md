---
title: Picking a Camoufox MCP Server
description: Comparing five MCP servers/CLIs built on Camoufox for stealthy browser automation, and which one actually fits which job.
date: 2026-07-02
scheduled: 2026-07-02
tags: automation, mcp
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

I wanted something with better anti-detection than vanilla Playwright/Puppeteer for some scraping work, so I went looking at [Camoufox](https://camoufox.com/) — the Firefox fork with anti-detection patches baked in at the C++ level instead of bolted on with JS overrides. Turns out there isn't one obvious "the" MCP server for it, there are at least five, and they take pretty different approaches to wrapping the same underlying browser. I went through all five to figure out which one actually fit what I needed.

Full tool-by-tool CSV mapping (199 rows) is linked at the bottom if you want to cross-reference specific tool calls.

## Quick reference

| Repo | Language | Tools | Philosophy | Host OS |
|---|---|---:|---|---|
| [whit3rabbit/camoufox-mcp](https://github.com/whit3rabbit/camoufox-mcp) | TypeScript | 17 | Bounded, high-level actions to cut round-trips | Cross-platform |
| [rlgrpe/camoufox-browser-cli](https://github.com/rlgrpe/camoufox-browser-cli) | Python (FastMCP) | 21 | CLI wrapped as MCP, persistent daemon | Linux/macOS only |
| [redf0x1/camofox-mcp](https://github.com/redf0x1/camofox-mcp) | TypeScript | 47 | Split server/client, remote-friendly | Cross-platform |
| [Sekinal/camoufox-mcp](https://github.com/Sekinal/camoufox-mcp) | Python | 127 | Full Playwright surface exposed 1:1 | Docker |
| [RobithYusuf/mcp-camoufox](https://github.com/RobithYusuf/mcp-camoufox) | JavaScript | 99 | Scraping/stealth-first | Cross-platform |

That tool-count spread (17 to 127) tells you most of what you need to know before even reading code — these aren't five implementations of the same idea, they're five different bets on how much control an LLM agent actually needs.

## The three API patterns

**whit3rabbit goes bounded and high-level.** Instead of an agent chaining `click(selector)` → `fill(selector, text)` → separate round-trips, `browse` does nav-and-scrape in one call (`url`, `outputMode`, `maxChars`, `selector`, `screenshot`), and `browse_sequence` takes an array of typed actions (`click`, `hover`, `fill`, `type`, `select`, `press`, `waitFor`, `scroll`, `evaluate`) that all execute inside one browser-side pass. `browse_session_*` gives you a persistent context when you need state across calls. It's the fewest tools of the five, and honestly for most scraping tasks that's fine — you rarely need to micromanage the mouse.

**Sekinal goes granular and mirrors Playwright almost 1:1.** This is the one to reach for if you actually need fine control: `emulate_device`, `emulate_network`, `set_geolocation`, `set_timezone`, `set_locale`, `set_color_scheme` for emulation; `get_performance_metrics`, `get_navigation_timing`, `get_resource_timing`, `get_memory_info`, `get_long_tasks` for performance debugging; `mouse_drag_xy`, `mouse_wheel`, `mouse_down`, `mouse_up` for pixel-level pointer control. It also ships a VNC bridge on port `6080` so you can watch the agent drive the browser live, which is genuinely useful when something's misbehaving and you don't want to guess blind.

**RobithYusuf goes pragmatic and stealth-first.** `click_turnstile` uses Bezier-curve mouse paths specifically to beat Cloudflare Turnstile checkboxes, plus `detect_anti_bot`, `mouse_drift`, and record/replay (`mouse_record`/`mouse_replay`) for humanized paths. On the data side there's `scrape_page`, `extract_structured`, `extract_table`, and session portability via `cookie_export`/`cookie_import` and `storage_state_save`/`storage_state_load` — handy if you want to reuse a logged-in session across runs instead of re-authenticating every time.

## Where the other two fit

**rlgrpe** is basically CLI args reshaped into MCP tool calls, running against a persistent background daemon (`browser_install` / `browser_close`) — lightweight, but Linux/macOS only, so it's out if you're on Windows.

**redf0x1** splits into a server/client model (`create_tab`, `camofox_close_session`) meant for remote deployment — the browser runtime lives elsewhere, which is the right call if you're running this from something that isn't meant to host a browser (a lightweight VPS, a serverless function, etc).

## The dependency-pinning problem

Anyone shipping `camoufox-js` is fighting the same fire: recent Playwright releases (1.60+) broke navigation hooks and reject the `isMobile` flag on Firefox instances. whit3rabbit deals with it by hard-pinning `playwright-core@1.59.0` and `camoufox-js@0.10.2` in `package.json`. RobithYusuf pulls compatibility binaries dynamically at `npx` runtime instead. redf0x1 sidesteps it entirely by keeping the JS bindings server-side only, so your client never touches the pinned version at all.

On the Python side, rlgrpe's daemon just doesn't run on Windows, full stop, while Sekinal ducks the whole host-OS problem by shipping everything as a Docker container.

## What I'd actually use

* **Cloudflare/Turnstile-heavy scraping** → RobithYusuf. The dedicated Turnstile bypass and structured extraction tools are built for exactly this.
* **Debugging something that's breaking** → Sekinal. Being able to actually watch the browser over VNC while `emulate_network` throttles things beats guessing from logs.
* **Low-latency batch automation** → whit3rabbit. Sequence-based actions run inside the browser process, so you're not paying round-trip latency per step.
* **Remote/cloud hosting** → redf0x1, since the browser runtime doesn't have to live next to the agent.

For most one-shot scraping over interactive debugging, the low round-trip count on whit3rabbit's is probably the better default — you rarely need 127 tools when you mostly just need to navigate, extract, and move on.

---

Full tool-mapping CSV: [camoufox_mcp_tool_comparison.csv](camoufox_mcp_tool_comparison.csv)
