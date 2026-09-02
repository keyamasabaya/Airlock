# Airlock

**Airlock is a Chrome extension (Manifest v3) that puts a buffer zone between an
impulse and the action it triggers.** You hit `Ctrl+Shift+Q`, type the thought that
just hijacked you, press Enter — and Airlock makes you answer one question instead of
letting you dive in: *does this go first?*

It is built first and foremost as a **practical, everyday tool for people diagnosed
with ADHD**. Everything in it — the shortcut, the single text field, the three-way
decision, the passive reminder — exists to reduce the cost of a specific, well-known
difficulty: an idea arrives, it feels urgent, and by the time you surface from it the
thing you were actually doing is gone.

> Airlock is not a medical device, a therapy, or a substitute for professional care.
> It is an ordinary productivity tool whose design choices were made for ADHD brains
> rather than adapted to them afterwards.

The extension is plain HTML/CSS/JS with zero dependencies and zero build step — this
repository root **is** the extension folder, the one to select in `chrome://extensions/`
in developer mode.

| | |
|---|---|
| Roadmap by phases | [`ROADMAP.md`](ROADMAP.md) |
| Privacy & legal notice | [`legal/`](legal/) |

## Who this is for

Airlock is aimed at anyone whose attention gets hijacked mid-task, and it was designed
around the way that happens with **ADHD** in particular:

- **Impulse-driven task switching.** The new idea doesn't feel like a distraction, it
  feels like the most important thing in the world. Airlock doesn't try to argue with
  that — it takes the idea seriously, writes it down, and asks you to rank it.
- **Working memory that won't hold the queue.** An unwritten intention is a lost
  intention. Capture has to happen in the two seconds you have, not after opening an
  app and picking a project.
- **Task initiation and "what was I doing?"** One single focus is always visible, so
  coming back doesn't require reconstructing your own state from scratch.
- **Out of sight, out of mind.** The banner on `claude.ai` re-shows your current focus
  at the exact moment a new conversation is about to pull you elsewhere.
- **The guilt of the abandoned list.** `drop` is a first-class answer with no penalty.
  There is no streak, no score, and no backlog quietly accusing you.

If you don't have ADHD and simply want less context switching, it works fine for you
too. The priorities just weren't set by you.

## How the design follows from that

Each rule below is a constraint, not a preference. They are what keeps the tool usable
on a bad day.

| Design rule | What it's for |
|---|---|
| **One keyboard shortcut, one field, Enter** | Capture must cost less than acting on the impulse, or it won't happen |
| **Exactly one active focus** | No re-prioritising a whole list; the decision is always binary against a single incumbent |
| **Three answers: `→ switch`, `queue`, `drop`** | A bounded choice instead of an open-ended planning session |
| **`drop` is legitimate** | Discarding an idea is a valid outcome, not a failure to be tracked |
| **No due dates, no projects, no tags, no account** | Every extra field is a place to stall |
| **No notifications, no streaks, no score, no time tracking** | Nothing that turns the tool into another source of pressure |
| **Heavy things live on the Options page** | The popup stays small enough to use without thinking |
| **Auto-promotion of the next item on ✓** | Finishing something shouldn't require deciding what's next |

## What it is not

Airlock is **not a task manager**. There is no project to pick, no due date, no
priority field, no assignee, no account to create, no sync, no AI reordering your work
for you. It holds one focus, an ordered queue, and a short history of what you
finished today. That's the whole model.

## Install (2 min)

1. Clone the repo somewhere stable, e.g. `~/extensions/airlock/`.
2. Open Chrome at `chrome://extensions/`
3. Turn on **Developer mode** (toggle, top right)
4. Click **"Load unpacked"**
5. Select the cloned repo folder
6. Pin the extension to the toolbar (puzzle icon, then the pin)

> **Important when you update later.** Run `git pull` **inside the folder that is
> already loaded**, then click "Reload" on the extension card. Your data is kept.
> If you load it from a **different path**, Chrome treats it as a different extension
> and you start from empty storage — your data isn't destroyed, but it stays attached
> to the old path.

## Usage

`Ctrl+Shift+Q` opens the airlock from any tab.

**No focus set yet** → what you type becomes your focus.

