# Legal documents — Airlock

## Language note

Documentation across this repo is in English, but two of these files are deliberately
**kept in French**:

- `MENTIONS-LEGALES.md` — French law (LCEN) requires a legal notice from anyone
  publishing an online service to a French audience. Translating it would defeat its
  purpose.
- `POLITIQUE-CONFIDENTIALITE.md` — the French localisation of the privacy policy,
  served to French-speaking users.

`PRIVACY-POLICY.md` is the English version, and it is the one the Chrome Web Store
requires.

## What you need to do

### 1. Complete the legal notice

Open `MENTIONS-LEGALES.md` and fill in the remaining `[À COMPLÉTER]` placeholders:

- Legal status (sole trader, individual, company…)
- Postal address
- SIREN/SIRET number if applicable
- Hosting provider
- Source code licence

These fields require a verifiable legal identity — a pseudonym has no legal value
there.

### 2. Host the documents (required by the Chrome Web Store)

The Store requires a **public URL** for the privacy policy. Two options:

**Option A — your own domain** (recommended, you stay in control)
- Convert the `.md` files to `.html`, or serve them directly
- Suggested target URLs:
  - `https://<your-domain>/airlock/privacy-policy`
  - `https://<your-domain>/airlock/politique-confidentialite`
  - `https://<your-domain>/airlock/mentions-legales`

**Option B — GitHub Pages**
- Enable GitHub Pages on this repo
- Resulting URL pattern:
  `https://<your-handle>.github.io/<repo>/legal/PRIVACY-POLICY`

### 3. Fill the URL into the Chrome Web Store form

When submitting, in the "Privacy" section:

- Paste the `PRIVACY-POLICY` URL (the English version is mandatory)
- Declare **Single purpose**: "Capture and prioritise user-entered focus items locally"
- Tick **"This extension does not collect or use user data"**

## Available files

| File | Purpose |
|---|---|
| `PRIVACY-POLICY.md` | English version — serve this as the primary URL |
| `POLITIQUE-CONFIDENTIALITE.md` | French version for French-speaking users |
| `MENTIONS-LEGALES.md` | French legal obligation, as soon as you publish an online service |

## No separate terms of service needed for v1

As long as:

- The extension is free
- No user account is created
- No transaction takes place
- No data leaves the machine

…a clear privacy policy plus the legal notice is enough. Add terms of service if you
move to freemium or add a backend.
