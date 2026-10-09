# Exact five-transcript coverage

Source: reports/ruhi-v5.3/focused-conversations.json. The test reads the original turn text; no missing coordinates, angles or lengths are inserted. Matrix artifacts record execution status, clarification and message for every turn. Unit transcripts use a native-command mirror, not browser screenshots. Native browser parity and save/reload have separate artifacts.

| Transcript | geometry2d | graph2d | geometry3d | graph3d | Limitation |
|---|---|---|---|---|---|
| 1 | S S S S S S | S S S S S S | S S S S S S | S S S S S S | Radius 5, translation, scale to 10 and undo to 5 tested. |
| 2 | S S C S S S | S S C S S S | S U C S S S | S U C S S S | Missing AB length and anchoring require clarification; dependency explanation preserves pending intent; Undo removes the last completed construction. Explicit completed side edit + circumcircle is separately verified in 2D. 3D circumcircle unsupported. |
| 3 | C C C C C I | C C C C C I | C C C C C I | C C C C C I | Missing four line endpoints blocks the construction; missing intersection cannot be invented. Explicit four-endpoint completion, intersection, circle radius and color undo are separately tested in phase1Integrity.test.ts. |
| 4 | S S S S S S | S S S S S S | S S S S S S | S S S S S S | Native rectangle dimensions, rotation and semantic export/import/history tested. |
| 5 | C C C C S | C C C C S | C C C C S | C C C C S | Endpoints and angle are missing; no vector or rotation is invented. General length-preservation explanation distinguishes absence of a completed rotation. |

S = completed; C = clarification; U = unsupported; I = invalid request given the current scene. This is a coverage matrix, not a claim that all 20 conversations are fully completed. Unresolved ambiguity remains blocked.
