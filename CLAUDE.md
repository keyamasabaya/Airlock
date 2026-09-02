# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Airlock is a Chrome extension (Manifest v3) that puts a buffer zone between an impulse
and the action it triggers: `Ctrl+Shift+Q` opens a quick-capture popup, and if a focus
is already set, the user must answer `→ switch` / `queue` / `drop` before the new idea
can take over. It is designed first for people diagnosed with ADHD (see root
`README.md` for the full rationale and design constraints).

The extension **UI is French-only**; all code comments and documentation are English.

## Commands

There is no build step, package manager, linter, or test suite — **plain HTML/CSS/JS,
zero dependencies**. To develop:

1. `chrome://extensions/` → enable **Developer mode** → **Load unpacked** → select the
   repo root (it *is* the extension folder — `manifest.json` lives at the top level).
2. After editing any file, click **Reload** on the extension card in
   `chrome://extensions/` to pick up changes.
3. To debug the popup: right-click the toolbar icon → **Inspect popup**.
4. To debug the `claude.ai` content script or the options/methodology pages: open
   DevTools on that page normally.

If you load the extension from a different filesystem path, Chrome treats it as a
separate extension with empty storage (existing data is not lost, just not attached to
the new load).

## Architecture

`manifest.json` sits at the repo root (Chrome requires it there); everything else is
grouped by kind: `pages/` (HTML surfaces), `js/`, `css/`, `icons/`, `legal/`. HTML files
reference their scripts/styles with `../js/...` and `../css/...`, and
`chrome.runtime.getURL()` calls use paths relative to `manifest.json` (e.g.
`pages/methodology.html`), not to the calling file. There is no background service
worker — each surface talks to `chrome.storage.local` directly and they stay in sync
through `chrome.storage.onChanged` plus explicit `chrome.tabs.sendMessage` pings.

- **`pages/popup.html` + `js/popup.js`** — the airlock itself. Owns the primary state
  object under storage key `airlock_state`: `{ focus, queue, done, pending }`. All
  mutations (capture, switch/queue/drop decision, mark done, queue reordering) happen
  here, then `save()` writes to `chrome.storage.local` and pushes an `airlock_update`
  message to any open `claude.ai` tabs so the banner refreshes without a reload.
- **`js/content.js` + `css/content.css`** — injected on `https://claude.ai/*`. Renders a
  draggable floating banner (position persisted separately under `airlock_ui`, kept out
  of JSON export/import) showing the current focus. Shown on `/new` or the home page
  regardless of focus state, elsewhere only if a focus is set. Self-updates via
  `chrome.storage.onChanged`/`onMessage` and via a `MutationObserver` on `document.body`
  to catch SPA navigation (claude.ai doesn't do full page reloads). Pulses once a
  minute starting 30s after load, suppressed while dragging, on background tabs, or
  under `prefers-reduced-motion`.
- **`pages/options.html` + `js/options.js`** — reachable via right-click → Options.
  Handles JSON export/import of `{ focus, queue, done }` (with structural validation on
  import), the full "done" history (popup only shows the last 5), and a link to
  `chrome://extensions/shortcuts`.
- **`pages/methodology.html` + `js/methodology.js` + `css/methodology.css`** — Phase 3.5
  feature, built but unpublished. Left pane lists impulses (focus/queue/done), right
  pane shows a numbered methodology generated for the selected one. Generation goes
  through a native messaging host (`com.airlock.methodology`, declared via the
  `nativeMessaging` permission) that runs `claude -p` locally under the user's own
  Anthropic account — a Chrome extension cannot spawn a process itself, so native
  messaging is the only supported bridge. Off by default: with no host installed, the
  view stays inert. Only the single impulse being acted on is ever sent, never the
  queue or history. Step completion is stored back onto
  `state.methodologies[impulseText]`.
- **`legal/`** — privacy policy (EN/FR) and the French legal notice (LCEN-mandated),
  kept as Markdown; see `legal/README.md` for what still needs completing before
  publishing (legal identity fields, hosting the docs at a public URL for the Chrome
  Web Store submission).

## Storage model

Everything is `chrome.storage.local`, no server, no sync, no account:

- `airlock_state` — `{ focus: string|null, queue: string[], done: string[], pending: string|null, methodologies?: object }`. This is exactly what JSON export/import round-trips (minus `pending`, which is transient UI state).
- `airlock_ui` — banner drag position on claude.ai. Intentionally excluded from export.
- `airlock_theme` (`localStorage`, popup only) — light/dark toggle.

Permissions requested: `storage`, `nativeMessaging` (inert without the separately
installed host), and host access to `https://claude.ai/*` for the content script.

## Guiding constraints (from `ROADMAP.md`)

These are enforced project conventions, not suggestions — keep them in mind before
adding anything:

- **The popup UI does not grow.** Anything heavier belongs on the Options page.
- **No feature added in anticipation.** Features get added on proof of real need from
  actual usage, not speculatively.
- **No telemetry, no analytics, no tracking**, not even anonymised — this is the
  project's differentiating argument and must not regress.
- **`drop` stays a legitimate, penalty-free answer** — no streaks, scores, or nagging
  about abandoned items.