**A focus is already running** → Airlock asks the only question that matters,
*does this go first?*

| Answer | Effect |
|---|---|
| **→ switch** | The new impulse becomes the focus, the old one goes to the front of the queue |
| **queue** | The impulse waits its turn, your current focus is preserved |
| **drop** | Discarded, and that's perfectly fine |

**Focus finished** → click ✓. It moves to "done today" and the first queued item
automatically takes its place.

In the queue, each item has three buttons: `→` promotes it to focus, `↑` moves it up,
`×` deletes it.

### Keyboard shortcut

`Ctrl+Shift+Q` by default. If it's already taken by another extension or an app,
change it at `chrome://extensions/shortcuts`.

Two limitations that come from Chrome, not from the extension:

- The shortcut only works while Chrome is the active application.
- For a shortcut that works even without focus on Chrome, you need `Ctrl+Shift+[0-9]`.

## Reminder on claude.ai

A discreet banner appears at the top of the page:

- On **claude.ai/new** or the home page — it reminds you of your current focus before
  you dive into a new conversation. If you have no focus, it suggests setting one first.
- On an **existing conversation** — it only shows if you have a current focus, to avoid
  visual clutter.

Dismissible with one click on the cross. No conversation content is ever read.

## Options page

Right-click the extension icon → **Options**. The popup stays deliberately minimal;
everything heavier lives here:

- **JSON export** of your data (focus, queue, history) — your backup
- **JSON import** to restore an export
- **Full history** of completed items (the popup only shows the last 5)
- **Direct link** to `chrome://extensions/shortcuts` to change the shortcut

## Your data & principles

- **Local-first** — everything is stored in `chrome.storage.local`. No server, no
  account, no sync, no telemetry, no analytics. The extension asks for the `storage`
  permission plus host access to `claude.ai` for the reminder banner, and nothing else.
- **One deliberate exception** — the optional assisted-methodology feature (Phase 3.5)
  runs `claude -p` locally through a native messaging host you install yourself. It is
  off by default; without the host, no network call is ever made. When enabled, only
  the single impulse you act on is sent — never the queue, never the history. See the
  privacy policy for details.
- **Lightweight popup** — anything heavy goes on a separate Options page.
- **No feature in anticipation** — we add on proof of real need, not on the assumption
  of one.

For a backup, use the JSON export on the Options page.

## Interface language

The extension **interface is French only**; all documentation is in English. Localising
the UI via `chrome.i18n` is a Phase 2 exit item and is tracked in the
[roadmap](ROADMAP.md).

## Modifying the code

Plain HTML/CSS/JS, zero dependencies, zero build step. Edit, go to
`chrome://extensions/`, click "Reload" on the extension card.

| File | Role |
|---|---|
| `manifest.json` | Configuration (Manifest v3) — must stay at the repo root |
| `pages/popup.html` + `js/popup.js` | The airlock — main UI |
| `pages/options.html` + `js/options.js` | Options page — export/import, history |
| `pages/methodology.html` + `js/methodology.js` + `css/methodology.css` | Assisted-methodology view (Phase 3.5) |
| `js/content.js` + `css/content.css` | Banner injected on claude.ai |

## Repository layout

| Path | Contents |
|---|---|
| `manifest.json` | Extension configuration (Manifest v3) — Chrome requires it at the extension's root |
| `pages/` | The three HTML surfaces: popup, options, methodology |
| `js/`, `css/` | Their scripts and stylesheets |
| `icons/` | Extension icons, referenced from `manifest.json` |
| `legal/` | Privacy policy (EN/FR) and the French legal notice, in Markdown |

Packaging, Store-submission assets, the hosted legal pages, and the optional
native-messaging bridge for the assisted-methodology feature are kept out of this
public repository and maintained separately.

## Status

Phase 0 (foundations) and Phase 1 (validation through personal use) are complete.
Phase 2 (polish before publication) is in progress. Two later phases were built out of
sequence and remain unpublished: the assisted methodology (3.5) and the redesigned
`claude.ai` banner (3.6).

The extension is **not published on the Chrome Web Store yet** and runs unpacked in
developer mode. See the [roadmap](ROADMAP.md) for the entry and exit condition of each
phase.

## Licence

MIT — see [LICENSE](LICENSE).
