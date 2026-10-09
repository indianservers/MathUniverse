# Ruhi v6 conversation tests

Baseline: 7 failed / 4 passed in the initial 11 new tests. Raw failures are retained in `conversation-baseline.txt`; repair logs retain each intermediate result. A wrong color oracle was corrected to the app's existing `COLORS.blue`, rather than changing the app's palette.

The final focused suite has 30 tests, using actual scene snapshots, retained IDs, dependency definitions, independent coordinate oracles and typed execution evidence. `final-focused.txt` records 30/30 passing tests. One resource-contended run timed out at the default 5 seconds; the rerun uses the repository regression suite's 60-second budget, with unchanged assertions.

| Required conversation | Checked behavior |
|---|---|
| A | Rectangle dimensions/color/ID retained; area after rotation; undo only last rotation |
| B | Multiple circles; ambiguity; second-circle choice resumes exact move |
| C | 84 + 2 + 3 = 89 degrees on active angle |
| D | Three medians, centroid, circumcircle; independent endpoint/center/radius incidence; parent translation; undo/import |
| E | Selected angle read from current state; unit-circle reviewed topic; unknown-page safe fallback |
| F | Wrong area answer, progressive hint, equivalent fraction, detailed explanation |
| G | Deleted/stale references and changed tutoring source invalidate follow-ups |
| H | Page changes clear specialist task memory while retaining objects; workspace-scoped routers/context assistants |
| I | Structured create/move/measure/explain/check graph; all-or-nothing invalid-step rejection; one-step undo |
| J | Unsupported general proof; nonparallel lines never verified; 2D proof adapter rejects spatial use |

Additional tests cover physical scale during relative resizing, point-plus-angle line clarification, no inferred finite vector length, invalid SSS triangles, fuzzy scale requests, typed dependency versions, relational references, previous length and malformed circumcenter/radius evidence, proof follow-ups, saved-session reset, explicit construction precedence, rectangle centroids, and three-coordinate live centroids in both 3D workspaces. A missing movement distance cannot be inferred from the numeric suffix of an object label.

`native-browser.json` records 36/36 new native checks, zero page errors, across four workspaces with remote network blocked. It uses the normal assistant entry point and reads committed native objects. 2D-only angle/triangle proof features are exercised in the two 2D workspaces, not represented as 3D coverage.

`conversation-corpus-audit.json` records 456 complete development conversations, 1,824 predeclared-status records, zero failed cases before canonical deduplication. They supplement focused mathematical oracles; runtime-generated command labels are not independent mathematical truth. Exact repeated contexts are removed by `combined-corpus-audit.json`.

Reference/clarification results are small targeted conversation samples, not broad precision estimates. The required A–J cases have direct assertions; unsupported language remains explicit. Original frozen/NLP oracles are unchanged. The scoped suite passed 7,828 tests across 61 files; the final extra missing-distance assertions also passed in the focused suite. Earlier Windows UNKNOWN report-write failures and CPU-contention timeouts are retained. A bounded retry handles transient test-report writes without changing assertions.
