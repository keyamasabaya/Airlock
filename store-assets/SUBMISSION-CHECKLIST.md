# Chrome Web Store — submission checklist

Phase 3 of the roadmap. Work through the blockers first: the Store rejects a
submission that is missing any of them.

---

## Blockers — nothing can be submitted until these are done

### 1. Public privacy policy URL — mandatory

The Store requires a publicly reachable URL. `docs/` in this repo is ready to be
served by GitHub Pages; it just needs turning on:

1. Repo **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`, folder **`/docs`**, then Save
4. Wait for the first deploy, then check:
   `https://keyamasabaya.github.io/Airlock/privacy-policy.html`

That URL is what goes in the Store form.

> `docs/` is generated from the Markdown in `airlock-extension/legal/` by
> `python3 docs/build.py`. Re-run it after editing any legal document, and commit
> the result.

### 2. Complete the legal notice

`airlock-extension/legal/MENTIONS-LEGALES.md` still has `[À COMPLÉTER]`
placeholders: legal status, postal address, SIREN/SIRET, hosting provider,
source-code licence.

French law (LCEN) requires a verifiable legal identity from anyone publishing an
online service to a French audience. A pseudonym has no legal value on those
fields. Re-run `docs/build.py` afterwards.

### 3. Developer account

One-off 5 USD registration fee at
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

---

## Strongly recommended before submitting

### UI language

The interface is **French only** while the listing and all documentation are in
English. This is visible in the screenshots themselves — English marketing copy
next to a French popup.

Either localise the UI via `chrome.i18n` (French as fallback), or publish the
French listing only. Submitting an English listing with a French UI invites
one-star reviews from users who feel misled.

### Final icons

The roadmap calls for final icons validated at 16px. The current ones are
placeholders. The Store also wants a dedicated 128×128 listing icon.

### Cross-OS testing

Only tested on Chromium/Linux so far. Test at least on Windows.

---

## The package

```bash
./package.sh
```

Produces `airlock-<version>.zip` containing only what the extension executes —
`manifest.json` at the root, the four HTML/JS pairs, the CSS, and the four icon
sizes Chrome actually uses. Docs, roadmap and Markdown legal sources are
deliberately excluded.

The script verifies that `manifest.json` sits at the root and that every file it
references is present. The archive is git-ignored (`*.zip`); rebuild it rather
than committing it.

---

## Filling in the form

Copy from [`DESCRIPTION-EN.md`](DESCRIPTION-EN.md) — French localisation in
[`DESCRIPTION-FR.md`](DESCRIPTION-FR.md).

| Field | Value |
|---|---|
| **Name** | `Airlock — Capture & prioritise` |
| **Short description** | see `DESCRIPTION-EN.md` (110 chars, under the 132 limit) |
| **Detailed description** | see `DESCRIPTION-EN.md` |
| **Category** | Productivity |
| **Language** | English |
| **Screenshots** | the 3 PNGs in `screenshots/`, 1280×800 |
| **Privacy policy URL** | the GitHub Pages URL from step 1 |
| **Single purpose** | Capture and prioritise user-entered focus items locally, in order to reduce context switching. |
| **Data usage** | Tick **"This extension does not collect or use user data"** |

### Permission justifications

The Store asks for one per permission. Reviewers scrutinise host permissions in
particular, so be precise:

- **`storage`** — Persist the current focus, the priority queue and the history of
  completed items locally. No data is transmitted.
- **`https://claude.ai/*`** — Display a banner reminding the user of their current
  focus when a new conversation is opened. The extension does not read, log or
  transmit any page content.

> Expect the `claude.ai` host permission to draw a question during review. The
> justification above is accurate: `content.js` only injects a banner element and
> reads `chrome.storage.local` — it never touches page content.

---

## Publish as **Unlisted** first

The roadmap is explicit: Unlisted, not Public. You get a direct URL, invisible in
Store search. Share it with a small circle, collect qualitative feedback, and only
switch to Public in Phase 5, once Phase 4 has confirmed the extension holds up.

Google review typically takes a few days.

---

## After acceptance

- Share the URL with a small circle
- Set up a feedback channel — GitHub issues on this repo is enough to start
- Collect feedback over a meaningful period before touching the code again;
  Phase 4 only codes what several different users actually ask for
