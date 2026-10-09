# Ruhi v6 Phase 2 architecture

This upgrade extends the existing browser pipeline. It does not introduce a server reasoner, external inference API, new CAS or large language model. Phase 1's actual contracts and reproduced evidence are documented in `../ruhi-v6-phase1/PHASE-1-FINAL-REPORT.md`.

## Execution

Text enters `liveAssistant`, the existing request classifier, parser and neural proposal adapters. Neural confidence proposes an interpretation; operation registration, parameter validation, target resolution, dry-run planning, dependency evaluation and native commit verification determine whether it can execute. `SemanticEngine` serializes effects and rolls back failed commits. Phase 1's independent verification contract remains authoritative.

The published primary classifier already has shared 128/64 encoders and action/subaction/mode/object heads. The published context model already has an 848-feature shared 64-unit encoder and intent/meaning heads. Phase 2 evaluates a smaller context encoder rather than adding unmeasured heads. The candidate is not wired into student inference or promoted.

## Conversation, references and ambiguity

`conversationState.ts` provides a typed read-only projection of working memory, session tasks/results/assumptions/evidence and saved project objects with dependency versions. Existing scene and undo stacks remain authoritative. Explicit scene envelopes persist mathematical objects and history; pending neural interpretations are not a new persisted authority.

Relative dimensions use current physical dimensions, preserving the other dimensions and style. Active angles accept word-number increments. Ambiguous "that circle" requests retain the original movement until an ordinal/label selects the target. A vague resizing request asks for a scale factor. A point plus angle defines an infinite 2D line; it never invents a finite vector's length.

References include existing IDs, labels, selection, ordinals, colors, recency and geometric attributes. New bounded adapters resolve a 2D line passing through a named point and a triangle inside a circle by actual incidence/containment. Previous line length reads retained geometry, with a live-object check. Pending operations record referenced geometry versions; externally modified/deleted geometry invalidates them.

Specialist routers are now per workspace. Context assistants are scoped by workspace and page, with at most 32 retained instances. Page changes clear specialist/conversation/tutor task memory while preserving workspace objects. Saved project context is explicit, not a global learned memory. Loading a scene clears pending operations, specialist state, tutor state and cached proof results.

## Planning and constructions

`actionGraph.ts` exposes ordered nodes, references, preconditions, dependencies, output categories and all-or-nothing atomicity. It feeds the existing executor; it is not a second executor. Semicolon/command boundaries support create → transform → measure → explain → verify. A false claimed measurement returns false; invalid dimensions reject the entire dry run.

All three triangle medians and vertex centroids now carry live dependencies through the existing construction engine. Triangle centroids preserve all three coordinates and update after translation in both 3D workspaces. Median endpoints remain the vertex and exact side-midpoint construction, rather than an arbitrary normalized line length. Circumcircles retain their existing parent definition. Native effects, undo and saved import preserve these dependencies.

## Mathematical questions, page grounding and tutoring

`mathQuestionRouter.ts` contains bounded coordinate checks for circumcenter equidistance and 2D parallel directions. It labels floating point evidence as numerical consistency, not exact proof. Existing kernel, reviewed-topic and visualization routes remain available. Unsupported general proofs remain unsupported.

`PageMathContext` carries route/topic/vocabulary, current selected objects/angles/expressions, constraints and reviewed definitions/formulas/proofs/examples with source provenance. Registered simulation capabilities retain precedence. Unit-circle metadata is explicitly reviewed; unregistered topics get a safe unsupported response. This is not comprehensive mathematical coverage of every page or a general live simulation adapter.

`GroundedTutor` currently supports scene-grounded rectangle/square area exercises: exact numeric answer checks, equivalent fractions, progressive hints, perimeter-versus-area feedback and brief/detailed explanations. It invalidates an exercise after its geometry changes. Existing quiz/practice specialists remain available. General misconception learning and unrestricted Socratic tutoring are not claimed.

## Trainer boundary

Student builds set `VITE_ENABLE_MODEL_TRAINING=false` and exclude trainer assets. Direct training calls are tested to reject in that profile. The candidate CLI requires an explicit trainer/dev invocation, writes only Phase 2 reports, and has no promotion operation. Distributed student assets expose no filesystem write API for published weights.

An offline browser cannot securely authenticate its device owner. Build policy is not trainer authentication, and client role flags are not a security boundary. Privileged dataset/model reports belong to the development checkout; they are not included in the student distribution. Publication/rollback require an authorized release process outside student inference.
