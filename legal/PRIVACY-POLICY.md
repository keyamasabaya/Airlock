# Privacy Policy - Airlock Extension

**Last updated: May 19, 2026**

## Summary

Airlock stores everything locally. **We operate no server, collect nothing, and have no access to your data.** All information you enter (impulses, focus items, completed tasks) is stored exclusively in your browser's local storage on your machine.

**One optional feature is an exception, and it is off unless you install it:** the methodology generator sends the text of a single impulse to Anthropic, through the Claude Code CLI running on your own machine, under your own Anthropic account. See "Methodology generation" below. If you never install the native host, no data ever leaves your device.

## Data we collect

We do NOT collect any data. The extension stores the following information locally on your device only:

- Text you type as "impulses", "focus", or queue items
- Timestamps of when items are created and completed
- Generated methodologies and which of their steps you have ticked off
- Your preferences (keyboard shortcut, display options)

This data is stored using the Chrome `storage.local` API and remains on your computer. It is never transmitted to us or to any server we control — we have none.

## Methodology generation (optional)

Airlock can turn an impulse into a numbered methodology. This feature is **not active by default**: it requires you to separately install a native messaging host on your machine, and to have [Claude Code](https://claude.com/claude-code) installed.

When — and only when — you click "Generate methodology":

- The text of **that single impulse** is placed into a prompt and passed to the `claude` command-line tool running locally on your machine
- That tool sends the prompt to **Anthropic**, using **your own Anthropic account and its own authentication**. Airlock has no account, no API key, and no server in this path
- The returned steps are stored locally, like the rest of your data

What this means concretely:

- Your other impulses, your queue and your history are **never** sent — only the one impulse you act on
- The data goes to Anthropic, so **Anthropic's privacy policy and terms apply to that exchange**: <https://www.anthropic.com/legal/privacy>
- Airlock never sees the prompt or the response. Nothing is logged, and the native host writes nothing to disk
- If you do not install the native host, this feature is inert and no network call is ever made

If you want the extension to stay strictly local, simply do not install the native host.

## Data we do NOT collect

- We do not collect personally identifiable information (PII)
- We do not collect IP addresses
- We do not use analytics or telemetry
- We do not use cookies
- We do not share data with third parties
- We do not sell data (we have no data to sell)
- We do not use advertising networks
- We do not access your browsing history
- We do not read or modify content on websites you visit, except for displaying a passive banner on claude.ai pages

## Permissions explained

The extension requests the following Chrome permissions:

- **`storage`**: To save your impulses and focus items locally on your device
- **`nativeMessaging`**: To reach the optional local host that runs the Claude Code CLI for methodology generation. Without that host installed, this permission does nothing
- **`host_permissions: https://claude.ai/*`**: To display a contextual banner on claude.ai pages showing your current focus. The extension does not read, log, or transmit any content from claude.ai

## Your rights

Because your data stays on your device (barring the optional methodology generation described above):

- **Right to access**: All your data is visible in the extension popup and on the options page
- **Right to erasure**: Click "Reset all" in the popup, or uninstall the extension to delete all data permanently
- **Right to portability**: The options page lets you export all your data as JSON at any time, and import it back
- **Right to rectification**: Edit or delete any item directly in the extension

## Data retention

Data is retained on your device until you delete it manually or uninstall the extension. There is no server-side retention because we have no servers.

## Children's privacy

The extension is not directed at children under 13. We do not knowingly collect any information from anyone, including children.

## Security

Your data is protected by Chrome's standard local storage isolation. We recommend keeping your operating system and Chrome browser up to date.

## Changes to this policy

If we ever change this policy (e.g., if a future version adds cloud sync as an optional feature), we will update this document and notify users via the extension update notes. Cloud sync, if ever added, will always be opt-in.

## Contact

For privacy questions or concerns:
- Developer: keyamasabaya
- Email: github@wespify.com
- Website: https://briake.xyz

## GDPR / CCPA compliance

Because the extension collects no personal data and the developer operates no server, GDPR (EU) and CCPA (California) obligations on the developer are minimal. You retain full control of your data at all times. The lawful basis for the local processing performed by the extension on your device is your consent, expressed by installing and using the extension.

Methodology generation is the only transfer of data off your device. It is optional, requires a deliberate installation on your part, and runs under your own Anthropic account: the controller for that processing is Anthropic, not the developer of Airlock. Its lawful basis is your consent, expressed by installing the native host and then by each click on "Generate methodology".
