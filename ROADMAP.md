# Roadmap — Airlock

This roadmap has **no dates and no version numbers**. Each phase has an entry condition
and an exit condition. You move to the next one when the previous one is validated by
real usage, not by the calendar.

---

## Phase 0 — Foundations

**Status: done**

- Minimal popup: capture, focus, queue, decision (switch / queue / drop), mark done
- Passive banner on claude.ai (focus reminder on /new, nudge when no focus is set)
- `Ctrl+Shift+Q` shortcut
- 100% local storage (`chrome.storage.local`)
- Legal documents written (privacy policy EN/FR, French legal notice)
- Placeholder icons

**Exit condition:** the extension is installable and works locally.

---

## Phase 1 — Personal use and concept validation

**Status: validated**

**Entry condition:** Phase 0 complete.

**Single objective:** verify that the author actually uses the extension in their own
daily workflow.

**To do:**
- Install the extension unpacked
- Use it daily without adding anything to it
- Keep a short log of the friction encountered (a `.md` file is enough)
- Note what is genuinely missing versus what would merely be "nice"

**Validation criteria to move on:**
- Sustained use (near-daily capture) over a period long enough that it isn't just a
  novelty effect
- At least one concrete case where it prevented a context switch — an impulse captured
  instead of dived into
- Not uninstalled out of weariness

**Failure criteria:**
- Use stops after a few days → back to the drawing board, the airlock concept does not
  work as it stands
- It gets used but does not reduce context switching → same conclusion

**No additional feature is added until this phase is validated.**

---

## Phase 2 — Technical polish before publication

**Entry condition:** Phase 1 validated by usage.

**To do:**

- **Final icons** (generated from the prepared prompt, validated at 16px)
- **Minimal Options page**, reachable by right-clicking the icon: *(done)*
  - JSON export of all data (focus, queue, done)
  - JSON import
  - Shortcut reconfiguration via a direct link to `chrome://extensions/shortcuts`
  - Readable list of the full "done" history, beyond the last 5
- **Privacy policy and legal notice** hosted with a stable URL
- **Complete the legal notice** (legal status, host, licence)
- **Clear user README** *(done)*
- **Screenshots** (3 max, telling: problem → capture → prioritisation) *(done)*
- **Chrome Store description**, short and long *(done)*
- **Cross-OS testing**, at minimum on Windows and one other OS
- **UI localisation** via `chrome.i18n` — the interface is French-only while all
  documentation and the Store listing are in English

**Exit condition:** all of the above is ready and the extension has been used
throughout Phase 1 with no blocking bug encountered.

---

## Phase 3 — Initial publication

**Entry condition:** Phase 2 complete.

**To do:**

- Create a Chrome Web Store developer account (one-off 5 USD)
- Submit the extension (Google review takes a few days)
- Publish as **Unlisted** first — direct URL, not visible in search
- Share the URL with a small circle: friends, colleagues, tech community
- Collect the first feedback over a meaningful period

**Exit condition:** at least a few external users have tested it and given
qualitative feedback.

---

## Phase 3.5 — Assisted methodology

**Status: built, unpublished**

Inserted out of sequence, at the author's request, while Phase 3 is still blocked on
its own non-code items. It does not replace Phase 3.

**What it does:** turns a captured impulse into a numbered methodology — 4 to 8
concrete steps, the first one doable in under 10 minutes — shown in a dedicated tab
with the impulse list on the left (25%) and the methodology on the right (75%).
Step completion is tracked locally.

**How it works:** a native messaging host runs `claude -p` on the user's own machine,
under their own Anthropic account. A Chrome extension cannot spawn a process, so
native messaging is the only browser-supported bridge.

**Deliberate constraints:**
- Off by default. Without the native host installed, the feature is inert and no
  network call is ever made — the strictly-local promise holds for anyone who
  doesn't install it.
- Only the single impulse being acted on is sent. Never the queue, never the history.
- No account, no API key, no server on Airlock's side.

**Known tension with Phase 3:** an extension that requires a separately installed
native host cannot be distributed through the Chrome Web Store alone. Either the
Store build ships without this feature, or the feature stays a developer-mode extra.
That decision is still open.

**Also required by this phase:** both privacy policies were rewritten. "No data ever
leaves your device" was no longer true unconditionally, and they are published legal
documents.

