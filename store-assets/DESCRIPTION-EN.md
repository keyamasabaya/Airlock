# Chrome Web Store listing — English

Primary listing. All project documentation is in English.

> **Open point:** the extension interface is still French only. Either localise the UI
> via `chrome.i18n` before publishing, or keep the note at the bottom of the detailed
> description so English-speaking users are not misled. Remove that line once the UI is
> localised.

## Extension name

```
Airlock — Capture & prioritise
```

*(Store max 45 characters; 30 here)*

---

## Short description

Paste into the "Short description" field. **132 characters maximum.**

```
An airlock between impulse and action. Capture the idea instead of diving into it. 100% local, zero telemetry.
```

*(110 characters)*

---

## Detailed description

Paste into the "Detailed description" field. 16,000 characters maximum.

```
You're working. An idea arrives. You dive straight in. Two hours later you realise you dropped something more urgent.

Airlock puts a buffer zone between the impulse and the action.

━━━━━━━━━━━━━━━━━━━━━━━━

HOW IT WORKS

Ctrl+Shift+Q from any tab. Type the impulse. Enter.

• If you have no current focus, the impulse becomes your focus.
• If you already have a focus, Airlock asks the only question that matters: does this go first?

Three possible answers:
→ switch — the new impulse becomes the focus, the old one moves to the queue
→ queue — it waits its turn, your current focus is preserved
→ drop — discarded, and that's perfectly fine

When you finish a focus, one click on ✓ archives it and the first queued item automatically takes its place.

━━━━━━━━━━━━━━━━━━━━━━━━

WHY THIS IS DIFFERENT

Friction is what kills productivity tools. If capturing a thought means opening an app, picking a project and filling in three fields, you won't do it. You'll dive into the impulse instead.

Airlock lives in Chrome, opens from the keyboard, and asks for one thing only: the text of the impulse. No project to pick, no due date, no priority to assign, no account to create.

This is not a task manager. It's an airlock.

━━━━━━━━━━━━━━━━━━━━━━━━

YOUR DATA STAYS PUT

• 100% local storage via chrome.storage.local
• No server, no account, no sync
• No data ever leaves your machine
• No telemetry, no analytics, no tracking — not even "anonymised"
• One permission requested: "storage"

An Options page lets you export your data as JSON at any time, and import it back. Backup stays under your control.

━━━━━━━━━━━━━━━━━━━━━━━━

PASSIVE REMINDER ON CLAUDE.AI

If you use claude.ai, a discreet banner reminds you of your current focus when you open a new conversation — exactly the moment context-switching happens. And if you have no focus set, it suggests setting one before you dive in.

Dismissible in one click. No conversation content is ever read.

━━━━━━━━━━━━━━━━━━━━━━━━

WHAT AIRLOCK DOES NOT DO

• No notifications interrupting you
• No gamification, no streaks, no score
• No time tracking
• No productivity reports
• No AI reshuffling your priorities for you

The decisions stay yours. Airlock only forces you to make one.

━━━━━━━━━━━━━━━━━━━━━━━━

SHORTCUT

Ctrl+Shift+Q by default, changeable at chrome://extensions/shortcuts if the shortcut is already taken.

━━━━━━━━━━━━━━━━━━━━━━━━

Note: the extension interface is currently in French.

Open source, MIT licence.
```

---

## Form fields

| Store field | Value |
|---|---|
| **Category** | Productivity |
| **Language** | English |
| **Single purpose** | Capture and prioritise user-entered focus items locally, in order to reduce context switching. |
| **`storage` permission justification** | Persist the current focus, the priority queue and the history of completed items locally. No data is transmitted. |
| **`claude.ai` host access justification** | Display a banner reminding the user of their current focus when a new conversation is opened. No page content is read or transmitted. |
| **Data usage** | Tick "This extension does not collect or use user data". |
| **Privacy policy URL** | *(to be filled — see `airlock-extension/legal/README.md`)* |
