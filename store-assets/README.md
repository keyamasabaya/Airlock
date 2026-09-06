# Chrome Web Store assets

Everything used for the Store listing, kept outside `airlock-extension/` so it does not
bloat the packaged archive (the `.gitignore` already excludes `*.zip`).

## Contents

| File | Purpose |
|---|---|
| `screenshots/1-capture.png` | Screenshot 1 — capturing the impulse |
| `screenshots/2-decision.png` | Screenshot 2 — the "does this go first?" decision |
| `screenshots/3-priorisation.png` | Screenshot 3 — one focus, an ordered queue |
| `DESCRIPTION-EN.md` | Listing copy in English, ready to paste — primary listing |
| `DESCRIPTION-FR.md` | Listing copy in French, ready to paste — French localisation |
| `SUBMISSION-CHECKLIST.md` | Phase 3 — blockers, packaging, and the Store form field by field |

## Screenshots

**1280×800 PNG**, one of the two formats the Store accepts (the other being 640×400).
They follow the narrative the roadmap called for: problem → capture → prioritisation.

The popup visuals are **real captures of the extension**, taken by loading
`airlock-extension/` into Chromium and driving the popup — not mockups. The popup is
captured at 2× then composed at 1× so it stays sharp at final size.

> **Known mismatch:** the marketing copy on these screenshots is in English while the
> popup UI visible inside them is still in French. Localise the UI via `chrome.i18n`
> and regenerate these before publishing an English listing.

### Regenerating them

The generation script is not versioned — it depends on Playwright and a local Chromium,
outside the scope of a build-step-free extension. To redo the screenshots after a UI
change:

1. load `airlock-extension/` into Chromium with `--load-extension`
2. inject the desired state via `chrome.storage.local.set({ airlock_state: … })`
3. screenshot `chrome-extension://<id>/popup.html`
4. compose onto a 1280×800 canvas

## Still missing before publishing

- **UI localisation** — the interface is French-only while the listing and all
  documentation are in English. This is the biggest remaining gap.
- **Store icon** — the Store wants a dedicated 128×128 icon.
  `airlock-extension/icons/icon128.png` can serve, but the roadmap calls for final
  icons validated at 16px.
- **Promotional image** 440×280 — optional, only needed to be featured.
- **Public privacy policy URL** — mandatory. See
  `airlock-extension/legal/README.md`.
- **Completed legal notice** — legal status, address, SIRET, host, licence.