---

## Phase 3.6 — Banner redesign

**Status: built, unpublished**

The claude.ai reminder was a strip pinned to the top of the page with everything on
one line. It got in the way, it could not be moved, and once dismissed it was silent
until the next navigation.

**What changed:**
- Anchored bottom right by default, out of the reading path
- Draggable by its header, with the position kept across page loads and clamped back
  into view when the window shrinks
- One pulse per minute, starting 30 seconds after the page loads. A reminder, not an
  alarm: it never fires while dragging, never on a background tab, and is dropped
  entirely under `prefers-reduced-motion`
- Redesigned around a clear hierarchy. The focus text is the dominant element,
  the label sits above it in small caps, and the queue count moved to a separate
  footer chip instead of competing on the same line
- Dark neumorphism, consistent with the methodology view

The rule that kept the banner quiet is unchanged: on an existing conversation with no
focus set, nothing is shown.

---

## Phase 4 — First improvement wave (data-driven)

**Entry condition:** Phase 3 complete and user feedback collected.

**Principle:** only code features requested by several different users, OR that solve a
problem actually experienced during Phase 1.

**Priority candidates**, roughly by likelihood of being asked for:

- **Archive view**: items in a list or masonry layout with a toggle, distinct creation
  and completion dates, success emoji on completed items, reduced opacity and
  strikethrough. Belongs on the Options page, not in the popup.
- **Tags or categories** to group impulses by project
- **Light stats**: number of impulses captured, switch/queue/drop ratio, oldest items
  in the queue
- **Editing an existing item** (currently you must delete and recapture)
- **Drag-and-drop reordering** of the queue
- **Search** across captured items
- **Themes** (light/dark auto, based on `prefers-color-scheme`)
- **Optional notifications**: a reminder when a focus has been idle for a long time

**Exit condition:** one or two features added, validated by usage, without inflating
the UI to the point of losing the simplicity of the airlock.

---

## Phase 5 — Going public

**Entry condition:** Phase 4 confirmed that the new features hold up and did not
degrade the experience.

**To do:**

- Switch from "Unlisted" to "Public" on the Chrome Web Store
- Communicate on relevant channels (Product Hunt, Hacker News, r/productivity, ADHD
  communities, Twitter/X, LinkedIn)
- Simple presentation page
- Set up a feedback channel (GitHub issue tracker, contact form)

**Exit condition:** a steady flow of installs and user feedback.

---

## Phase 6 — Structural evolutions (if the extension found its audience)

**Entry condition:** a significant, engaged user base plus recurring feedback
justifying heavier work.

**Possible directions**, to be prioritised by actual demand:

- **Optional cloud sync** (strict opt-in) via a self-hosted backend or
  Supabase / PocketBase / other. Architecture: end-to-end encryption, to preserve the
  original privacy argument.
- **Multi-device**: mobile extension (installable PWA or native app), Firefox version,
  Safari version
- **Integrations**: Notion, Obsidian, Todoist (item import/export)
- **Team mode**: a shared queue for a pair working on the same project
- **Public API** to plug in other tools (n8n, Zapier-like)
- **Business model**: freemium if cloud sync / multi-device / team mode are requested.
  The local core stays free forever.

**None of these will be started without explicit, recurring user demand.**

---

## Guiding principles (to keep in mind at all times)

1. **The airlock must stay an airlock.** If friction of use goes up, we've left the
   concept behind.
2. **Local-first is non-negotiable**, except with clear, encrypted opt-in.
3. **No feature added in anticipation.** We add when we have proof of need, not before.
4. **If the author stops using the extension, everything stops.** No zombie product.
5. **The popup UI does not grow.** Anything heavy goes on the Options page.
6. **No telemetry, no analytics, no tracking.** Not even "anonymised". That's the
   differentiating argument.

---

## Informal project health indicators

To self-assess periodically, not to measure obsessively:

- Am I still using the extension?
- When I use it, do I gain time or clarity?
- When I open the code to change something, is it still understandable and light?
- Is user feedback more "I have something to report" (engagement) or "here's an idea"
  (distant curiosity)?

If the answers degrade, roll back, simplify, or kill the project without remorse.
Better a dead extension than a bloated one.
