# Teacher authoring and extension security

Authoring resources use schema blocks for explanations, definitions, theorems, examples, misconceptions, 2D/geometry/CAS/data/simulation/3D activities, investigations, practice, assessments, projects, rubrics and pathways. Stable versions, dependencies, accessibility descriptions, comments, approvals and curriculum references are validated.

The state machine is `DRAFT → IN_REVIEW → CHANGES_REQUESTED/APPROVED → PUBLISHED → RETIRED/SUPERSEDED`. Broken references block review. Unresolved comments block approval. Publication requires a recorded mathematics reviewer identity; the system never fabricates one.

Extension API v1 validates IDs, API compatibility, permissions, capabilities, resource limits, tests and provenance. It rejects self-declared board certification and forbidden runtime capabilities. Host invocations receive structured clones and enforce permission, operation and output budgets. The current host is a pure structured callback boundary, not a complete worker/iframe or OS-level sandbox; network, filesystem, tokens, learner data, DOM and arbitrary evaluation are not exposed.

