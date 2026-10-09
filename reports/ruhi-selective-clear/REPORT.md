# Ruhi selective-clear correction

“Clear all except circle” previously parsed as an unconditional DELETE:ALL. The exception was discarded, and the native renderer received a blanket clear signal.

The parser now retains the objects to preserve. The executor resolves every exception before deleting anything, preserves all matching circles rather than choosing just the latest one, and sends individual deletion commands instead of a clear-all signal. Explicit labels, colors, multiple shape types and selected-object references are supported. Required construction parents are retained so dependent objects remain valid. Unknown, incomplete or malformed exceptions leave the scene untouched. Existing undo/redo behavior remains available.

Added 65 validated training examples covering 13 phrasings across all five assistant modes. The existing neural model already recognizes the delete action; this defect was in deterministic interpretation and execution. Model weights were not retrained or replaced. The corrected behavior takes effect immediately through the existing engine.

Validation:
- 110 targeted selective-clear and blanket-clear tests passed.
- 4,859 language, conversation and v4.1 regression tests passed.
- 32 browser checks passed across 2D graph, 3D graph, 2D geometry and 3D geometry, with zero runtime errors. Verified real native circle identities and geometry, undo/redo, and incomplete-exception safety.
- Targeted ESLint passed.
- Student production build passed.
- Full TypeScript check: 123 pre-existing errors remain elsewhere; no errors in the changed files.

Training rows: [training-examples.jsonl](training-examples.jsonl).
Browser evidence: [native-browser.json](native-browser.json).

Historical tracked test reports were preserved; fresh regression evidence is saved in this report directory.
