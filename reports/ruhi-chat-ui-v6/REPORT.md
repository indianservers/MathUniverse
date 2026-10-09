# Ruhi Chatbot UI v6.0

Implemented in the existing Math Universe app, served on http://localhost:9867.

## Changes

- Snow-white and light-blue conversation window with the existing Ruhi mascot, user/assistant bubbles, timestamps, a fixed header and a fixed multiline composer.
- Searchable Help Center with eight compact categories, page-specific ordering and Try actions that fill the composer for review.
- Settings retain cinematic motion, voice, local corrections, command library, model information and developer tools under their existing authorization guards. Added persistent chat preferences for preview opening and long-answer summaries.
- Conversations survive closing/reopening Ruhi and workspace navigation within the current app session. History is bounded to 80 messages; it is not stored across app reloads.
- Clarification choices use actual pending slots and scene candidates. Direction suggestions appear for a pending movement direction; distance suggestions retain the direction already chosen. Cancel pending request uses the existing cancellation response.
- Existing math rendering displays formulas and working. Long answers are summarized with expandable detail. Existing execution evidence and verification information remain visible.
- Automatic scrolling reveals the beginning of each new answer. Manual scrolling through older messages preserves the reading position and displays a New response button.

## Workspace integration

No graph, geometry, NLP, mathematical kernel, voice or cinematic engine was rebuilt.

Conversation cards reuse GeometryEmbeddedGraph, which embeds the existing MathLabGraphingCalculator and MathLab3DGraphing workspaces. 3D geometry uses the existing GeometryEmbeddedSolid adapter. Only one historical preview is mounted at a time. Preview edits transfer through the adapter's existing Open full workspace action. Attach canvas reads the current native scene, falling back to the assistant scene when appropriate.

Graph details reuse existing function analysis and clearly describe numerical findings within the analysis interval, rather than claiming a global proof or universal domain/range.

## Validation

- Browser integration: 26/26 checks passed, zero runtime errors. Includes CAS, real 2D/3D rendering, workspace handoff, conversation retention, movement follow-ups, triangle editing, Help search, Try, cancellation, mobile overflow, multiline input, scrolling and Escape.
- Conversation regressions: 487/487 tests passed across conversationEngine and phase2Conversation.
- Targeted ESLint: passed for both assistant components.
- Full TypeScript check: 123 existing errors remain outside the changed assistant files; no errors were reported for OfflineMathAssistant or RuhiChatWindow.
- Student production build: passed. Offline installation manifest contains 1,095 files, totaling 160,864,892 bytes. The final scroll guard was confirmed in the built bundle.
- Browser checks blocked remote network requests and used reduced-motion preferences. Microphone permissions and real spoken audio were not automated.

## Screenshots

- [Desktop 2D graph](graph2d-desktop.png)
- [Mobile 2D graph](graph2d-mobile.png)
- [Desktop 3D graph](graph3d-desktop.png)
- [Mobile 3D conversation](graph3d-mobile.png)
- [Help Center](help-desktop.png)
- [Settings](settings-desktop.png)

No commit or push was performed for this UI request. Existing unrelated working-tree changes were retained.
