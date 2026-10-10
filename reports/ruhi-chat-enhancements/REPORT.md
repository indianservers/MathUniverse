# Ruhi chat enhancements and follow-up audit

Completed: 10 October 2026

All 30 requested chat enhancements are implemented. The chat continues to embed the existing 2D/3D workspaces, use the existing cinematic motion engine, and use the existing local dictation implementation.

## Delivered features

| # | Enhancement | Behavior |
|---|---|---|
| 1 | Draggable header | Reposition the floating window on desktop. |
| 2 | Dock left/right | Choose either side from chat tools. |
| 3 | Size presets | Compact, Balanced, and Wide; manual resizing remains available. |
| 4 | Compact header | Persisted appearance preference. |
| 5 | Font size | Adjustable and persisted. |
| 6 | High contrast | Persisted accessible appearance option. |
| 7 | Workspace badge | Shows the active mathematics workspace. |
| 8 | Full-screen graph preview | Expands the existing embedded workspace and restores previous size on exit. |
| 9 | Linked solution steps | Highlights referenced objects in the actual workspace. |
| 10 | Copy text/LaTeX | Copies plain response text or rendered mathematical source. |
| 11 | Conversation search | Filters messages and shows an empty-results state. |
| 12 | Pinned answers | Persistent answer snapshots, including after refresh. |
| 13 | Named saved conversations | Saves messages, geometry, history, and solver context locally. |
| 14 | Export | Markdown download and browser Print/Save as PDF. |
| 15 | Draft persistence | Separate persisted drafts per workspace. |
| 16 | Edit and resend | Loads the selected request into the composer for explicit resubmission. |
| 17 | Retry | Retries failed requests while retaining their linked object target. |
| 18 | Inline Undo | Available for the most recent eligible actual mutation. |
| 19 | Deletion preview | Displays objects to remove and retain before confirmation. |
| 20 | Keep/delete highlighting | Highlights reviewed deletion targets in the workspace. |
| 21 | Object picker | Selects a specific existing object or resolves a target clarification. |
| 22 | Working-memory inspector | Exposes references and pending conversational state. |
| 23 | Clarification forms | Provides inputs and options for missing parameters. |
| 24 | Autocomplete | Offers relevant commands while composing. |
| 25 | Scene-aware suggestions | Uses the active object and workspace capabilities. |
| 26 | Progressive hints | Advances through available practice hints. |
| 27 | Guided practice | Starts practice and supports hints, answers, examples, and grading. |
| 28 | Command queue | Sequential execution with progress, cancellation, and stop on clarification/error. |
| 29 | Motion controls | Reuses cinematic pause, replay, and speed controls. |
| 30 | Voice transcript review | Dictation fills the composer for review before explicit sending. |

Manual resize supports pointer dragging, arrow keys, Shift for smaller increments, and reset. Layout adapts to phone screens and short viewports; the composer stays visible. Opening chat focuses the composer.

## Follow-up audit and fixes

- Reproduced 16 failing direction-and-distance replies across all four graph/geometry workspaces. Replies such as `Right 2 units`, `left by 3`, `up 1 unit`, and `down 4 units` now complete the pending movement while retaining its object.
- Ambiguous target replies now expose candidate IDs to the UI. Choosing an object continues the pending operation and then accepts its missing direction/distance.
- Practice follow-ups now reach the practice engine. Successive hints advance; showing an answer and submitting an answer preserve quiz context.
- Numeric follow-ups accept the exact solver's stored numeric representation, so `Calculate 2 + 3` followed by `What about double it?` returns 10.
- Saved conversations restore solver context as well as geometry, enabling explanation and numeric follow-ups after restoration.
- Conversation messages and drafts are separated by workspace. Late responses from a previous workspace cannot contaminate the current one.
- Queue steps wait for authoritative completion and stop when user input is required. Unmounting cancels remaining steps.
- Deletion confirmation checks whether geometry changed after review and refreshes the preview when necessary.
- Retry refuses to silently retarget a removed object. Undo eligibility tracks actual mutations and scene state.

## Verification

- 675 automated tests passed across six intelligence/conversation/orchestration suites, including 34 new everyday follow-up regressions.
- 95 real browser checks passed: 56 native-workspace checks and 39 chat UI checks. All four graph/geometry workspaces were exercised with native scene readback, including selective deletion, target clarification, movement, Undo/Redo, and no-mutation error paths.
- Targeted ESLint passed with zero warnings.
- Production build passed.
- Repository TypeScript checking reports 123 pre-existing errors outside the changed files; no diagnostics matched the changed files. A clean repository-wide typecheck remains blocked by those existing errors.

Browser evidence: [UI checks](ui-browser.json), [native workspace checks](native-browser.json). Screenshots: [desktop chat](desktop-chat.png), [desktop tools](desktop-tools.png), [mobile chat](mobile-chat.png).

Print/PDF verification exercised the printable document through a stubbed browser print call, not the operating-system print dialogue. Voice verification covered transcript review; microphone hardware and installed speech packs were not exercised. Saved conversations and preferences use this browser's local storage.

The changes are local and have not been committed or pushed as part of this request.
