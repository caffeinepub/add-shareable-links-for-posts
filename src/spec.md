# Specification

## Summary
**Goal:** Let authenticated users copy a shareable link to the app’s main entry route.

**Planned changes:**
- Add a small frontend utility that builds the app’s share URL using the current hash-based routing convention (`window.location.origin + '/#/'`) and reuses the existing `copyToClipboard` helper used for invite links.
- Add an always-available “Share” action in the authenticated app shell navigation (e.g., `AppNav`) that copies the app link and shows success/failure toasts via the existing `sonner` pattern, with English text.

**User-visible outcome:** Authenticated users can click “Share” in the app navigation to copy the app’s main link to the clipboard and see a confirmation (or error) toast.
