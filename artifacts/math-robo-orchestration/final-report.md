# Ruhi conversational orchestration report

Ruhi now routes specialist mathematics through the existing engines, retains bounded conversational math context across workspace switches, and commits supported geometry actions into the native 2D/3D workspaces. No new CAS was created. Existing model weights and production datasets were preserved.

## Verification

| Check | Result |
|---|---|
| Intelligence and offline regression tests | 4871 passed |
| Conversation corpus | 600/600 utterances across 120 independent conversations |
| Real browser conversations | 35/35 turns over all four native workspaces |
| Browser errors | 0 page errors; 0 console errors |
| Production build | Passed |
| Scoped integration TypeScript | Passed |
| Student production security browser test | Passed |
| Repository-wide TypeScript | 218 errors outside the Math Robo/offline integration |

The 600-turn corpus exercises actual semantic routing and a committed-map workspace adapter, including independently checked area/volume expectations. It is not a claim of 600 real-browser turns or neural model accuracy. In-process corpus latency: mean 0.5 ms, p95 0.7 ms; this excludes UI/model startup.

Both required native-browser conversations passed. The rectangle ends with area 48 after doubling its width and rotating; its midpoint and perpendicular remain dependent on the rectangle. The outer triangle and joined midpoint triangle retain the medial relationship after scaling: areas 48 and 12, side ratio 1/2, area ratio 1/4. Existing construction evaluation recomputes dependent objects after parent changes; undefined constructions hide until valid again. Undo and committed-object selection remain coherent.

Additional focused tests cover shared mathematical context with isolated workspace scenes, named tangent points, manual native edits, 3D midpoints, percentage resizing, unit mismatch rejection, actual solver steps, derivative-result plotting, variable/notebook memory, dataset clarification, practice grading, and inverse verification.

## Architecture and supported scope

The audited registry exposes 47 engine groups and 263 typed capability descriptors. Native exports are validated in capabilities.json. Lazy adapters reuse problem solver, CAS notebook, construction, graph sampling, exact arithmetic, units, matrices, sets, logic, statistics and the existing subject/studio engines. Results carry answers, steps, warnings and verification rather than inventing explanations independently of the math engine.

Natural-language routes cover the tested geometry and common solver/statistics/set/unit commands. Advanced capabilities use the explicit allowlisted form `Run engine.operation [JSON arguments]`; malformed arguments and native engine errors are reported. Capability discovery reflects registered operations, not every repository export.

Specialist memory is bounded to 25 recent results/turns, 25 variables, 25 notebook cells and 12 assumptions, with datasets capped at 100,000 values. This dataset capacity does not mean production model training was performed. Clarification requests retain their pending context and can be cancelled by a new unrelated command.

## Training boundary and model preservation

Student builds reject callable training, correction-learning/reset and model-export APIs, in addition to hiding admin routes and panels. Runtime inference remains available; candidate corrections stay queued rather than becoming production weights. The admin build is a build-time boundary and must be deployed privately; it is not an account authentication service. No external/cloud inference was introduced.

Weights: `public/models/math-robo-intelligence-v4/weights.bin`, 467572 bytes; SHA-256 `315d8161f4ff311db2e7850ef5e6d0f5362fa2f53cede767e2a12f2b2907ce3d`. Unchanged from Git HEAD: true. No production weights were retrained or replaced.

## Remaining limits

The preceding 100-case browser suite passed 98/100; rays and directed vectors remain unsupported by this conversational execution path. Arbitrary natural language for every registered specialist function is not implemented. Spreadsheet, AR and animation computation interfaces are registered, but native editing/playback for those pages is not fully bridged. Teaching/quiz breadth is limited to existing solver steps and practice families. Repository-wide TypeScript still fails on unrelated existing workspace/studio typing issues; the scoped orchestration integration passes.

## Evidence

- engine-audit.md and engine-inventory.json: audit before this upgrade.
- capabilities.json: actual capability catalog and export validation.
- 600-utterance-results.json: prompts, responses, routing, mutation expectations and before/after state.
- browser-results.json and workspace screenshots: native browser traces and committed objects.
- regression-tests.txt, build.txt, scoped-typecheck.txt, full-typecheck.txt, student-security.txt: verification logs.

The application remains available on port 9867. Current-task changes are left reviewable in the workspace; no additional commit/push was requested for this attachment.
