# Animation integration audit

The cinematic engine was present before v5.3. No new engine or model planner was introduced in this phase.

Current path: runSemanticAssistant → SemanticEngine pure preparation/verification → workspaceBridge.applyVisualCommand → RuhiCinematicMotionEngine queue → transient motionPreview → exact native commit → dependency recomputation → committed-object verification/history.

The engine uses requestAnimationFrame and eased intermediate values. Exact mathematical scene state stays unchanged during registered preview rendering. Completion commits a structured clone of the exact target. SVG and Three.js preview components render motion separately; native IDs use data-motion-object/point identifiers or userData.ruhiObjectId/immersive IDs. Replay uses preview without committing a new mathematical state.

Semantic dependencies recompute on a cloned preview scene each frame, then recompute on the exact final scene. Native constraints without corresponding semantic dependency metadata are not universally represented. Native owned helper labels can differ during parent preview. Native side panels generally display committed values until completion.

History is captured at semantic command boundaries, while native intermediate history is suppressed. In a renderer-not-yet-registered fallback, native mutation is used for previews; this is an architectural risk for serialization during motion. Registered four-workspace previews avoid it. Global cancellation on workspace unmount affects the shared motion queue. Per-mode semantic command serialization is separate from motion queue cancellation.

Additional risks: compound rotations may use equivalent shortest paths rather than the user's signed full angle; display-fitted 3D surfaces and topology morphs are visual approximations. Final geometry remains subject to native verification. Save during preview should always serialize committed truth, not preview values; race/cancellation coverage should be expanded before a general animation release.

Smallest retained interface: exact start scene + validated target commands + optional rotation pivot/angle → transient preview publisher → exact target commit + dependency verification. Keep IDs stable, suppress intermediate history, cancel with rollback, and compare final native values independently. Do not add a second animation scheduler to the mathematical command path.
